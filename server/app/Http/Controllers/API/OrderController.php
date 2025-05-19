<?php

namespace App\Http\Controllers\Api;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderProducts;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;

class OrderController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'orderProducts' => 'required|array|min:1',
            'orderProducts.*.product_id' => 'required|exists:products,id',
            'orderProducts.*.quantity' => 'required|integer|min:1',
        ]);

        $userId = Auth::id();
        $now = Carbon::now();

        DB::beginTransaction();

        try {
            $productQuantities = collect($validated['orderProducts'])
                ->keyBy('product_id');

            $products = Product::whereIn('id', $productQuantities->keys())->get();

            // Check stock
            foreach ($products as $product) {
                $requestedQty = $productQuantities[$product->id]['quantity'];
                if ($product->stock < $requestedQty) {
                    return response()->json([
                        'message' => "Not enough stock for product: {$product->name}"
                    ], 400);
                }
            }

            // Create order
            $order = Order::create([
                'user_id' => $userId,
                'date' => $now->format('F j, Y'),
            ]);

            $orderProducts = [];
            foreach ($products as $product) {
                $qty = $productQuantities[$product->id]['quantity'];

                $orderProducts[] = [
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $qty,

                ];
                // Subtract stock
                $product->decrement('stock', $qty);
                $cart = Cart::where("user_id", $userId)->where("product_id", $product->id)->first();
                $cart->delete();
            }

            // Bulk insert to pivot table
            OrderProducts::insert($orderProducts);

            DB::commit();

            return response()->json([
                'message' => 'Order placed successfully',
                'order_id' => $order->id
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Order failed to process',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function index()
    {
        $orders = Order::with(['user', 'orderProducts'])->get();

        $orders = $orders->map(function ($order) {
            $order->orderProducts->map(function ($op) {
                $op->product->image_url = asset('storage/images/' . $op->product->image);
            });
            return $order;
        });

        return response()->json([
            'orders' => $orders,
        ], 200);
    }

    public function show()
    {
        $orders = Order::where('user_id', Auth::id())
            ->with(['orderProducts'])
            ->get();

        $orders = $orders->map(function ($order) {
            $order->orderProducts->map(function ($op) {
                $op->product->image_url = asset('storage/images/' . $op->product->image);
            });
            return $order;
        });

        return response()->json([
            'orders' => $orders,
            'user' => Auth::user(),
        ], 200);
    }
}