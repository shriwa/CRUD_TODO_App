const express = require("express");
const router = express.Router();

const { signup, login } = require("../Controller/userController");
const { fetchUser } = require("../Middleware/auth");

router.post("/signup", signup);
router.post("/login", login);

router.get("/profile", fetchUser, (req, res) => {
  res.json({ success: true, user: req.user });
});

module.exports = router;
