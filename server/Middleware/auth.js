const jwt = require("jsonwebtoken");
const jwtSecret = "secret_jwt";

const fetchUser = (req, res, next) => {
  const token = req.header("auth_token");
  if (!token) {
    return res
      .status(401)
      .send({ error: "Please authenticate using a valid token" });
  }

  try {
    const data = jwt.verify(token, jwtSecret);
    req.user = data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .send({ error: "Token expired or invalid. Please authenticate again." });
  }
};

module.exports = { fetchUser };
