const express = require("express");
const { getItem, updateItem, deleteItem } = require("../controllers/item");

const router = express.Router();

router.get("/:itemId", getItem);
router.patch("/:itemId", updateItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
