<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    /** @use HasFactory<\Database\Factories\ProductFactory> */
    use HasFactory;
    protected $fillable = [
        'name',
        'description',
        'stock',
        'price',
        'image'
    ];

    protected function casts(): array
    {
        return [
            'stock' => 'integer',
            'price' => 'double',
        ];
    }

    public function carts()
    {
        return $this->hasMany(Cart::class);
    }
    public function orderProducts()
    {
        return $this->hasMany(OrderProducts::class);
    }
}