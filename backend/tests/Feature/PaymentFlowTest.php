<?php

namespace Tests\Feature;

use App\Models\Booking;
use App\Models\Invoice;
use App\Models\Payment;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Storage;
use Tests\TestCase;

class PaymentFlowTest extends TestCase
{
    use RefreshDatabase;

    public function test_customer_submits_payment_and_admin_confirmation_marks_invoice_paid(): void
    {
        Notification::fake();

        $customer = User::factory()->create();
        $admin = User::factory()->admin()->create();
        $booking = Booking::factory()->create(['user_id' => $customer->id, 'status' => Booking::STATUS_APPROVED]);
        $invoice = Invoice::create([
            'booking_id' => $booking->id,
            'issue_date' => now(),
            'due_date' => now()->addDays(5),
            'items' => [['label' => 'Deposit', 'amount' => 100]],
            'subtotal' => 100,
            'tax' => 0,
            'total' => 100,
            'status' => Invoice::STATUS_UNPAID,
        ]);

        $paymentResponse = $this->actingAs($customer, 'sanctum')->postJson('/api/customer/payments', [
            'booking_id' => $booking->id,
            'invoice_id' => $invoice->id,
            'amount' => 100,
            'method' => 'bank_transfer',
            'type' => 'deposit',
            'reference_note' => 'ABA #12345',
        ]);

        $paymentResponse->assertCreated()->assertJsonPath('payment.status', 'pending');
        $paymentId = $paymentResponse->json('payment.id');

        $confirmResponse = $this->actingAs($admin, 'sanctum')->postJson("/api/admin/payments/{$paymentId}/confirm");

        $confirmResponse->assertOk()->assertJsonPath('payment.status', 'confirmed');

        $this->assertEquals(Invoice::STATUS_PAID, $invoice->fresh()->status);
    }

    public function test_customer_cannot_submit_payment_for_someone_elses_booking(): void
    {
        $owner = User::factory()->create();
        $intruder = User::factory()->create();
        $booking = Booking::factory()->create(['user_id' => $owner->id]);

        $this->actingAs($intruder, 'sanctum')->postJson('/api/customer/payments', [
            'booking_id' => $booking->id,
            'amount' => 50,
            'method' => 'cash',
            'type' => 'deposit',
        ])->assertForbidden();
    }

    public function test_only_pending_payments_can_be_confirmed(): void
    {
        $admin = User::factory()->admin()->create();
        $payment = Payment::factory()->create(['status' => Payment::STATUS_CONFIRMED]);

        $this->actingAs($admin, 'sanctum')
            ->postJson("/api/admin/payments/{$payment->id}/confirm")
            ->assertUnprocessable();
    }

    public function test_admin_can_download_payment_proof(): void
    {
        Storage::fake('local');

        $admin = User::factory()->admin()->create();
        $payment = Payment::factory()->create();
        Storage::disk('local')->put($payment->proof_path = 'bookings/1/payments/proof.pdf', 'dummy');
        $payment->save();

        $this->actingAs($admin, 'sanctum')
            ->get("/api/admin/payments/{$payment->id}/proof")
            ->assertOk();
    }

    public function test_customer_cannot_download_payment_proof(): void
    {
        $customer = User::factory()->create();
        $payment = Payment::factory()->create();

        $this->actingAs($customer, 'sanctum')
            ->getJson("/api/admin/payments/{$payment->id}/proof")
            ->assertForbidden();
    }
}
