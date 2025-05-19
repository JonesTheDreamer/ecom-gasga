<?php

namespace App\Http\Controllers\Api;

use App\Models\Cart;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;

class CartController extends Controller
{
    public function index()
    {
        $user = Auth::user();

        $carts = Cart::where('user_id', $user->id)
            ->with(['product'])
            ->get()
            ->map(function ($cart) {
                $cart->product->image_url = asset('storage/images/' . $cart->product->image);
                return $cart;
            });

        return response()->json(['carts' => $carts], 200);
    }

    public function show(Cart $cart)
    {
        $user = Auth::user();

        if ($cart->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart->load('product');
        $cart->product->image_url = asset('storage/images/' . $cart->product->image);
        $cart->user = $user;

        return response()->json(['cart' => $cart], 200);
    }

    public function store(Request $request)
    {
        $user = Auth::user();

        $validated = Validator::make($request->all(), [
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validated->fails()) {
            return response()->json(['errors' => $validated->errors()], 422);
        }

        $existing = Cart::where('user_id', $user->id)
            ->where('product_id', $request->product_id)
            ->first();

        if ($existing) {
            $existing->quantity += $request->quantity;
            $existing->save();
            $cart = $existing;
        } else {
            $cart = Cart::create([
                'user_id' => $user->id,
                'product_id' => $request->product_id,
                'quantity' => $request->quantity,
            ]);
        }

        $cart->load('product');
        $cart->product->image_url = asset('storage/images/' . $cart->product->image);

        return response()->json(['cart' => $cart], 201);
    }

    public function update(Request $request, Cart $cart)
    {
        $user = Auth::user();

        if ($cart->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $validated = Validator::make($request->all(), [
            'quantity' => 'required|integer|min:1',
        ]);

        if ($validated->fails()) {
            return response()->json(['errors' => $validated->errors()], 422);
        }

        $cart->quantity = $request->quantity;
        $cart->save();

        return response()->json(['cart' => $cart], 200);
    }

    public function destroy(Cart $cart)
    {
        $user = Auth::user();

        if ($cart->user_id !== $user->id) {
            return response()->json(['message' => 'Unauthorized'], 403);
        }

        $cart->delete();

        return response()->json(['message' => 'Cart deleted'], 200);
    }
}