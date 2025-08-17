const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('connect-flash');
const ejs = require('ejs');
const stripe = require('stripe')('your_stripe_secret_key');
const sgMail = require('@sendgrid/mail');
const aws = require('aws-sdk');
const multer = require('multer');
const multerS3 = require('multer-s3');

const app = express();

// MongoDB connection
mongoose.connect('mongodb://localhost/ecommerce-platform', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useFindAndModify: false,
  useCreateIndex: true
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');

// Stripe integration
app.use(stripe.initialize());

// SendGrid integration
sgMail.setApiKey('your_sendgrid_api_key');

// AWS S3 integration
aws.config.update({
  accessKeyId: 'your_aws_access_key_id',
  secretAccessKey: 'your_aws_secret_access_key',
  region: 'your_aws_region'
});
const s3 = new aws.S3();
const upload = multer({
  storage: multerS3({
    s3: s3,
    bucket: 'your_s3_bucket_name',
    acl: 'public-read',
    metadata: function (req, file, cb) {
      cb(null, { fieldName: file.fieldname });
    },
    key: function (req, file, cb) {
      cb(null, `${Date.now().toString()}-${file.originalname}`)
    }
  })
});

// Routes
const authRoutes = require('./routes/auth');
const vendorRoutes = require('./routes/vendor');
const productRoutes = require('./routes/product');
const cartRoutes = require('./routes/cart');
const orderRoutes = require('./routes/order');
const reviewRoutes = require('./routes/review');
const adminRoutes = require('./routes/admin');

app.use('/auth', authRoutes);
app.use('/vendor', vendorRoutes);
app.use('/product', productRoutes);
app.use('/cart', cartRoutes);
app.use('/order', orderRoutes);
app.use('/review', reviewRoutes);
app.use('/admin', adminRoutes);

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});