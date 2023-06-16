const express = require("express");

const { signupUser, loginUser, logoutUser } = require("../controllers/userControllers");

const router = express.Router();

router.post("/signup", signupUser);
router.get("/login", loginUser);
router.post("/logout", logoutUser);

module.exports = router;