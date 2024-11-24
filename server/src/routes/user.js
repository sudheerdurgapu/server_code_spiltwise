const express = require("express");
const {
  createUser,
  getUserDetails,
  getUsers,
  getUserProfile,
  updateUser,
  getUserProfileWithDebtInfo,
} = require("../controllers/user");
const { registerUser, loginUser, verifyToken } = require("../controllers/auth");

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", verifyToken, getUserProfileWithDebtInfo);
router.patch("/profile", verifyToken, updateUser);

router.get("/", getUsers);
router.post("/", createUser);
router.get("/:userId", getUserDetails);

module.exports = router;
