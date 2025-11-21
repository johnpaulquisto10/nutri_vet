<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DiseaseReport;
use App\Models\ReportImage;
use App\Models\ReportStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class DiseaseReportController extends Controller
{
    /**
     * Get all disease reports.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = DiseaseReport::with([
            'reporter' => function ($q) {
                $q->select('id', 'name', 'full_name', 'email');
            },
            'disease.category',
            'status',
            'resolver',
            'images'
        ]);

        // If farmer, only show their reports
        if ($user->isFarmer()) {
            $query->where('reporter_id', $user->id);
        }

        // Filter by status
        if ($request->has('status')) {
            $status = ReportStatus::where('status_name', $request->status)->first();
            if ($status) {
                $query->where('status_id', $status->report_status_id);
            }
        }

        // Search
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('location_description', 'like', "%{$search}%")
                    ->orWhere('symptoms', 'like', "%{$search}%")
                    ->orWhere('custom_disease_name', 'like', "%{$search}%");
            });
        }

        $reports = $query->orderBy('submitted_at', 'desc')->paginate(15);

        // Transform the reports to include image_url and user
        $reports->getCollection()->transform(function ($report) {
            $report->user = $report->reporter;
            $primaryImage = $report->images->where('is_primary', true)->first();
            $report->image_url = $primaryImage && $primaryImage->image_path
                ? asset('storage/' . $primaryImage->image_path)
                : null;
            return $report;
        });

        return response()->json($reports);
    }

    /**
     * Store a new disease report.
     */
    public function store(Request $request)
    {
        // Debug logging
        \Log::info('Disease Report Submission', [
            'has_images_file' => $request->hasFile('images'),
            'all_files' => $request->allFiles(),
            'request_data' => $request->except('images'),
        ]);

        $validated = $request->validate([
            'disease_id' => 'nullable|exists:diseases,disease_id',
            'disease_name_custom' => 'nullable|string|max:255',
            'animal_name' => 'nullable|string|max:255',
            'description' => 'required|string',
            'address' => 'nullable|string',
            'latitude' => 'required|numeric|between:-90,90',
            'longitude' => 'required|numeric|between:-180,180',
            'images' => 'nullable|array|max:5',
            'images.*' => 'image|mimes:jpeg,png,jpg|max:5120',
        ]);

        // Get submitted status
        $submittedStatus = ReportStatus::where('status_name', 'Pending')->first();

        $report = DiseaseReport::create([
            'reporter_id' => $request->user()->id,
            'report_status_id' => $submittedStatus->report_status_id,
            'disease_id' => $validated['disease_id'] ?? null,
            'disease_name_custom' => $validated['disease_name_custom'] ?? null,
            'animal_name' => $validated['animal_name'] ?? null,
            'description' => $validated['description'],
            'address' => $validated['address'] ?? null,
            'latitude' => $validated['latitude'],
            'longitude' => $validated['longitude'],
            'report_date' => now()->toDateString(),
            'submitted_at' => now(),
        ]);

        // Handle image uploads
        if ($request->hasFile('images')) {
            \Log::info('Processing images for report', ['report_id' => $report->report_id]);
            foreach ($request->file('images') as $index => $image) {
                $path = $image->store('disease-reports', 'public');

                $imageRecord = ReportImage::create([
                    'report_id' => $report->report_id,
                    'image_path' => $path,
                    'image_filename' => $image->getClientOriginalName(),
                    'image_size' => $image->getSize(),
                    'mime_type' => $image->getMimeType(),
                    'is_primary' => $index === 0,
                ]);

                \Log::info('Image saved', [
                    'image_id' => $imageRecord->image_id,
                    'path' => $path,
                    'filename' => $image->getClientOriginalName(),
                ]);
            }
        } else {
            \Log::warning('No images uploaded with this report', ['report_id' => $report->report_id]);
        }

        $report->load(['disease', 'status', 'images']);

        return response()->json([
            'message' => 'Disease report submitted successfully',
            'report' => $report,
        ], 201);
    }

    /**
     * Get a single disease report.
     */
    public function show(Request $request, $id)
    {
        $report = DiseaseReport::with([
            'reporter',
            'disease.category',
            'status',
            'resolver',
            'images'
        ])->findOrFail($id);

        // Check authorization
        $user = $request->user();
        if ($user->isFarmer() && $report->reporter_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($report);
    }

    /**
     * Update a disease report.
     */
    public function update(Request $request, $id)
    {
        $report = DiseaseReport::findOrFail($id);

        // Only reporter can update and only if not resolved
        if ($report->reporter_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($report->status->status_name === 'Resolved') {
            return response()->json([
                'message' => 'Cannot update resolved report'
            ], 422);
        }

        $validated = $request->validate([
            'disease_id' => 'nullable|exists:diseases,disease_id',
            'disease_name_custom' => 'nullable|string|max:255',
            'animal_name' => 'nullable|string|max:255',
            'description' => 'sometimes|string',
            'address' => 'nullable|string',
        ]);

        $report->update($validated);
        $report->load(['disease', 'status', 'images']);

        return response()->json([
            'message' => 'Report updated successfully',
            'report' => $report,
        ]);
    }

    /**
     * Delete a disease report.
     */
    public function destroy(Request $request, $id)
    {
        $report = DiseaseReport::findOrFail($id);

        // Only reporter can delete and only if submitted
        if ($report->reporter_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($report->status->status_name !== 'Pending') {
            return response()->json([
                'message' => 'Cannot delete report that is being investigated or resolved'
            ], 422);
        }

        // Delete images from storage
        foreach ($report->images as $image) {
            Storage::disk('public')->delete($image->image_path);
        }

        $report->delete();

        return response()->json([
            'message' => 'Report deleted successfully',
        ]);
    }

    /**
     * Mark report as under investigation (admin only).
     */
    public function investigate(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $report = DiseaseReport::findOrFail($id);
        $investigatingStatus = ReportStatus::where('status_name', 'In Progress')->first();

        $validated = $request->validate([
            'admin_notes' => 'nullable|string',
        ]);

        $report->update([
            'report_status_id' => $investigatingStatus->report_status_id,
            'admin_notes' => $validated['admin_notes'] ?? $report->admin_notes,
        ]);

        return response()->json([
            'message' => 'Report marked as under investigation',
            'report' => $report->load('status'),
        ]);
    }

    /**
     * Resolve a disease report (admin only).
     */
    public function resolve(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'admin_notes' => 'required|string',
        ]);

        $report = DiseaseReport::findOrFail($id);
        $resolvedStatus = ReportStatus::where('status_name', 'Resolved')->first();

        $report->update([
            'report_status_id' => $resolvedStatus->report_status_id,
            'resolved_by' => $request->user()->id,
            'resolved_at' => now(),
            'admin_notes' => $validated['admin_notes'],
        ]);

        return response()->json([
            'message' => 'Report resolved successfully',
            'report' => $report->load(['status', 'resolver']),
        ]);
    }

    /**
     * Get map data for all reports (coordinates only).
     */
    public function mapData(Request $request)
    {
        $query = DiseaseReport::with(['disease', 'status'])
            ->select(['id', 'disease_id', 'custom_disease_name', 'latitude', 'longitude', 'status_id', 'created_at']);

        // Filter by status if provided
        if ($request->has('status')) {
            $status = ReportStatus::where('status_name', $request->status)->first();
            if ($status) {
                $query->where('status_id', $status->report_status_id);
            }
        }

        $reports = $query->get()->map(function ($report) {
            return [
                'id' => $report->id,
                'disease_name' => $report->custom_disease_name ?? ($report->disease ? $report->disease->disease_name : 'Unknown'),
                'latitude' => $report->latitude,
                'longitude' => $report->longitude,
                'status' => $report->status->status_name,
                'reported_at' => $report->created_at->format('Y-m-d H:i'),
            ];
        });

        return response()->json($reports);
    }

    /**
     * Get statistics for disease reports.
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        $query = DiseaseReport::query();

        if ($user->isFarmer()) {
            $query->where('reporter_id', $user->id);
        }

        $total = $query->count();
        $submitted = (clone $query)->whereHas('status', fn($q) => $q->where('name', 'submitted'))->count();
        $investigating = (clone $query)->whereHas('status', fn($q) => $q->where('name', 'investigating'))->count();
        $resolved = (clone $query)->whereHas('status', fn($q) => $q->where('name', 'resolved'))->count();

        return response()->json([
            'total' => $total,
            'submitted' => $submitted,
            'investigating' => $investigating,
            'resolved' => $resolved,
        ]);
    }
}
