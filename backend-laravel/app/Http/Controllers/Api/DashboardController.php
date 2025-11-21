<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\InsuranceApplication;
use App\Models\DiseaseReport;
use App\Models\Advisory;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Get farmer dashboard statistics.
     */
    public function farmerDashboard(Request $request)
    {
        $user = $request->user()->load('role');

        if (!$user->isFarmer()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Insurance applications stats
        $totalApplications = InsuranceApplication::where('applicant_id', $user->id)->count();
        $approvedApplications = InsuranceApplication::where('applicant_id', $user->id)
            ->whereHas('status', fn($q) => $q->where('status_name', 'Approved'))
            ->count();
        $pendingApplications = InsuranceApplication::where('applicant_id', $user->id)
            ->whereHas('status', fn($q) => $q->where('status_name', 'Pending'))
            ->count();

        // Disease reports stats
        $totalReports = DiseaseReport::where('reporter_id', $user->id)->count();
        $activeReports = DiseaseReport::where('reporter_id', $user->id)
            ->whereHas('status', fn($q) => $q->whereIn('status_name', ['Pending', 'In Progress']))
            ->count();

        // Active advisories
        $activeAdvisories = Advisory::active()->count();
        $unreadAdvisories = Advisory::active()
            ->whereDoesntHave('readers', fn($q) => $q->where('user_id', $user->id))
            ->count();

        // Recent applications
        $recentApplications = InsuranceApplication::where('applicant_id', $user->id)
            ->with(['animalType', 'status', 'barangay'])
            ->latest('submitted_at')
            ->take(5)
            ->get();

        // Recent reports
        $recentReports = DiseaseReport::where('reporter_id', $user->id)
            ->with(['disease', 'status'])
            ->latest('submitted_at')
            ->take(5)
            ->get();

        return response()->json([
            'statistics' => [
                'total_applications' => $totalApplications,
                'approved_applications' => $approvedApplications,
                'pending_applications' => $pendingApplications,
                'total_reports' => $totalReports,
                'active_reports' => $activeReports,
                'active_advisories' => $activeAdvisories,
                'unread_advisories' => $unreadAdvisories,
            ],
            'recent_applications' => $recentApplications,
            'recent_reports' => $recentReports,
        ]);
    }

    /**
     * Get admin dashboard statistics.
     */
    public function adminDashboard(Request $request)
    {
        $user = $request->user();

        if (!$user->isAdmin()) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        // Users stats
        $totalFarmers = User::whereHas('role', fn($q) => $q->where('role_name', 'farmer'))->count();
        $activeFarmers = User::whereHas('role', fn($q) => $q->where('role_name', 'farmer'))
            ->where('is_active', true)
            ->count();

        // Insurance applications stats
        $totalApplications = InsuranceApplication::count();
        $pendingApplications = InsuranceApplication::whereHas('status', fn($q) => $q->where('status_name', 'Pending'))->count();
        $approvedApplications = InsuranceApplication::whereHas('status', fn($q) => $q->where('status_name', 'Approved'))->count();
        $rejectedApplications = InsuranceApplication::whereHas('status', fn($q) => $q->where('status_name', 'Rejected'))->count();

        // Disease reports stats
        $totalReports = DiseaseReport::count();
        $submittedReports = DiseaseReport::whereHas('status', fn($q) => $q->where('status_name', 'Pending'))->count();
        $investigatingReports = DiseaseReport::whereHas('status', fn($q) => $q->where('status_name', 'In Progress'))->count();
        $resolvedReports = DiseaseReport::whereHas('status', fn($q) => $q->where('status_name', 'Resolved'))->count();

        // Advisory stats
        $activeAdvisories = Advisory::active()->count();
        $totalAdvisories = Advisory::count();

        // Applications by animal type
        $applicationsByType = InsuranceApplication::select('animal_types.animal_type_name', DB::raw('count(*) as count'))
            ->join('animal_types', 'insurance_applications.animal_type_id', '=', 'animal_types.animal_type_id')
            ->groupBy('animal_types.animal_type_name')
            ->orderByDesc('count')
            ->take(5)
            ->get();

        // Reports by month (last 6 months)
        $reportsByMonth = DiseaseReport::select(
            DB::raw('DATE_FORMAT(submitted_at, "%Y-%m") as month'),
            DB::raw('count(*) as total_reports'),
            DB::raw('SUM(CASE WHEN report_statuses.status_name = "Resolved" THEN 1 ELSE 0 END) as resolved_reports')
        )
            ->join('report_statuses', 'disease_reports.report_status_id', '=', 'report_statuses.report_status_id')
            ->where('submitted_at', '>=', now()->subMonths(6))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        // Recent applications needing review
        $pendingReview = InsuranceApplication::whereHas('status', fn($q) => $q->where('status_name', 'Pending'))
            ->with(['applicant', 'animalType', 'barangay'])
            ->latest('submitted_at')
            ->take(10)
            ->get();

        // Recent disease reports
        $recentReports = DiseaseReport::with(['reporter', 'disease', 'status'])
            ->latest('submitted_at')
            ->take(10)
            ->get();

        return response()->json([
            'statistics' => [
                'total_farmers' => $totalFarmers,
                'active_farmers' => $activeFarmers,
                'total_applications' => $totalApplications,
                'pending_applications' => $pendingApplications,
                'approved_applications' => $approvedApplications,
                'rejected_applications' => $rejectedApplications,
                'total_reports' => $totalReports,
                'submitted_reports' => $submittedReports,
                'investigating_reports' => $investigatingReports,
                'resolved_reports' => $resolvedReports,
                'active_advisories' => $activeAdvisories,
                'total_advisories' => $totalAdvisories,
            ],
            'charts' => [
                'applications_by_type' => $applicationsByType,
                'reports_by_month' => $reportsByMonth,
            ],
            'pending_review' => $pendingReview,
            'recent_reports' => $recentReports,
        ]);
    }
}
