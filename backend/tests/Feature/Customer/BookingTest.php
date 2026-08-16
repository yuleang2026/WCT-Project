<?php

namespace Tests\Feature\Customer;

use App\Models\Booking;
use App\Models\Equipment;
use App\Models\Space;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\Notification;
use Tests\TestCase;

class BookingTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_can_create_an_event_booking_with_equipment(): void
    {
        Notification::fake();

        $customer = User::factory()->create();
        $space = Space::factory()->create(['type' => Space::TYPE_EVENT, 'price' => 100, 'price_unit' => 'hour']);
        $equipment = Equipment::factory()->create(['price' => 20]);

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/customer/bookings/event', [
            'space_id' => $space->id,
            'start_date' => now()->addDays(3)->toDateString(),
            'start_time' => '09:00',
            'end_time' => '11:00',
            'attendees' => 20,
            'purpose' => 'Team workshop',
            'equipment' => [
                ['equipment_id' => $equipment->id, 'quantity' => 2],
            ],
        ]);

        $response->assertCreated()
            ->assertJsonPath('booking.status', 'pending')
            ->assertJsonPath('booking.space_price', '200.00')
            ->assertJsonPath('booking.equipment_price', '40.00')
            ->assertJsonPath('booking.total_price', '240.00');

        $this->assertDatabaseHas('bookings', ['user_id' => $customer->id, 'space_id' => $space->id]);
    }

    public function test_cannot_book_an_already_pending_slot_for_the_same_space(): void
    {
        Notification::fake();

        $space = Space::factory()->create(['type' => Space::TYPE_EVENT]);
        $existingBooking = Booking::factory()->create([
            'space_id' => $space->id,
            'type' => Booking::TYPE_EVENT,
            'status' => Booking::STATUS_PENDING,
            'start_date' => now()->addDays(5),
            'end_date' => now()->addDays(5),
        ]);

        $customer = User::factory()->create();

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/customer/bookings/event', [
            'space_id' => $space->id,
            'start_date' => $existingBooking->start_date->toDateString(),
            'start_time' => '10:00',
            'end_time' => '12:00',
            'attendees' => 5,
        ]);

        $response->assertUnprocessable()->assertJsonValidationErrors('start_date');
    }

    public function test_customer_can_create_an_office_booking_with_documents(): void
    {
        Notification::fake();

        $customer = User::factory()->create();
        $space = Space::factory()->office()->create(['price' => 400]);

        $response = $this->actingAs($customer, 'sanctum')->postJson('/api/customer/bookings/office', [
            'space_id' => $space->id,
            'start_date' => now()->addDays(10)->toDateString(),
            'company_name' => 'Acme Co.',
            'contact_person' => 'John Smith',
            'contact_phone' => '012345678',
            'contact_email' => 'john@acme.com',
            'business_license' => UploadedFile::fake()->create('license.pdf', 100, 'application/pdf'),
            'id_card' => UploadedFile::fake()->image('id.jpg'),
        ]);

        $response->assertCreated()->assertJsonPath('booking.type', 'office');

        $booking = Booking::query()->latest()->first();
        $this->assertNotNull($booking->companyProfile);
        $this->assertEquals('Acme Co.', $booking->companyProfile->company_name);
        $this->assertCount(2, $booking->documents);
    }

    public function test_customer_cannot_view_or_cancel_another_customers_booking(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $booking = Booking::factory()->create(['user_id' => $owner->id, 'status' => Booking::STATUS_PENDING]);

        $this->actingAs($intruder, 'sanctum')->getJson("/api/customer/bookings/{$booking->id}")->assertForbidden();
        $this->actingAs($intruder, 'sanctum')->postJson("/api/customer/bookings/{$booking->id}/cancel")->assertForbidden();
    }

    public function test_customer_can_cancel_their_own_pending_booking(): void
    {
        $customer = User::factory()->create();
        $booking = Booking::factory()->create(['user_id' => $customer->id, 'status' => Booking::STATUS_PENDING]);

        $this->actingAs($customer, 'sanctum')
            ->postJson("/api/customer/bookings/{$booking->id}/cancel")
            ->assertOk()
            ->assertJsonPath('booking.status', 'cancelled');
    }
}
