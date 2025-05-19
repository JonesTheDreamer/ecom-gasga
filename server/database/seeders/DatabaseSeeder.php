<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::create([
            'name' => 'Watch Man',
            'email' => 'watchexperts@gmail.com',
            'password' => Hash::make('watches'),
            'role' => 'admin',
        ]);

        User::create([
            'name' => 'John Doe',
            'email' => 'john@gmail.com',
            'password' => Hash::make('johndoe'),
            'role' => 'customer',
        ]);

        Product::factory()->create([
            'name' => 'Classic Leather Watch',
            'description' => 'Elegant analog watch with a leather strap and minimalist design.',
            'price' => 2500.00,
            'stock' => 15,
            'image' => '1_2025-05-14.jpg',
        ]);
        Product::factory()->create([
            'name' => 'Digital Sports Watch',
            'description' => 'Water-resistant sports watch with digital display and backlight.',
            'price' => 1800.00,
            'stock' => 30,
            'image' => '2_2025-05-14.jpg',
        ]);
        Product::factory()->create([
            'name' => 'Chronograph Metal Watch',
            'description' => 'Premium metal chronograph with stopwatch functionality.',
            'price' => 3400.00,
            'stock' => 10,
            'image' => '3_2025-05-14.jpg',
        ]);
        Product::factory()->create([
            'name' => 'Smart Fitness Watch',
            'description' => 'Smartwatch with fitness tracking and mobile notifications.',
            'price' => 4200.00,
            'stock' => 25,
            'image' => '4_2025-05-14.jpg',
        ]);
        Product::factory()->create([
            'name' => 'Minimalist Analog Watch',
            'description' => 'Slim and sleek analog watch for a modern look.',
            'price' => 2200.00,
            'stock' => 18,
            'image' => '5_2025-05-14.jpg',
        ]);
    }
}