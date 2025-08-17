const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const app = express();
app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost/ecommerce', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User model
const User = mongoose.model('User', {
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, enum: ['user', 'vendor', 'admin'], default: 'user' },
});

// Registration
app.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = new User({ name, email, password: await bcrypt.hash(password, 10) });
    await user.save();

    // Send welcome email
    const transporter = nodemailer.createTransport({
      service: 'sendgrid',
      auth: {
        user: 'apikey',
        pass: 'YOUR_SENDGRID_API_KEY',
      },
    });
    await transporter.sendMail({
      from: 'no-reply@ecommerce.com',
      to: email,
      subject: 'Welcome to our Ecommerce Platform!',
      text: `Hi ${name}, thank you for registering with us. We're excited to have you on board!`,
    });

    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Login
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user._id, role: user.role }, 'YOUR_SECRET_KEY', {
      expiresIn: '1h',
    });
    res.json({ token });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Middleware to verify JWT token
const authenticate = async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(' ')[1];
    const decoded = jwt.verify(token, 'YOUR_SECRET_KEY');
    req.user = await User.findById(decoded.userId);
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// Protected route
app.get('/profile', authenticate, (req, res) => {
  res.json({ name: req.user.name, email: req.user.email, role: req.user.role });
});

app.listen(3000, () => {
  console.log('Server started on port 3000');
});