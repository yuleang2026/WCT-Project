<?php

namespace App\Models\Concerns;

use DateTimeInterface;

/**
 * Laravel's default serializeDate() converts every Carbon date/datetime
 * attribute to UTC before formatting. For date-only columns (start_date,
 * due_date, ...) that shifts the calendar day for any positive UTC offset
 * (e.g. Asia/Phnom_Penh, UTC+7) once midnight local time crosses to the
 * previous UTC day. Preserving the original offset instead of converting
 * to "Z" keeps the calendar date stable for API consumers.
 */
trait SerializesDatesWithOffset
{
    protected function serializeDate(DateTimeInterface $date): string
    {
        return $date->format('Y-m-d\TH:i:sP');
    }
}
