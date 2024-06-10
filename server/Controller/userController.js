const User = require("../Model/User");
const jwt = require("jsonwebtoken");

exports.signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "Email already exists" });
    }
    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user._id } }, "secret_jwt");
    res.json({ success: true, token });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user && req.body.password === user.password) {
      const token = jwt.sign({ user: { id: user._id } }, "secret_jwt");
      res.json({ success: true, token, email: user.email });
    } else {
      res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};