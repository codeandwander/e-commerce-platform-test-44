const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const stripe = require('stripe')('your_stripe_secret_key');
const nodemailer = require('nodemailer');
const AWS = require('aws-sdk');

const app = express();

// Connect to MongoDB
mongoose.connect('mongodb://localhost/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// AWS S3 configuration
const s3 = new AWS.S3({
  accessKeyId: 'your_aws_access_key',
  secretAccessKey: 'your_aws_secret_key',
  region: 'your_aws_region'
});

// SendGrid configuration
const transporter = nodemailer.createTransport({
  service: 'sendgrid',
  auth: {
    user: 'your_sendgrid_username',
    pass: 'your_sendgrid_password'
  }
});

// User authentication routes
app.post('/register', userController.register);
app.post('/login', userController.login);

// Vendor routes
app.post('/vendor/register', vendorController.register);
app.get('/vendor/dashboard', vendorController.getDashboard);
app.post('/vendor/products', vendorController.createProduct);
app.put('/vendor/products/:id', vendorController.updateProduct);
app.delete('/vendor/products/:id', vendorController.deleteProduct);

// Product routes
app.get('/products', productController.getProducts);
app.get('/products/search', productController.searchProducts);
app.get('/products/filters', productController.getFilters);
app.post('/cart', cartController.addToCart);
app.delete('/cart/:id', cartController.removeFromCart);
app.post('/checkout', cartController.checkout);

// Order routes
app.get('/orders', orderController.getOrders);
app.get('/orders/:id', orderController.getOrder);
app.post('/orders/:id/track', orderController.trackOrder);

// Review routes
app.post('/reviews', reviewController.createReview);
app.get('/reviews/:productId', reviewController.getReviews);

// Admin routes
app.get('/admin/dashboard', adminController.getDashboard);
app.get('/admin/users', adminController.getUsers);
app.put('/admin/users/:id', adminController.updateUser);
app.get('/admin/vendors', adminController.getVendors);
app.put('/admin/vendors/:id', adminController.updateVendor);
app.get('/admin/commissions', adminController.getCommissions);
app.put('/admin/commissions/:id', adminController.updateCommission);
app.get('/admin/analytics', adminController.getAnalytics);
app.post('/admin/moderate', adminController.moderateContent);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});