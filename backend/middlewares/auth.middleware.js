const jwt = require("jsonwebtoken");

exports.protect = (req, res, next) => {
  const token = req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Not authorized. No token." });
  }

  try {
    const decoded = jwt.verify(token, "YOUR_SECRET_KEY");
    req.user = decoded.id;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token." });
  }
};
