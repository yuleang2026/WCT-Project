<?php

namespace Database\Seeders;

use App\Models\Equipment;
use App\Models\Space;
use App\Models\SystemSetting;
use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        $superAdmin = User::factory()->superAdmin()->create([
            'name' => 'NICC Super Admin',
            'email' => 'superadmin@nicc.edu.kh',
            'password' => bcrypt('Password123!'),
        ]);

        $admin = User::factory()->admin()->create([
            'name' => 'NICC Admin',
            'email' => 'admin@nicc.edu.kh',
            'password' => bcrypt('Password123!'),
        ]);

        $customer = User::factory()->create([
            'name' => 'Sample Customer',
            'email' => 'customer@example.com',
            'password' => bcrypt('Password123!'),
        ]);

        $eventSpaces = [
            ['name' => 'Conference Hall A', 'capacity' => 300, 'price' => 150, 'price_unit' => 'hour', 'deposit_amount' => 300],
            ['name' => 'Conference Hall B', 'capacity' => 200, 'price' => 100, 'price_unit' => 'hour', 'deposit_amount' => 200],
            ['name' => 'Meeting Room 1', 'capacity' => 20, 'price' => 25, 'price_unit' => 'hour', 'deposit_amount' => 50],
            ['name' => 'Meeting Room 2', 'capacity' => 30, 'price' => 35, 'price_unit' => 'hour', 'deposit_amount' => 50],
            ['name' => 'Grand Auditorium', 'capacity' => 600, 'price' => 400, 'price_unit' => 'day', 'deposit_amount' => 800],
        ];

        foreach ($eventSpaces as $space) {
            Space::create([
                'name' => $space['name'],
                'slug' => Str::slug($space['name']),
                'type' => Space::TYPE_EVENT,
                'description' => "The {$space['name']} at NICC is fully equipped for professional events, seminars, and conferences.",
                'capacity' => $space['capacity'],
                'price' => $space['price'],
                'price_unit' => $space['price_unit'],
                'deposit_amount' => $space['deposit_amount'],
                'location' => 'NICC, Royal University of Phnom Penh',
                'amenities' => ['Wi-Fi', 'Projector', 'Air Conditioning', 'Sound System'],
                'images' => [],
                'status' => 'active',
            ]);
        }

        $officeSpaces = [
            ['name' => 'Office Suite 1A', 'capacity' => 6, 'price' => 350],
            ['name' => 'Office Suite 2B', 'capacity' => 10, 'price' => 550],
            ['name' => 'Office Suite 3B', 'capacity' => 4, 'price' => 250],
        ];

        foreach ($officeSpaces as $space) {
            Space::create([
                'name' => $space['name'],
                'slug' => Str::slug($space['name']),
                'type' => Space::TYPE_OFFICE,
                'description' => "A private, furnished office space at NICC suitable for {$space['capacity']} staff, with monthly leasing.",
                'capacity' => $space['capacity'],
                'price' => $space['price'],
                'price_unit' => 'month',
                'deposit_amount' => $space['price'],
                'location' => 'NICC, Royal University of Phnom Penh',
                'amenities' => ['Wi-Fi', 'Air Conditioning', '24/7 Access', 'Reception Desk'],
                'images' => [],
                'status' => 'active',
            ]);
        }

        $equipment = [
            ['name' => 'Projector', 'price' => 15, 'stock' => 8],
            ['name' => 'Microphone Set', 'price' => 10, 'stock' => 15],
            ['name' => 'Extra Chairs (x10)', 'price' => 5, 'stock' => 40],
            ['name' => 'Stage Lighting', 'price' => 40, 'stock' => 4],
            ['name' => 'Podium', 'price' => 8, 'stock' => 6],
            ['name' => 'Video Camera', 'price' => 25, 'stock' => 3],
        ];

        foreach ($equipment as $item) {
            Equipment::create([
                'name' => $item['name'],
                'description' => null,
                'price' => $item['price'],
                'stock' => $item['stock'],
                'is_active' => true,
            ]);
        }

        SystemSetting::set('site_name', 'NICC SmartSpace');
        SystemSetting::set('contact_email', 'info@nicc.edu.kh');
        SystemSetting::set('contact_phone', '+855 23 000 000');
        SystemSetting::set('tax_rate_percent', '0');
        SystemSetting::set('default_deposit_percent', '20');
        SystemSetting::set('booking_lead_time_hours', '24');
        SystemSetting::set('cancellation_window_hours', '48');

        $this->command->info('Seeded users: '.$superAdmin->email.', '.$admin->email.', '.$customer->email.' (password: Password123!)');
    }
}
