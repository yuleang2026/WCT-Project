<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Space;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PublicSpaceBrowsingTest extends TestCase
{
    use RefreshDatabase;

    public function test_guest_can_browse_active_spaces_without_authentication(): void
    {
        Space::factory()->count(3)->create(['status' => 'active']);
        Space::factory()->create(['status' => 'inactive']);

        $response = $this->getJson('/api/spaces');

        $response->assertOk();
        $this->assertCount(3, $response->json('data'));
    }

    public function test_guest_can_filter_spaces_by_type(): void
    {
        Space::factory()->create(['type' => Space::TYPE_EVENT]);
        Space::factory()->office()->create();

        $response = $this->getJson('/api/spaces?type=office');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals('office', $response->json('data.0.type'));
    }

    public function test_guest_can_search_spaces_by_name(): void
    {
        Space::factory()->create(['name' => 'Grand Auditorium']);
        Space::factory()->create(['name' => 'Small Meeting Room']);

        $response = $this->getJson('/api/spaces?search=Auditorium');

        $response->assertOk();
        $this->assertCount(1, $response->json('data'));
    }

    public function test_availability_endpoint_flags_conflicting_dates(): void
    {
        $space = Space::factory()->create();
        Booking::factory()->create([
            'space_id' => $space->id,
            'status' => Booking::STATUS_APPROVED,
            'start_date' => '2026-09-01',
            'end_date' => '2026-09-01',
        ]);

        $conflict = $this->getJson("/api/spaces/{$space->id}/availability?start_date=2026-09-01");
        $conflict->assertOk()->assertJsonPath('is_available', false);

        $free = $this->getJson("/api/spaces/{$space->id}/availability?start_date=2026-09-05");
        $free->assertOk()->assertJsonPath('is_available', true);
    }
}
