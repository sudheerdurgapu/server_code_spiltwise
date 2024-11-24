const mongoose = require("mongoose");
const validator = require("validator");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide your name"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: [true, "Email already exists"],
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide your password"],
  },
  balance: {
    type: Number,
    default: 0,
  },
  expensesPaid: [
    {
      type: Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
  expensesOwed: [
    {
      type: Schema.Types.ObjectId,
      ref: "Expense",
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
