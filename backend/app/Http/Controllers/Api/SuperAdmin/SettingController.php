<?php

namespace App\Http\Controllers\Api\SuperAdmin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\SystemSetting;
use Illuminate\Http\Request;

class SettingController extends Controller
{
    private const KNOWN_KEYS = [
        'site_name',
        'contact_email',
        'contact_phone',
        'tax_rate_percent',
        'default_deposit_percent',
        'booking_lead_time_hours',
        'cancellation_window_hours',
    ];

    public function index()
    {
        $settings = SystemSetting::all_settings();

        foreach (self::KNOWN_KEYS as $key) {
            $settings[$key] ??= null;
        }

        return response()->json(['settings' => $settings]);
    }

    public function update(Request $request)
    {
        $data = $request->validate([
            'settings' => ['required', 'array'],
        ]);

        foreach ($data['settings'] as $key => $value) {
            if (! in_array($key, self::KNOWN_KEYS, true)) {
                continue;
            }

            SystemSetting::set($key, (string) $value);
        }

        AuditLog::record($request->user(), 'settings.updated', null, null, $data['settings']);

        return response()->json(['settings' => SystemSetting::all_settings()]);
    }
}
