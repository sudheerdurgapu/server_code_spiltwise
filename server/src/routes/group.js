const express = require("express");
const {
  createGroup,
  addUserToGroup,
  getGroupDetails,
  getGroups,
  getUsersInGroup,
  updateGroup,
  deleteGroup,
} = require("../controllers/group");
const { verifyToken } = require("../controllers/auth");

const router = express.Router();

router.post("/", verifyToken, createGroup);
router.get("/", verifyToken, getGroups);
router.post("/add-user", verifyToken, addUserToGroup);
router.get("/:groupId", verifyToken, getGroupDetails);
router.patch("/:groupId", verifyToken, updateGroup);
router.delete("/:groupId", verifyToken, deleteGroup);
router.get("/:groupId/users", verifyToken, getUsersInGroup);

module.exports = router;
