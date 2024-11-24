const Item = require("../models/item");
const Expense = require("../models/expense");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");

// Add items to an expense
const addItemToExpense = catchAsync(async (req, res, next) => {
  const { expenseId } = req.params;
  const { name, price, purchasedBy, sharedBy, exemptedBy } = req.body;

  const item = new Item({
    name,
    price,
    purchasedBy,
    sharedBy,
    exemptedBy,
    expense: expenseId,
  });

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    return next(new AppError("Expense not found", 404));
  }

  await item.save();

  res.status(201).json({ status: "success", data: item });
});

// Get items under an expense
const getItemsByExpense = catchAsync(async (req, res, next) => {
  const { expenseId } = req.params;

  const expense = await Expense.findById(expenseId);
  if (!expense) {
    return next(new AppError("Expense not found", 404));
  }

  // Get items by expenseId
  const items = await Item.find({ expense: expenseId })
    .populate("sharedBy", "name email")
    .populate("exemptedBy", "name email");
  res.status(200).json({ status: "success", data: items });
});

const getItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  const item = await Item.findById(itemId)
    .populate("sharedBy", "name email")
    .populate("exemptedBy", "name email")
    .populate("purchasedBy", "name email");

  if (!item) {
    return next(new AppError("Item not found", 404));
  }

  res.status(200).json({ status: "success", data: item });
});

const updateItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;
  const { name, price, sharedBy, exemptedBy } = req.body;

  const item = await Item.findByIdAndUpdate(
    itemId,
    { name, price, sharedBy, exemptedBy },
    { new: true, runValidators: true }
  )
    .populate("sharedBy", "name email")
    .populate("exemptedBy", "name email")
    .populate("purchasedBy", "name email");

  if (!item) {
    return next(new AppError("Item not found", 404));
  }

  res.status(200).json({ status: "success", data: item });
});

const deleteItem = catchAsync(async (req, res, next) => {
  const { itemId } = req.params;

  const item = await Item.findByIdAndDelete(itemId);

  if (!item) {
    return next(new AppError("Item not found", 404));
  }

  res
    .status(204)
    .json({ status: "success", data: "Item deleted succcessfully!" });
});

module.exports = {
  addItemToExpense,
  getItemsByExpense,
  getItem,
  updateItem,
  deleteItem,
};
