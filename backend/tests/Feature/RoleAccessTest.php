<?php

namespace Tests\Feature;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RoleAccessTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_cannot_access_admin_routes(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/admin/dashboard/stats')
            ->assertForbidden();
    }

    public function test_customer_cannot_access_superadmin_routes(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer, 'sanctum')
            ->getJson('/api/superadmin/users')
            ->assertForbidden();
    }

    public function test_admin_cannot_access_superadmin_routes(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/superadmin/users')
            ->assertForbidden();
    }

    public function test_admin_can_access_admin_routes(): void
    {
        $admin = User::factory()->admin()->create();

        $this->actingAs($admin, 'sanctum')
            ->getJson('/api/admin/dashboard/stats')
            ->assertOk();
    }

    public function test_superadmin_can_access_admin_and_superadmin_routes(): void
    {
        $superadmin = User::factory()->superAdmin()->create();

        $this->actingAs($superadmin, 'sanctum')
            ->getJson('/api/admin/dashboard/stats')
            ->assertOk();

        $this->actingAs($superadmin, 'sanctum')
            ->getJson('/api/superadmin/users')
            ->assertOk();
    }

    public function test_guest_cannot_access_protected_routes(): void
    {
        $this->getJson('/api/customer/bookings')->assertUnauthorized();
        $this->getJson('/api/admin/dashboard/stats')->assertUnauthorized();
        $this->getJson('/api/superadmin/users')->assertUnauthorized();
    }

    public function test_deactivated_user_is_rejected_even_with_valid_token(): void
    {
        $user = User::factory()->create(['is_active' => false]);

        $this->actingAs($user, 'sanctum')
            ->getJson('/api/customer/bookings')
            ->assertForbidden();
    }
}
