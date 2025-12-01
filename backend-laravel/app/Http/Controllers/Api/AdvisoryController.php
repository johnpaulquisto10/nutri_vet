<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Advisory;
use App\Models\AdvisoryRead;
use Illuminate\Http\Request;

class AdvisoryController extends Controller
{
    /**
     * Get all active advisories.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        $query = Advisory::active()
            ->with(['creator', 'category', 'severity'])
            ->latest();

        // Filter by category
        if ($request->has('category_id')) {
            $query->where('category_id', $request->category_id);
        }

        // Filter by severity
        if ($request->has('severity_id')) {
            $query->where('severity_id', $request->severity_id);
        }

        $advisories = $query->paginate(20);

        // Mark which ones user has read
        if ($user->isFarmer()) {
            $readIds = $user->readAdvisories()->pluck('advisories.advisory_id')->toArray();

            $advisories->getCollection()->transform(function ($advisory) use ($readIds) {
                $advisory->is_read = in_array($advisory->advisory_id, $readIds);
                return $advisory;
            });
        }

        return response()->json($advisories);
    }

    /**
     * Store a new advisory (admin only).
     */
    public function store(Request $request)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'category_id' => 'required|exists:advisory_categories,category_id',
            'severity_id' => 'required|exists:advisory_severities,severity_id',
            'expires_at' => 'nullable|date|after:now',
        ]);

        $advisory = Advisory::create([
            'created_by' => $request->user()->id,
            'is_active' => true,
            'published_at' => now(),
            ...$validated
        ]);

        $advisory->load(['creator', 'category', 'severity']);

        return response()->json([
            'message' => 'Advisory created successfully',
            'advisory' => $advisory,
        ], 201);
    }

    /**
     * Get a single advisory.
     */
    public function show(Request $request, $id)
    {
        $advisory = Advisory::with(['creator', 'category', 'severity'])->findOrFail($id);

        $user = $request->user();
        if ($user->isFarmer()) {
            $isRead = AdvisoryRead::where('user_id', $user->id)
                ->where('advisory_id', $advisory->id)
                ->exists();

            $advisory->is_read = $isRead;
        }

        return response()->json($advisory);
    }

    /**
     * Update an advisory (admin only).
     */
    public function update(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $advisory = Advisory::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'category_id' => 'sometimes|exists:advisory_categories,category_id',
            'severity_id' => 'sometimes|exists:advisory_severities,severity_id',
            'expires_at' => 'nullable|date',
            'is_active' => 'sometimes|boolean',
        ]);

        $advisory->update($validated);
        $advisory->load(['creator', 'category', 'severity']);

        return response()->json([
            'message' => 'Advisory updated successfully',
            'advisory' => $advisory,
        ]);
    }

    /**
     * Delete an advisory (admin only).
     */
    public function destroy(Request $request, $id)
    {
        if (!$request->user()->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $advisory = Advisory::findOrFail($id);
        $advisory->delete();

        return response()->json([
            'message' => 'Advisory deleted successfully',
        ]);
    }

    /**
     * Mark advisory as read.
     */
    public function markAsRead(Request $request, $id)
    {
        $advisory = Advisory::findOrFail($id);

        AdvisoryRead::firstOrCreate([
            'user_id' => $request->user()->id,
            'advisory_id' => $advisory->advisory_id,
        ], [
            'read_at' => now(),
        ]);

        return response()->json([
            'message' => 'Advisory marked as read',
        ]);
    }

    /**
     * Get unread count for user.
     */
    public function unreadCount(Request $request)
    {
        if (!$request->user()->isFarmer()) {
            return response()->json(['unread_count' => 0]);
        }

        $readIds = $request->user()->readAdvisories()->pluck('advisories.advisory_id')->toArray();
        $activeIds = Advisory::active()->pluck('advisory_id')->toArray();

        $unreadCount = count(array_diff($activeIds, $readIds));

        return response()->json(['unread_count' => $unreadCount]);
    }
}
