const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const itemSchema = new Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
  },
  price: {
    type: Number,
    required: [true, "Please provide price"],
  },
  purchasedBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Please provide purchaser"],
  },
  sharedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  exemptedBy: [
    {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  expense: {
    type: Schema.Types.ObjectId,
    ref: "Expense",
    required: [true, "Please attach the expense"],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Item = mongoose.model("Item", itemSchema);
module.exports = Item;
