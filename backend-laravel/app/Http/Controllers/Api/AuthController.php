<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    /**
     * Register a new user.
     */
    public function register(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8|confirmed',
            'phone_number' => 'nullable|string|max:20',
        ]);

        // Find the farmer role (default for registration)
        $farmerRole = \App\Models\Role::where('role_name', 'farmer')->first();

        if (!$farmerRole) {
            \Log::error('Farmer role not found in database');
            return response()->json([
                'message' => 'Farmer role not found in database. Please run: php artisan db:seed',
                'error' => 'ROLE_NOT_FOUND'
            ], 500);
        }

        try {
            $user = User::create([
                'name' => $validated['full_name'], // For compatibility with default Laravel
                'full_name' => $validated['full_name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'phone_number' => $validated['phone_number'] ?? null,
                'role_id' => $farmerRole->role_id, // Use role_id not id
                'is_active' => true,
                'last_login_at' => now(),
            ]);

            // Load role relationship
            $user->load('role');

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                ],
                'role' => $user->role ? $user->role->role_name : 'farmer',
                'token' => $token,
                'message' => 'Registration successful! Welcome to NutriVet.',
            ], 201);
        } catch (\Exception $e) {
            \Log::error('Registration error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());

            return response()->json([
                'message' => 'Registration failed',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Login user.
     */
    public function login(Request $request)
    {
        try {
            $request->validate([
                'email' => 'required|email',
                'password' => 'required',
            ]);

            $user = User::with('role')->where('email', $request->email)->first();

            if (!$user || !Hash::check($request->password, $user->password)) {
                throw ValidationException::withMessages([
                    'email' => ['The provided credentials are incorrect.'],
                ]);
            }

            if (!$user->is_active) {
                throw ValidationException::withMessages([
                    'email' => ['Your account has been deactivated.'],
                ]);
            }

            // Update last login
            $user->update(['last_login_at' => now()]);

            // Create token
            $token = $user->createToken('auth_token')->plainTextToken;

            return response()->json([
                'user' => [
                    'id' => $user->id,
                    'full_name' => $user->full_name,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                ],
                'role' => $user->role ? $user->role->role_name : 'farmer',
                'token' => $token,
            ]);
        } catch (\Exception $e) {
            \Log::error('Login error: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    /**
     * Logout user.
     */
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }

    /**
     * Get authenticated user profile.
     */
    public function profile(Request $request)
    {
        $user = $request->user()->load(['role', 'address.barangay.municipality.province']);

        return response()->json([
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
                'role' => $user->role->name,
                'address' => $user->address ? [
                    'full_address' => $user->address->getFullAddressAttribute(),
                    'barangay' => $user->address->barangay ? $user->address->barangay->name : null,
                    'municipality' => $user->address->barangay && $user->address->barangay->municipality ? $user->address->barangay->municipality->name : null,
                    'province' => $user->address->barangay && $user->address->barangay->municipality && $user->address->barangay->municipality->province ? $user->address->barangay->municipality->province->name : null,
                    'latitude' => $user->address->latitude,
                    'longitude' => $user->address->longitude,
                ] : null,
                'created_at' => $user->created_at,
                'last_login_at' => $user->last_login_at,
            ],
        ]);
    }

    /**
     * Update user profile.
     */
    public function updateProfile(Request $request)
    {
        $validated = $request->validate([
            'full_name' => 'sometimes|string|max:255',
            'phone_number' => 'sometimes|nullable|string|max:20',
            'password' => 'sometimes|string|min:8|confirmed',
        ]);

        $user = $request->user();

        if (isset($validated['full_name'])) {
            $user->full_name = $validated['full_name'];
            $user->name = $validated['full_name']; // Keep in sync
        }

        if (isset($validated['phone_number'])) {
            $user->phone_number = $validated['phone_number'];
        }

        if (isset($validated['password'])) {
            $user->password = Hash::make($validated['password']);
        }

        $user->save();

        return response()->json([
            'message' => 'Profile updated successfully',
            'user' => [
                'id' => $user->id,
                'full_name' => $user->full_name,
                'email' => $user->email,
                'phone_number' => $user->phone_number,
            ],
        ]);
    }
}
