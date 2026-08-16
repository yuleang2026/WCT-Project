<?php

namespace Tests\Feature\SuperAdmin;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class UserManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_superadmin_can_create_an_admin_user(): void
    {
        $superadmin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($superadmin, 'sanctum')->postJson('/api/superadmin/users', [
            'name' => 'New Admin',
            'email' => 'newadmin@nicc.edu.kh',
            'password' => 'password123',
            'role' => 'admin',
        ]);

        $response->assertCreated()->assertJsonPath('user.role', 'admin');
    }

    public function test_superadmin_can_deactivate_a_user(): void
    {
        $superadmin = User::factory()->superAdmin()->create();
        $target = User::factory()->create(['is_active' => true]);

        $this->actingAs($superadmin, 'sanctum')
            ->deleteJson("/api/superadmin/users/{$target->id}")
            ->assertOk();

        $this->assertFalse($target->fresh()->is_active);
    }

    public function test_superadmin_cannot_delete_their_own_account(): void
    {
        $superadmin = User::factory()->superAdmin()->create();

        $this->actingAs($superadmin, 'sanctum')
            ->deleteJson("/api/superadmin/users/{$superadmin->id}")
            ->assertUnprocessable();
    }

    public function test_superadmin_can_update_system_settings(): void
    {
        $superadmin = User::factory()->superAdmin()->create();

        $response = $this->actingAs($superadmin, 'sanctum')->putJson('/api/superadmin/settings', [
            'settings' => ['site_name' => 'NICC SmartSpace Updated', 'tax_rate_percent' => '10'],
        ]);

        $response->assertOk()->assertJsonPath('settings.site_name', 'NICC SmartSpace Updated');
    }
}
