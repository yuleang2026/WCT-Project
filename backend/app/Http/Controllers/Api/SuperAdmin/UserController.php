<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    public function index(Request $request)
    {
        $query = User::query();

        if ($request->filled('role')) {
            $query->where('role', $request->string('role'));
        }

        if ($request->filled('search')) {
            $search = (string) $request->string('search');
            $query->where(fn ($q) => $q->whereLikeInsensitive('name', $search)->orWhereLikeInsensitive('email', $search));
        }

        return response()->json($query->orderBy('name')->paginate($request->integer('per_page', 20)));
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', 'min:8'],
            'phone' => ['nullable', 'string', 'max:30'],
            'role' => ['required', 'in:customer,admin,superadmin'],
        ]);

        $user = User::create([
            ...$data,
            'password' => Hash::make($data['password']),
        ]);

        AuditLog::record($request->user(), 'user.created_by_admin', $user);

        return response()->json(['user' => $user], 201);
    }

    public function update(Request $request, User $user)
    {
        $data = $request->validate([
            'name' => ['sometimes', 'string', 'max:255'],
            'email' => ['sometimes', 'email', 'max:255', 'unique:users,email,'.$user->id],
            'phone' => ['sometimes', 'nullable', 'string', 'max:30'],
            'role' => ['sometimes', 'in:customer,admin,superadmin'],
            'is_active' => ['sometimes', 'boolean'],
            'password' => ['sometimes', 'min:8'],
        ]);

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        if (isset($data['role']) && $user->id === $request->user()->id && $data['role'] !== User::ROLE_SUPERADMIN) {
            return response()->json(['message' => 'You cannot demote your own account.'], 422);
        }

        $user->update($data);

        AuditLog::record($request->user(), 'user.updated_by_admin', $user);

        return response()->json(['user' => $user]);
    }

    public function destroy(Request $request, User $user)
    {
        if ($user->id === $request->user()->id) {
            return response()->json(['message' => 'You cannot delete your own account.'], 422);
        }

        $user->update(['is_active' => false]);

        AuditLog::record($request->user(), 'user.deactivated', $user);

        return response()->json(['message' => 'User deactivated.']);
    }
}
