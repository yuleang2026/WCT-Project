<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\AuditLog;
use App\Models\Space;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class SpaceController extends Controller
{
    public function index(Request $request)
    {
        $query = Space::query();

        if ($request->filled('type')) {
            $query->where('type', $request->string('type'));
        }

        return response()->json($query->orderBy('name')->paginate($request->integer('per_page', 20)));
    }

    public function store(Request $request)
    {
        $data = $this->validated($request);
        $data['slug'] = $this->uniqueSlug($data['name']);

        $space = Space::create($data);

        AuditLog::record($request->user(), 'space.created', $space);

        return response()->json(['space' => $space], 201);
    }

    public function show(Space $space)
    {
        return response()->json(['space' => $space]);
    }

    public function update(Request $request, Space $space)
    {
        $data = $this->validated($request, $space->id);

        if ($data['name'] !== $space->name) {
            $data['slug'] = $this->uniqueSlug($data['name'], $space->id);
        }

        $space->update($data);

        AuditLog::record($request->user(), 'space.updated', $space);

        return response()->json(['space' => $space]);
    }

    public function destroy(Request $request, Space $space)
    {
        $space->delete();

        AuditLog::record($request->user(), 'space.deleted', $space);

        return response()->json(['message' => 'Space deleted.']);
    }

    public function uploadImage(Request $request, Space $space)
    {
        $request->validate([
            'image' => ['required', 'image', 'mimes:jpg,jpeg,png,webp', 'max:5120'],
        ]);

        $path = $request->file('image')->store("spaces/{$space->id}", 'public');
        $url = Storage::disk('public')->url($path);

        $images = $space->images ?? [];
        $images[] = $url;
        $space->update(['images' => $images]);

        return response()->json(['space' => $space]);
    }

    private function validated(Request $request, ?int $ignoreId = null): array
    {
        return $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'type' => ['required', 'in:event,office'],
            'description' => ['nullable', 'string', 'max:5000'],
            'capacity' => ['required', 'integer', 'min:0'],
            'price' => ['required', 'numeric', 'min:0'],
            'price_unit' => ['required', 'in:hour,day,month'],
            'deposit_amount' => ['nullable', 'numeric', 'min:0'],
            'location' => ['nullable', 'string', 'max:255'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:255'],
            'images' => ['nullable', 'array'],
            'images.*' => ['string'],
            'status' => ['required', 'in:active,inactive,maintenance'],
        ]);
    }

    private function uniqueSlug(string $name, ?int $ignoreId = null): string
    {
        $base = Str::slug($name);
        $slug = $base;
        $i = 1;

        while (Space::query()->where('slug', $slug)->when($ignoreId, fn ($q) => $q->where('id', '!=', $ignoreId))->exists()) {
            $slug = "{$base}-{$i}";
            $i++;
        }

        return $slug;
    }
}
