const User = require("../models/user.model");
const { generateTokenAndSetCookie } = require("../utils/generateTokenAndSetCookie");

const signup = async (req, res) => {
  const fullName = req.body.name?.trim();
  const email = req.body.email?.toLowerCase().trim();
  const password = req.body.password?.trim();

  try {
    if (!fullName || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already in use." });
    }

    const user = await User.create({
      fullName,
      email,
      password
    });

    generateTokenAndSetCookie(res, user._id);

    user.password = undefined;

    res.status(201).json({ success: true, message: "Signup successful", user });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const login = async (req, res) => {
  const email = req.body.email?.toLowerCase().trim();
  const password = req.body.password?.trim();

  try {
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found." });
    }

    // ❗ Compare plain text password
    if (user.password !== password) {
      return res.status(400).json({ success: false, message: "Invalid credentials." });
    }

    generateTokenAndSetCookie(res, user._id);

    user.password = undefined;

    res.status(200).json({
      success: true,
      message: "Login successful",
      user
    });

  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

const logout = async (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      secure: false,       
      sameSite: "lax",
      path: "/",            // default path
      expires: new Date(0)  // expire instantly
    });

    return res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Logout failed",
      error: error.message
    });
  }
};


module.exports = { signup, login, logout };
