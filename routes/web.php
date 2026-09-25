<?php

use App\Http\Controllers\ApplicationController;
use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

// MySQL Driven Applications API
Route::prefix('api/applications')->group(function () {
    Route::get('/', [ApplicationController::class, 'index']);
    Route::post('/', [ApplicationController::class, 'store']);
    Route::get('/track', [ApplicationController::class, 'track']);
    Route::patch('/{id}/status', [ApplicationController::class, 'updateStatus']);
    Route::delete('/{id}', [ApplicationController::class, 'destroy']);
});
