const express = require("express");
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  addUser,
  updateUser,
} = require("../controller/userController");
// routes

// get all users
router.get("/", getAllUsers);

// get user by id
router.get("/:id", getUserById);

// add user
router.post("/add", addUser);

// update user
router.put("/:id", updateUser);

module.exports = router;
