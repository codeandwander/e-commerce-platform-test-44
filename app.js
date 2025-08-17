const express = require('express');
const mongoose = require('mongoose');
const stripe = require('stripe')('your_stripe_secret_key');
const sendgrid = require('@sendgrid/mail');
const aws = require('aws-sdk');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb://localhost/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((err) => {
  console.error('Error connecting to MongoDB:', err);
});

// Configure SendGrid
sendgrid.setApiKey('your_sendgrid_api_key');

// Configure AWS S3
aws.config.update({
  accessKeyId: 'your_aws_access_key_id',
  secretAccessKey: 'your_aws_secret_access_key',
  region: 'your_aws_region',
});
const s3 = new aws.S3();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/users', require('./routes/users'));
app.use('/api/vendors', require('./routes/vendors'));
app.use('/api/products', require('./routes/products'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/admin', require('./routes/admin'));

// Serve React app
app.use(express.static(path.join(__dirname, 'client/build')));
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/build', 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

FILENAME: client/src/App.js