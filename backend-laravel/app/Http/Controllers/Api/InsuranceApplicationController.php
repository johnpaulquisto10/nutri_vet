<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InsuranceApplication;
use App\Models\InsuranceApplicationStatus;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class InsuranceApplicationController extends Controller
{
    /**
     * Get all insurance applications (for authenticated user or all for admin).
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = InsuranceApplication::with([
            'applicant',
            'barangay.municipality.province',
            'animalType',
            'purpose',
            'status',
            'reviewer'
        ]);

        // If farmer, only show their applications
        if ($user->isFarmer()) {
            $query->where('applicant_id', $user->id);
        }

        // Filter by status if provided
        if ($request->has('status')) {
            $status = InsuranceApplicationStatus::where('status_name', $request->status)->first();
            if ($status) {
                $query->where('status_id', $status->status_id);
            }
        }

        // Search by animal name or tag
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('animal_name', 'like', "%{$search}%")
                    ->orWhere('animal_tag', 'like', "%{$search}%");
            });
        }

        $applications = $query->orderBy('submitted_at', 'desc')->paginate(15);

        return response()->json($applications);
    }

    /**
     * Store a new insurance application.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'animal_type_id' => 'required|exists:animal_types,animal_type_id',
            'purpose_id' => 'required|exists:animal_purposes,purpose_id',
            'barangay_id' => 'required|exists:barangays,barangay_id',
            'animal_type_other' => 'nullable|string|max:255',
            'contact_number' => 'required|string|max:20',
            'number_of_heads' => 'required|integer|min:1',
            'age_months' => 'required|integer|min:0',
            'breed' => 'nullable|string|max:100',
            'basic_color' => 'nullable|string|max:50',
            'male_count' => 'required|integer|min:0',
            'female_count' => 'required|integer|min:0',
        ]);

        // Get pending status
        $pendingStatus = InsuranceApplicationStatus::where('status_name', 'Pending')->first();

        $application = InsuranceApplication::create([
            'applicant_id' => $request->user()->id,
            'status_id' => $pendingStatus->status_id,
            'submitted_at' => now(),
            ...$validated
        ]);

        $application->load(['animalType', 'purpose', 'status', 'barangay']);

        return response()->json([
            'message' => 'Insurance application submitted successfully',
            'application' => $application,
        ], 201);
    }

    /**
     * Get a single insurance application.
     */
    public function show(Request $request, $id)
    {
        $application = InsuranceApplication::with([
            'applicant',
            'barangay.municipality.province',
            'animalType',
            'purpose',
            'status',
            'reviewer'
        ])->findOrFail($id);

        // Check authorization
        $user = $request->user();
        if ($user->isFarmer() && $application->applicant_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        return response()->json($application);
    }

    /**
     * Update an insurance application.
     */
    public function update(Request $request, $id)
    {
        $application = InsuranceApplication::findOrFail($id);

        // Only applicant can update and only if pending
        if ($application->applicant_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($application->status->status_name !== 'Pending') {
            return response()->json([
                'message' => 'Cannot update application after it has been reviewed'
            ], 422);
        }

        $validated = $request->validate([
            'animal_type_id' => 'sometimes|exists:animal_types,animal_type_id',
            'purpose_id' => 'sometimes|exists:animal_purposes,purpose_id',
            'barangay_id' => 'sometimes|exists:barangays,barangay_id',
            'animal_type_other' => 'nullable|string|max:255',
            'contact_number' => 'sometimes|string|max:20',
            'number_of_heads' => 'sometimes|integer|min:1',
            'age_months' => 'sometimes|integer|min:0',
            'breed' => 'nullable|string|max:100',
            'basic_color' => 'nullable|string|max:50',
            'male_count' => 'sometimes|integer|min:0',
            'female_count' => 'sometimes|integer|min:0',
        ]);

        $application->update($validated);
        $application->load(['animalType', 'purpose', 'status', 'barangay']);

        return response()->json([
            'message' => 'Application updated successfully',
            'application' => $application,
        ]);
    }

    /**
     * Delete an insurance application.
     */
    public function destroy(Request $request, $id)
    {
        $application = InsuranceApplication::findOrFail($id);

        // Only applicant can delete and only if pending
        if ($application->applicant_id !== $request->user()->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        if ($application->status->status_name !== 'Pending') {
            return response()->json([
                'message' => 'Cannot delete application after it has been reviewed'
            ], 422);
        }

        $application->delete();

        return response()->json([
            'message' => 'Application deleted successfully',
        ]);
    }

    /**
     * Approve an insurance application (admin only).
     */
    public function approve(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'admin_notes' => 'nullable|string',
        ]);

        $application = InsuranceApplication::findOrFail($id);
        $approvedStatus = InsuranceApplicationStatus::where('status_name', 'Approved')->first();

        $application->update([
            'status_id' => $approvedStatus->status_id,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_notes' => $validated['admin_notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Application approved successfully',
            'application' => $application->load(['status', 'reviewer']),
        ]);
    }

    /**
     * Reject an insurance application (admin only).
     */
    public function reject(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'admin_notes' => 'nullable|string',
        ]);

        $application = InsuranceApplication::findOrFail($id);
        $rejectedStatus = InsuranceApplicationStatus::where('status_name', 'Rejected')->first();

        $application->update([
            'status_id' => $rejectedStatus->status_id,
            'reviewed_by' => $request->user()->id,
            'reviewed_at' => now(),
            'admin_notes' => $validated['admin_notes'] ?? null,
        ]);

        return response()->json([
            'message' => 'Application rejected',
            'application' => $application->load(['status', 'reviewer']),
        ]);
    }

    /**
     * Get statistics for insurance applications.
     */
    public function statistics(Request $request)
    {
        $user = $request->user();

        $query = InsuranceApplication::query();

        if ($user->isFarmer()) {
            $query->where('applicant_id', $user->id);
        }

        $total = $query->count();
        $pending = (clone $query)->whereHas('status', fn($q) => $q->where('name', 'pending'))->count();
        $approved = (clone $query)->whereHas('status', fn($q) => $q->where('name', 'approved'))->count();
        $rejected = (clone $query)->whereHas('status', fn($q) => $q->where('name', 'rejected'))->count();

        return response()->json([
            'total' => $total,
            'pending' => $pending,
            'approved' => $approved,
            'rejected' => $rejected,
        ]);
    }
}
