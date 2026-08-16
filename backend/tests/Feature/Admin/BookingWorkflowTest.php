<?php

namespace Tests\Feature\Admin;

use App\Models\Booking;
use App\Models\Space;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class BookingWorkflowTest extends TestCase
{
    use RefreshDatabase;

    public function test_admin_approving_a_booking_generates_a_contract_and_invoice(): void
    {
        Notification::fake();

        $admin = User::factory()->admin()->create();
        $space = Space::factory()->create(['type' => Space::TYPE_EVENT, 'deposit_amount' => 100]);
        $booking = Booking::factory()->create([
            'space_id' => $space->id,
            'status' => Booking::STATUS_PENDING,
            'deposit_amount' => 100,
            'total_price' => 300,
        ]);

        $response = $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/bookings/{$booking->id}/approve", ['admin_note' => 'Looks good']);

        $response->assertOk()->assertJsonPath('booking.status', 'approved');

        $this->assertDatabaseHas('contracts', ['booking_id' => $booking->id, 'status' => 'pending_signature']);
        $this->assertDatabaseHas('invoices', ['booking_id' => $booking->id, 'total' => 100]);
    }

    public function test_admin_rejecting_a_booking_requires_a_note(): void
    {
        $admin = User::factory()->admin()->create();
        $booking = Booking::factory()->create(['status' => Booking::STATUS_PENDING]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/bookings/{$booking->id}/reject", [])
            ->assertUnprocessable();

        Notification::fake();

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/bookings/{$booking->id}/reject", ['admin_note' => 'Space unavailable'])
            ->assertOk()
            ->assertJsonPath('booking.status', 'rejected');
    }

    public function test_only_pending_bookings_can_be_approved(): void
    {
        $admin = User::factory()->admin()->create();
        $booking = Booking::factory()->create(['status' => Booking::STATUS_APPROVED]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/bookings/{$booking->id}/approve")
            ->assertUnprocessable();
    }
}
