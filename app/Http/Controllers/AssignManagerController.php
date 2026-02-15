<?php

namespace App\Http\Controllers;

use App\Models\Tenant;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AssignManagerController extends Controller
{
    //
    public function index()
    {
    // get all manager
        $manager = User::where('role', 'manager')->get();
        // get all hotel
        $hotel = Tenant::all();

        // prepare manager assignment
        $managerAssignments = $manager->map(function ($manager) use ($hotel) {
            $hotel = $manager->tenant_id ? $hotel->firstWhere('tenant_id', $manager->tenant_id) : null;
            
            return [
                'id' => $manager->id,
                'name' => $manager->name,
                'email' => $manager->email,
                'is_active' => $manager->is_active,
                'hotel' => $hotel ? [
                    'tenant_id' => $hotel->tenant_id,
                    'hotel_name' => $hotel->hotel_name,
                ] : null,

            ];
        });

        //  prepare hotel assignment
        $hotelAssignment = $hotel->map(function($hotel) use ($manager) {
            $manager = $manager->firstWhere('tenant_id', $hotel->tenant_id);
            
            return [
                'tenant_id' => $hotel->tenant_id,
                'hotel_name' => $hotel->hotel_name,
                'manager' => $manager ? [
                    'id' => $manager->id,
                    'name' => $manager->name,
                    'email' => $manager->email,
                ]: null,
            ];
        });

        return Inertia::render('assign-manager', [
            'managers' => $managerAssignments,
            'hotels' => $hotelAssignment
        ]);
    }

    // assign function 
    public function assign(Request $request, $managerId)
    {
        // validatation
        $request->validate([
            'tenant' => 'required|exist:tenants, tenant_id',
        ]);

        $manager = User::where('role', 'manager')->findOrFail($managerId);
        $manager->tenant_id = $request->tenant_id;
        $manager->save();

        return redirect()->route('assign-manager');
    }

    public function unassign($managerId)
    {
        $manager = User::where('role', 'manager')->findOrFail($managerId);
        $manager->tenant_id = null;
        $manager->save();

        return redirect()->route('assign-manager');
    }

    public function toggleActive($id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();
        return back()->with('success','User Status Updated successfully');
    }
}
