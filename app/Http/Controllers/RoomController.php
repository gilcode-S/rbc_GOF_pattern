<?php

namespace App\Http\Controllers;

use App\Models\Room;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RoomController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $rooms = Room::where('tenant_id' , $user->tenant_id)->get();

        return Inertia::render('Rooms/Room', [
            'rooms' => $rooms,
            'tenant_id' => $user->tenant_id
        ]);
    }


    public function store(Request $request)
    {
        $user = $request->user();
        $data = $request->all();
        $data['tenant_id'] = $user->tenant_id;
        Room::create($data);
        $rooms = Room::where('tenant_id', $user->tenant_id)->get();

        return Inertia::render('Rooms/Room', [
            'rooms' => $rooms,
            'tenant_id' => $user->tenant_id
        ]); 
    }


    public function show ($id)
    {
        // show a single room 
        return response()->json(Room::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $user = $request->user();
        $room = Room::findOrFail($id);
        $room->update($request->all());
        $room = Room::where('tenant_id', $user->tenant_id)->get();

        return Inertia::render('Rooms/Room', [
            'rooms' => $room,
            'tenant_id' => $user->tenant_id,
        ]); 
    }

    public function destroy ($id)
    {
        $user = request()->user();

        Room::destroy($id);
        $room = Room::where('tenant_id', $user->tenant_id)->get();

        return Inertia::render('Rooms/Room', [
            'rooms' => $room,
            'tenant_id' => $user->tenant_id
        ]);
    }
}
