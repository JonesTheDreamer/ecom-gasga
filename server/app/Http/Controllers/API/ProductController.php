<?php

namespace App\Http\Controllers\Api;

use App\Models\OrderProducts;
use App\Models\Product;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::all()->map(function ($product) {
            $product->image_url = asset('storage/images/' . $product->image);
            return $product;
        });

        return response()->json(['products' => $products], 200);
    }

    public function show(Product $product)
    {
        $product->image_url = asset('storage/images/' . $product->image);
        return response()->json(['product' => $product], 200);
    }

    public function store(Request $request)
    {
        $validated = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'price' => 'required|numeric|min:0',
            'stock' => 'required|integer|min:0',
            'image' => 'required|image|mimes:jpeg,png,jpg|max:5000',
        ]);

        if ($validated->fails()) {
            return response()->json(['errors' => $validated->errors()], 422);
        }

        // Temporarily save to get the ID
        $product = Product::create([
            'name' => $request->name,
            'description' => $request->description,
            'price' => $request->price,
            'stock' => $request->stock,
            'image' => '',
        ]);

        $file = $request->file('image');
        $filename = $product->id . '_' . now()->format('YmdHis') . '.' . $file->getClientOriginalExtension();

        // Save using disk('public')
        Storage::disk('public')->putFileAs('images', $file, $filename);

        $product->image = $filename;
        $product->save();

        $product->image_url = asset('storage/images/' . $product->image);

        return response()->json(['product' => $product], 201);
    }

    public function update(Request $request, Product $product)
    {
        $validated = Validator::make($request->all(), [
            'name' => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'price' => 'sometimes|required|numeric|min:0',
            'stock' => 'sometimes|required|integer|min:0',
            'image' => 'sometimes|image|max:5000',
        ]);

        if ($validated->fails()) {
            return response()->json(['errors' => $validated->errors()], 422);
        }

        $product->update($request->only(['name', 'description', 'price', 'stock']));

        if ($request->hasFile('image')) {
            // Delete old image
            if ($product->image && Storage::disk('public')->exists('images/' . $product->image)) {
                Storage::disk('public')->delete('images/' . $product->image);
            }

            $file = $request->file('image');
            $filename = $product->id . '_' . now()->format('YmdHis') . '.' . $file->getClientOriginalExtension();
            Storage::disk('public')->putFileAs('images', $file, $filename);

            $product->image = $filename;
            $product->save();
        }

        $product->image_url = asset('storage/images/' . $product->image);

        return response()->json(['product' => $product], 200);
    }

    public function destroy(Product $product)
    {

        $exists = OrderProducts::where('product_id', auth()->id())->exists();

        if ($exists) {
            return response()->json(["message" => "Delete failed. Product is used"], 400);
        }

        if ($product->image && Storage::disk('public')->exists('images/' . $product->image)) {
            Storage::disk('public')->delete('images/' . $product->image);
        }

        $product->delete();

        return response()->json(['message' => 'Product deleted successfully'], 200);
    }
}