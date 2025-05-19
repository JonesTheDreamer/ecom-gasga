import { UserProvider } from "./UserContext";
import { ProductProvider } from "./ProductContext";
import { CartProvider } from "./CartContext";
import { OrderProvider } from "./OrderContext";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import CustomerDashboard from "./pages/CustomerDashboard";
import ProductDetails from "./pages/ProductDetails";
import CustomerCart from "./pages/CustomerCart";
import CustomerOrder from "./pages/CustomerOrder";
import EmployeeDashboard from "./pages/EmployeeDashboard";
import EmployeeEditProduct from "./pages/EmployeeEditProduct";
import EmployeeAddProduct from "./pages/EmployeeAddProduct";
import EmployeeOrders from "./pages/EmployeeOrders";

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <OrderProvider>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/customer" element={<CustomerDashboard />} />
                <Route
                  path="/customer/product/:id"
                  element={<ProductDetails />}
                />
                <Route path="/customer/cart" element={<CustomerCart />} />
                <Route path="/customer/order" element={<CustomerOrder />} />
                <Route path="/admin" element={<EmployeeDashboard />} />
                <Route
                  path="/admin/product/:id"
                  element={<EmployeeEditProduct />}
                />
                <Route path="/admin/product" element={<EmployeeAddProduct />} />
                <Route path="/admin/order" element={<EmployeeOrders />} />
              </Routes>
            </BrowserRouter>
          </OrderProvider>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;
