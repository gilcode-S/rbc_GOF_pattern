<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Guest;
use App\Models\Room;
use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
              // check if user is admin
        if($user->role === "admin"){
            $hotels = Tenant::with(['rooms'])->get();
            $totalHotels = $hotels->count();
            $totalMangers = User::where('role', 'manager')->count();
            $totalRooms = Room::count();
            $totalGuests = Guest::count();

            return Inertia::render('dashboard', [
                'isAdmin' => true,
                'hotels' => $hotels,
                'totalHotels' => $totalHotels,
                'totalRooms' => $totalRooms,
                'totalManagers' => $totalMangers,
                'totalGuests' => $totalGuests
            ]);
        }

        $tenantId = $user->tenant_id;
        $hotel = Tenant::where('tenant_id', $tenantId)->first();
        $guestsCount = Guest::where('tenant_id', $tenantId)->count();
        $roomsCount = Room::where('tenant_id', $tenantId)->count();
        $bookingsCount = Booking::where('tenant_id', $tenantId)->count();


        return Inertia::render('dashboard', [
            'isAdmin' => false,
            'hotel' => $hotel,
            'guestsCount' => $guestsCount,
            'roomsCount' => $roomsCount,
            'bookingsCount' => $bookingsCount
        ]);
    }
}
