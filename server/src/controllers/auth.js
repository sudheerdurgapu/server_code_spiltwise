const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catch-async");
const AppError = require("../utils/app-error");
const User = require("../models/user");

const registerUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return next(new AppError("User already exists with this email", 400));
  }

  // Encrypt the password before saving
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create a new user
  const user = await User({
    name,
    email,
    password: hashedPassword,
    expensesOwed: [],
    expensesPaid: [],
    balance: 0,
  });

  const dbUser = await user.save();

  // Generate JWT token
  const token = jwt.sign({ id: dbUser._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    message: "User registered successfully",
    token,
    data: {
      user: dbUser,
    },
  });
});

const loginUser = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("Invalid email or password", 404));
  }

  // Verify the password
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) {
    return next(new AppError("Invalid email or password", 404));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    message: "Login successful",
    token,
    data: {
      user,
    },
  });
});

const verifyToken = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return next(new AppError("You are not logged in!", 401));
  }

  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return next(new AppError("Invalid token!", 401));
    }
    req.userId = decoded.id;
    next();
  });
};

module.exports = { registerUser, loginUser, verifyToken };
