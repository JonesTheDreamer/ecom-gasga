import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useProduct } from "../ProductContext";
import { useNavigate } from "react-router-dom";

const EmployeeAddProduct = () => {
  const { createProduct } = useProduct();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};

    if (!form.name.trim()) errs.name = "Name is required.";
    if (!form.description.trim()) errs.description = "Description is required.";

    if (!form.price || isNaN(form.price) || Number(form.price) <= 0) {
      errs.price = "Price must be a positive number.";
    }

    if (!form.stock || isNaN(form.stock) || parseInt(form.stock) <= 0) {
      errs.stock = "Stock must be a positive integer.";
    }

    return errs;
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setForm({ ...form, image: file });

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);

    if (Object.keys(errs).length === 0) {
      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("description", form.description.trim());
      formData.append("price", form.price);
      formData.append("stock", form.stock);
      if (form.image) formData.append("image", form.image);

      const success = await createProduct(formData);
      if (success) navigate("/admin");
    }
  };

  return (
    <div className="flex min-h-screen bg-black text-white font-[Poppins]">
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className="text-3xl text-gold mb-6">Add New Product</h1>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col md:flex-row gap-10"
        >
          {/* LEFT FORM */}
          <div className="flex-1 space-y-4">
            <div>
              <label className="block text-sm mb-1 text-white">
                Product Name
              </label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              />
              {errors.name && (
                <p className="text-red-400 text-sm">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm mb-1 text-white">
                Description
              </label>
              <textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                className="w-full p-2 rounded bg-gray-800 border border-gray-600"
              />
              {errors.description && (
                <p className="text-red-400 text-sm">{errors.description}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm mb-1 text-white">
                  Price (₱)
                </label>
                <input
                  type="number"
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                />
                {errors.price && (
                  <p className="text-red-400 text-sm">{errors.price}</p>
                )}
              </div>

              <div>
                <label className="block text-sm mb-1 text-white">Stock</label>
                <input
                  type="number"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-600"
                />
                {errors.stock && (
                  <p className="text-red-400 text-sm">{errors.stock}</p>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="bg-amber-300 text-black px-6 py-2 rounded shadow hover:bg-yellow-400 transition mt-4"
            >
              Submit
            </button>
          </div>

          {/* RIGHT IMAGE PREVIEW */}
          <div className="w-full md:w-1/2 flex flex-col items-center justify-start mt-6 md:mt-0">
            {preview ? (
              <img
                src={preview}
                alt="Preview"
                className="w-full max-w-xs h-80 object-cover rounded border border-gray-700 shadow"
              />
            ) : (
              <div className="w-full max-w-xs h-80 border-2 border-dashed border-gray-600 flex items-center justify-center text-gray-400">
                Upload Image
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-4 text-sm"
            />
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeAddProduct;
