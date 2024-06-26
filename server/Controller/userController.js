const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../Model/User");

const saltRounds = 10;
const jwtSecret = "secret_jwt";
const jwtExpiry = "2h";

exports.signup = async (req, res) => {
  try {
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res
        .status(409)
        .json({ success: false, error: "Email already exists" });
    }

    const hashedPassword = await bcrypt.hash(req.body.password, saltRounds);

    const user = new User({
      name: req.body.name,
      email: req.body.email,
      password: hashedPassword,
    });

    await user.save();

    const token = jwt.sign({ user: { id: user._id } }, jwtSecret, {
      expiresIn: jwtExpiry,
    });
    res.json({ success: true, token, email: user.email, name: user.name });
  } catch (error) {
    res.status(500).json({ success: false, error: "Internal Server Error" });
  }
};

exports.login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      const passwordMatch = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (passwordMatch) {
        const token = jwt.sign({ user: { id: user._id } }, jwtSecret, {
          expiresIn: jwtExpiry,
        });
        res.json({ success: true, token, email: user.email, name: user.name });
      } else {
        res
          .status(401)
          .json({ success: false, error: "Invalid email or password" });
      }
    } else {
      res
        .status(401)
        .json({ success: false, error: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: "Server error" });
  }
};
