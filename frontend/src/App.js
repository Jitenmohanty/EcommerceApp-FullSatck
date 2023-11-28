import './App.css';
import Protected from './features/auth/Components/Protected';
import CartPage from './pages/CartPage';
import Checkout from './pages/Checkout';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import ProductDetailPage from './pages/ProductDetailPage';
import SignupPage from './pages/SignUpPage';

import {
  createBrowserRouter,
  RouterProvider,
  Route,
  Link,
} from 'react-router-dom';

const router = createBrowserRouter([
  {
    path: '/',
    element:<Protected><Home></Home></Protected>,
  },
  {
    path: '/login',
    element: <LoginPage></LoginPage>,
  },
  {
    path: '/signup',
    element: <SignupPage></SignupPage>,
  },
  { 
    path: '/cart',
    element: <Protected><CartPage></CartPage></Protected>,
  },
  { 
    path: '/checkout',
    element: <Protected><Checkout></Checkout></Protected>,
  },
  { 
    path: '/product-detail/:id',
    element: <Protected><ProductDetailPage></ProductDetailPage></Protected>,
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;