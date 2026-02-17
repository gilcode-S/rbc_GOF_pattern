<?php

use App\Http\Controllers\AssignManagerController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\HotelController;
use App\Http\Controllers\RoomController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use Laravel\Fortify\Features;

Route::get('/', function () {
    return Inertia::render('welcome', [
        'canRegister' => Features::enabled(Features::registration()),
    ]);
})->name('home');

Route::get('dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');
Route::resource('hotels', HotelController::class)->only(['index', 'store', 'update'])->middleware(['auth', 'verified']);


// routes for assigning controller 
Route::get('/assign-manager', [AssignManagerController::class, 'index'])->name('assign-manager');
Route::post('/assign-manager/{managerId}/assign' , [AssignManagerController::class, 'assign'])->name('assign-manager.assign');
Route::post('/assign-manager/{managerId}/unassign' , [AssignManagerController::class, 'unassign'])->name('assign-manager.unassign');
Route::post('/users/{id}/toggle-active', [AssignManagerController::class, 'toggleActive'])->name('user.toggleActive');

//  routes for manager (hotel ROOMS)
Route::resource('rooms', RoomController::class)->except(['create', 'edit',])->middleware(['auth', 'verified']);


require __DIR__.'/settings.php';
    