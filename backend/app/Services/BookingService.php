<?php

namespace App\Services;

use App\Models\Booking;
use App\Models\CompanyProfile;
use App\Models\Document;
use App\Models\Equipment;
use App\Models\Space;
use App\Models\User;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;

class BookingService
{
    public function isSpaceAvailable(Space $space, string $startDate, ?string $endDate = null, ?int $ignoreBookingId = null): bool
    {
        $endDate ??= $startDate;

        $query = Booking::query()
            ->where('space_id', $space->id)
            ->whereIn('status', [Booking::STATUS_PENDING, Booking::STATUS_APPROVED])
            ->where(function ($q) use ($startDate, $endDate) {
                $q->whereDate('start_date', '<=', $endDate)
                    ->where(function ($q2) use ($startDate) {
                        $q2->whereNull('end_date')->orWhereDate('end_date', '>=', $startDate);
                    });
            });

        if ($ignoreBookingId) {
            $query->where('id', '!=', $ignoreBookingId);
        }

        return ! $query->exists();
    }

    public function createEventBooking(User $user, array $data): Booking
    {
        $space = Space::query()->where('type', Space::TYPE_EVENT)->findOrFail($data['space_id']);

        if (! $this->isSpaceAvailable($space, $data['start_date'], $data['start_date'])) {
            throw ValidationException::withMessages([
                'start_date' => 'This space is already booked or pending approval for the selected date.',
            ]);
        }

        return DB::transaction(function () use ($user, $space, $data) {
            $hours = $this->hoursBetween($data['start_time'], $data['end_time']);
            $spacePrice = $this->priceForDuration($space, $hours, $data['start_date'], $data['start_date']);

            $equipmentPrice = 0;
            $equipmentRows = [];

            foreach ($data['equipment'] ?? [] as $item) {
                $equipment = Equipment::query()->active()->findOrFail($item['equipment_id']);
                $lineTotal = $equipment->price * $item['quantity'];
                $equipmentPrice += $lineTotal;
                $equipmentRows[$equipment->id] = [
                    'quantity' => $item['quantity'],
                    'unit_price' => $equipment->price,
                ];
            }

            $booking = Booking::create([
                'user_id' => $user->id,
                'space_id' => $space->id,
                'type' => Booking::TYPE_EVENT,
                'start_date' => $data['start_date'],
                'end_date' => $data['start_date'],
                'start_time' => $data['start_time'],
                'end_time' => $data['end_time'],
                'attendees' => $data['attendees'],
                'purpose' => $data['purpose'] ?? null,
                'status' => Booking::STATUS_PENDING,
                'space_price' => $spacePrice,
                'equipment_price' => $equipmentPrice,
                'total_price' => $spacePrice + $equipmentPrice,
                'deposit_amount' => $space->deposit_amount,
            ]);

            if ($equipmentRows) {
                $booking->equipment()->sync($equipmentRows);
            }

            return $booking->load(['space', 'equipment']);
        });
    }

    public function createOfficeBooking(User $user, array $data, ?UploadedFile $businessLicense, ?UploadedFile $idCard, array $otherDocuments = []): Booking
    {
        $space = Space::query()->where('type', Space::TYPE_OFFICE)->findOrFail($data['space_id']);

        if (! $this->isSpaceAvailable($space, $data['start_date'], $data['end_date'] ?? null)) {
            throw ValidationException::withMessages([
                'start_date' => 'This office is already reserved or pending approval for the selected period.',
            ]);
        }

        return DB::transaction(function () use ($user, $space, $data, $businessLicense, $idCard, $otherDocuments) {
            $months = 1;
            $spacePrice = $space->price_unit === 'month' ? $space->price * $months : $space->price;

            $booking = Booking::create([
                'user_id' => $user->id,
                'space_id' => $space->id,
                'type' => Booking::TYPE_OFFICE,
                'start_date' => $data['start_date'],
                'end_date' => $data['end_date'] ?? null,
                'purpose' => $data['purpose'] ?? null,
                'status' => Booking::STATUS_PENDING,
                'space_price' => $spacePrice,
                'equipment_price' => 0,
                'total_price' => $spacePrice,
                'deposit_amount' => $space->deposit_amount,
            ]);

            CompanyProfile::create([
                'booking_id' => $booking->id,
                'company_name' => $data['company_name'],
                'registration_number' => $data['registration_number'] ?? null,
                'contact_person' => $data['contact_person'],
                'contact_phone' => $data['contact_phone'],
                'contact_email' => $data['contact_email'],
                'address' => $data['address'] ?? null,
            ]);

            if ($businessLicense) {
                $this->storeDocument($booking, $businessLicense, 'business_license', $user);
            }

            if ($idCard) {
                $this->storeDocument($booking, $idCard, 'id_card', $user);
            }

            foreach ($otherDocuments as $file) {
                $this->storeDocument($booking, $file, 'other', $user);
            }

            return $booking->load(['space', 'companyProfile', 'documents']);
        });
    }

    public function storeDocument(Booking $booking, UploadedFile $file, string $category, User $uploader): Document
    {
        $path = $file->store("bookings/{$booking->id}/documents", 'local');

        return Document::create([
            'documentable_type' => Booking::class,
            'documentable_id' => $booking->id,
            'uploaded_by' => $uploader->id,
            'category' => $category,
            'original_name' => $file->getClientOriginalName(),
            'path' => $path,
            'mime_type' => $file->getClientMimeType(),
            'size' => $file->getSize(),
        ]);
    }

    private function hoursBetween(string $start, string $end): float
    {
        [$startH, $startM] = array_map('intval', explode(':', $start));
        [$endH, $endM] = array_map('intval', explode(':', $end));

        return (($endH * 60 + $endM) - ($startH * 60 + $startM)) / 60;
    }

    private function priceForDuration(Space $space, float $hours, string $startDate, string $endDate): float
    {
        return match ($space->price_unit) {
            'hour' => round((float) $space->price * $hours, 2),
            'day' => (float) $space->price,
            default => (float) $space->price,
        };
    }
}
