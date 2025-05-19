import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useProduct } from "../ProductContext";
import Sidebar from "./Sidebar";

const EmployeeProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getProduct, updateProduct, deleteProduct } = useProduct();
  const [product, setProduct] = useState(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
    image: null,
  });

  useEffect(() => {
    const loadProduct = async () => {
      const data = await getProduct(id);
      setProduct(data.product);
      console.log(data.product);

      setForm({
        ...form,
        name: data.product.name,
        description: data.product.description,
        price: data.product.price,
        stock: data.product.stock,
      });
    };
    loadProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (name === "image") {
      console.log(files[0]);

      setForm({ ...form, image: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(form.image instanceof File);

    const data = new FormData();
    data.append("name", form.name);
    data.append("description", form.description);
    data.append("price", form.price);
    data.append("stock", form.stock);
    if (form.image) data.append("image", form.image);
    data.append("_method", "PUT");

    for (const [key, value] of data.entries()) {
      // 3. Handle different value types
      if (value instanceof File) {
        console.log(
          `${key}: File - ${value.name} (${value.size} bytes, ${value.type})`
        );
      } else {
        console.log(`${key}: ${value}`);
      }
    }
    console.log(data);

    await updateProduct(id, data);
    navigate("/admin");
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this product?")) {
      const req = await deleteProduct(id);
      if (req.status === 400) {
        alert(req.data.message);
      }
      navigate("/employee");
    }
  };

  if (!product) return <div className="text-white p-10">Loading...</div>;

  return (
    <div className="flex min-h-screen bg-black text-white font-poppins">
      <Sidebar />
      <div className="flex-1 p-10">
        <h1 className="text-3xl font-bold text-gold mb-6 font-poetsen">
          Edit Product
        </h1>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {/* Left: Form */}
          <div className="space-y-4">
            <div>
              <label className="text-gold block mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 p-2 rounded border border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-gold block mb-1">Description</label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 p-2 rounded border border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-gold block mb-1">Price</label>
              <input
                type="number"
                name="price"
                value={form.price}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 p-2 rounded border border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-gold block mb-1">Stock</label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                required
                className="w-full bg-gray-800 p-2 rounded border border-gray-600 text-white"
              />
            </div>
            <div>
              <label className="text-gold block mb-1">Change Image</label>
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                className="text-white"
              />
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="submit"
                className="bg-amber-300 text-black px-6 py-2 rounded hover:bg-yellow-500 transition"
              >
                Save Changes
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition"
              >
                Delete Product
              </button>
            </div>
          </div>

          {/* Right: Preview */}
          <div className="flex flex-col items-center">
            <img
              src={
                form.image ? URL.createObjectURL(form.image) : product.image_url
              }
              alt="Preview"
              className="w-full max-w-sm h-80 object-cover rounded shadow-lg"
            />
            <p className="text-gray-400 mt-2">Current Product Image</p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeProduct;
