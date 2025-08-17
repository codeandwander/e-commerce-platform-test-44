```javascript
import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import Home from './components/Home';
import Products from './components/Products';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import VendorDashboard from './components/VendorDashboard';
import UserProfile from './components/UserProfile';
import AdminDashboard from './components/AdminDashboard';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <nav>
            <ul>
              <li><Link to="/">Home</Link></li>
              <li><Link to="/products">Products</Link></li>
              <li><Link to="/cart">Cart</Link></li>
              <li><Link to="/vendor-dashboard">Vendor Dashboard</Link></li>
              <li><Link to="/user-profile">User Profile</Link></li>
              <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
            </ul>
          </nav>
        </header>

        <Switch>
          <Route path="/products">
            <Products />
          </Route>
          <Route path="/cart">
            <Cart />
          </Route>
          <Route path="/checkout">
            <Checkout />
          </Route>
          <Route path="/vendor-dashboard">
            <VendorDashboard />
          </Route>
          <Route path="/user-profile">
            <UserProfile />
          </Route>
          <Route path="/admin-dashboard">
            <AdminDashboard />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
```

This is the main entry point of the React application, which sets up the routing and renders the appropriate components based on the URL. The components mentioned in the code (e.g., Home, Products, Cart, Checkout, VendorDashboard, UserProfile, AdminDashboard) will need to be implemented separately. These components should handle the specific functionality and UI elements for each section of the e-commerce platform.

Remember, this is a high-level example, and you'll need to implement the detailed functionality, error handling, state management, and other necessary features for a production-ready application. Additionally, you'll need to integrate the backend (Node.js with Express) and the database (MongoDB) to provide the full functionality of the e-commerce platform.