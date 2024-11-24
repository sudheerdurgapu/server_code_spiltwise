const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const expenseSchema = new Schema({
  description: {
    type: String,
    required: [true, "Please provide description"],
  },
  totalAmount: {
    type: Number,
    required: [true, "Please provide total amount"],
  },
  date: {
    type: Date,
    default: Date.now,
  },
  tax: {
    type: Number,
    default: 0,
  },
  discount: {
    type: Number,
    default: 0,
  },
  paidBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide the owner"],
  },
  sharedWith: [
    {
      user: {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
      shareAmount: {
        type: Number,
        required: [true, "Please provide shared amount"],
      },
      exemptedItems: [String],
    },
  ],
  group: {
    type: Schema.Types.ObjectId,
    ref: "Group",
    required: [true, "Please provide group"],
  },
  image: { type: String },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Expense = mongoose.model("Expense", expenseSchema);
module.exports = Expense;
