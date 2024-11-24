const Group = require("../models/group");
const User = require("../models/user");
const AppError = require("../utils/app-error");
const catchAsync = require("../utils/catch-async");

// Create a new user
const createUser = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  const user = new User({
    name,
    email,
    password,
    expensesOwed: [],
    expensesPaid: [],
    balance: 0,
  });

  await user.save();
  res.status(201).json({ status: "success", data: user });
});

const getUserProfile = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const user = await User.findById(userId)
    .populate("expensesOwed")
    .populate("expensesPaid");

  if (!user) {
    return next(AppError("User not found", 404));
  }
  res.status(200).json({ status: "success", data: user });
});

// Get user details with expenses they owe or paid
const getUserDetails = catchAsync(async (req, res, next) => {
  const { userId } = req.params;
  const user = await User.findById(userId)
    .populate("expensesOwed")
    .populate("expensesPaid");

  if (!user) {
    return next(AppError("User not found", 404));
  }
  res.status(200).json({ status: "success", data: user });
});

const getUsers = catchAsync(async (req, res, next) => {
  const users = await User.find()
    .populate("expensesOwed")
    .populate("expensesPaid");

  res.status(200).json({ status: "success", data: users });
});

const updateUser = catchAsync(async (req, res, next) => {
  const userId = req.userId;
  const { name } = req.body;
  const user = await User.findById(userId)
    .populate("expensesOwed")
    .populate("expensesPaid");

  user.name = name;
  user.save();

  res.status(200).json({ status: "success", data: user });
});

const getUserProfileWithDebtInfo = catchAsync(async (req, res, next) => {
  const userId = req.userId;

  // Fetch the user's profile data (excluding password)
  const userProfile = await User.findById(userId).select("-password");
  if (!userProfile) {
    return res.status(404).json({
      status: "fail",
      message: "User not found",
    });
  }

  // Fetch all groups where the user is a member
  const groups = await Group.find({ members: userId })
    .populate("members", "-password")
    .populate({
      path: "expenses",
      select: "description totalAmount paidBy sharedWith",
      populate: {
        path: "paidBy sharedWith.user",
        select: "name email",
      },
    });

  const netDebtRelations = {};

  groups.forEach((group) => {
    group.expenses.forEach((expense) => {
      const paidBy = expense.paidBy;

      expense.sharedWith.forEach((share) => {
        const sharedUserId = share.user._id.toString();
        const shareAmount = share.shareAmount;

        // If the current user is the one who paid
        if (userId.toString() === paidBy._id.toString()) {
          if (sharedUserId !== userId.toString()) {
            if (!netDebtRelations[sharedUserId]) {
              netDebtRelations[sharedUserId] = { _id: sharedUserId, name: share.user.name, email: share.user.email, netAmount: 0 };
            }
            netDebtRelations[sharedUserId].netAmount += shareAmount;
          }
        } else if (sharedUserId === userId.toString()) {
          if (!netDebtRelations[paidBy._id]) {
            netDebtRelations[paidBy._id] = { _id: paidBy._id, name: paidBy.name, netAmount: 0 };
          }
          netDebtRelations[paidBy._id].netAmount -= shareAmount;
        }
      });
    });
  });

  const userDebts = Object.values(netDebtRelations).map((debt) => ({
    _id: debt._id,
    name: debt.name,
    email: debt.email,
    amount: Math.abs(debt.netAmount),
    owedToMe: debt.netAmount > 0,
  }));

  console.log({userDebts})

  const totalAmount = userDebts.reduce((acc, curr) => acc += curr.owedToMe ? curr.amount : -curr.amount, 0);

  res.status(200).json({
    status: "success",
    data: {
      ...userProfile.toObject(),
      balance: -totalAmount,
      users: userDebts,
    },
  });
});

module.exports = {
  createUser,
  getUserDetails,
  getUsers,
  getUserProfile,
  getUserProfileWithDebtInfo,
  updateUser,
};
