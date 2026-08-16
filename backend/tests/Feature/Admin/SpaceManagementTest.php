<?php

namespace Tests\Feature\Admin;

use App\Models\Space;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class SpaceManagementTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_can_create_a_space(): void
    {
        $admin = User::factory()->admin()->create();

        $response = $this->actingAs($admin, 'sanctum')->postJson('/api/admin/spaces', [
            'name' => 'Conference Hall C',
            'type' => 'event',
            'capacity' => 100,
            'price' => 80,
            'price_unit' => 'hour',
            'deposit_amount' => 100,
            'status' => 'active',
        ]);

        $response->assertCreated()->assertJsonPath('space.slug', 'conference-hall-c');
    }

    public function test_admin_can_update_and_delete_a_space(): void
    {
        $admin = User::factory()->admin()->create();
        $space = Space::factory()->create(['name' => 'Old Name']);

        $this->actingAs($admin, 'sanctum')->putJson("/api/admin/spaces/{$space->id}", [
            'name' => 'New Name',
            'type' => $space->type,
            'capacity' => $space->capacity,
            'price' => $space->price,
            'price_unit' => $space->price_unit,
            'status' => 'active',
        ])->assertOk()->assertJsonPath('space.name', 'New Name');

        $this->actingAs($admin, 'sanctum')->deleteJson("/api/admin/spaces/{$space->id}")->assertOk();
        $this->assertSoftDeleted('spaces', ['id' => $space->id]);
    }

    public function test_customer_cannot_manage_spaces(): void
    {
        $customer = User::factory()->create();

        $this->actingAs($customer, 'sanctum')->postJson('/api/admin/spaces', [
            'name' => 'Hack Attempt',
            'type' => 'event',
            'capacity' => 10,
            'price' => 10,
            'price_unit' => 'hour',
            'status' => 'active',
        ])->assertForbidden();
    }
}
