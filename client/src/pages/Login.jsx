import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../UserContext";

const Login = () => {
  const { login, register } = useUser();
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    console.log(form);

    try {
      let res;
      if (isLogin) {
        res = await login({ email: form.email, password: form.password });
      } else {
        console.log(form);
        res = await register(form);
      }

      if (res && sessionStorage.getItem("role") === "admin") {
        navigate("/admin");
      } else if (res && sessionStorage.getItem("role") === "customer") {
        navigate("/customer");
      }
    } catch (err) {
      console.log(err);

      setError("Invalid credentials or something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex bg-black text-white">
      {/* Branding Side */}
      <div
        className="w-[70%] hidden md:flex items-center justify-center bg-cover bg-center relative"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1523275335684-37898b6baf30')",
        }}
      >
        <div className="absolute inset-0 bg-black/60"></div>
        <h1 className="relative text-6xl font-semibold text-gold tracking-wide z-10 font-poetsen">
          The Watcher
        </h1>
      </div>

      {/* Form Side */}
      <div className="w-full md:w-[30%] bg-black flex items-center justify-center p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6">
          <h2 className="text-3xl font-bold font-poetsen text-gold">
            {isLogin ? "Login" : "Register"}
          </h2>

          {!isLogin && (
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Full Name"
              required
              className="w-full p-2 bg-black border border-gold rounded text-white font-[Poppins]"
            />
          )}
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            required
            className="w-full p-2 bg-black border border-gold rounded text-white font-[Poppins]"
          />
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            required
            className="w-full p-2 bg-black border border-gold rounded text-white font-[Poppins]"
          />

          {error && (
            <p className="text-red-500 text-sm font-[Poppins]">{error}</p>
          )}

          <button
            type="submit"
            className="w-full bg-amber-300 hover:bg-amber-400 text-black py-2 rounded font-semibold hover:shadow-lg transition font-[Poppins]"
          >
            {isLogin ? "Login" : "Register"}
          </button>

          <p className="text-center text-sm font-[Poppins]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <span
              onClick={() => setIsLogin(!isLogin)}
              className="text-gold cursor-pointer underline"
            >
              {isLogin ? "Register here" : "Login here"}
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
