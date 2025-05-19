<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\API\UserController;
use App\Http\Controllers\API\ProductController;
use App\Http\Controllers\API\OrderController;
use App\Http\Controllers\API\CartController;



Route::post('/login', [UserController::class, 'login']);
Route::post('/register', [UserController::class, 'register']);


Route::middleware('auth:sanctum')->group(function () {

    Route::post('/logout', [UserController::class, 'logout']);
    Route::get('/products', [ProductController::class, 'index']);
    Route::get('/products/{product}', [ProductController::class, 'show']);

    Route::middleware('role:admin')->group(function () {
        Route::get('/orders', [OrderController::class, 'index']);
        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{product}', [ProductController::class, 'update']);
        Route::delete('/products/{product}', [ProductController::class, 'destroy']);
    });

    Route::middleware('role:customer')->group(function () {
        Route::get('/orders/user', [OrderController::class, 'show']);
        Route::post('/orders', [OrderController::class, 'store']);
        Route::apiResource('/carts', CartController::class);
    });
});