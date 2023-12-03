import { useDispatch, useSelector } from "react-redux";
import "./App.css";
import Protected from "./features/auth/Components/Protected";
import CartPage from "./pages/CartPage";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import LoginPage from "./pages/LoginPage";
import ProductDetailPage from "./pages/ProductDetailPage";
import SignupPage from "./pages/SignUpPage";

import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { useEffect } from "react";
import { fetchItemByUserIdAsync } from "./features/cart/cartSlice";
import { selectLoggedInUser } from "./features/auth/authSlice";
import PageNotFound from "./pages/404";
import UserOrdersPage from "./pages/UserOrderPage";
import OrderSuccessPage from "./pages/OrderSuccessPage";
import UserProfilePage from "./pages/UserProfilePage";
import AdminProductDetailPage from "./pages/AdminProductDetailsPage";
import AdminProductFormPage from "./pages/AdminProductFormPage";
import { fetchLoggedInUserAsync } from "./features/user/userSlice";
import Logout from "./features/auth/Components/Logout";
import ForgotPasswordPage from "./pages/ForgotPasswordPage";
import ProtectedAdmin from "./features/auth/Components/ProtectedAdmin";
import AdminHome from "./pages/AdminHome";
import AdminOrdersPage from "./pages/AdminOrdersPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <Protected>
        <Home></Home>
      </Protected>
    ),
  },
  {
    path: "/login",
    element: <LoginPage></LoginPage>,
  },
  {
    path: "/signup",
    element: <SignupPage></SignupPage>,
  },
  {
    path: "/logout",
    element: <Logout></Logout>,
  },
  {
    path: "/profile",
    element: <UserProfilePage></UserProfilePage>
  },
  {
    path: "/admin",
    element: <ProtectedAdmin><AdminHome></AdminHome></ProtectedAdmin>
  },
  {
    path: "/forgot-password",
    element: <ForgotPasswordPage></ForgotPasswordPage>
  },
  {
    path: "/cart",
    element: (
      <Protected>
        <CartPage></CartPage>
      </Protected>
    ),
  },
  {
    path: "/checkout",
    element: (
      <Protected>
        <Checkout></Checkout>
      </Protected>
    ),
  },
  {
    path: "/product-detail/:id",
    element: (
      <Protected>
        <ProductDetailPage></ProductDetailPage>
      </Protected>
    ),
  },
  {
    path: "/admin/product-detail/:id",
    element: (
      <ProtectedAdmin>
        <AdminProductDetailPage></AdminProductDetailPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/product-form",
    element: (
      <ProtectedAdmin>
        <AdminProductFormPage></AdminProductFormPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/product-form/edit/:id",
    element: (
      <ProtectedAdmin>
       <AdminProductFormPage></AdminProductFormPage>
      </ProtectedAdmin>
    ),
  },
  {
    path: "/admin/orders",
    element: (
      <ProtectedAdmin>
       <AdminOrdersPage></AdminOrdersPage>
      </ProtectedAdmin>
    ),
  },
  {
    path:"/order-success/:id",
    element:(
      <Protected>
        <OrderSuccessPage></OrderSuccessPage>
      </Protected>
    )
  },
  {
    path:"/orders",
    element:(
      <Protected>
        <UserOrdersPage></UserOrdersPage>
      </Protected>
    )
  },
  {
    path:"*",
    element:(
        <PageNotFound></PageNotFound>
    )
  },
]);

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectLoggedInUser);
  useEffect(() => {
    if (user) {
      dispatch(fetchItemByUserIdAsync(user.id));
      dispatch(fetchLoggedInUserAsync(user.id))
    }
  }, [dispatch, user]);
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
