const express = require('express');
const { signup, login, logout } = require('../controllers/auth.controller');
const { protect } = require('../middlewares/auth.middleware');
const User = require('../models/user.model');
const router = express.Router();

// Public routes
router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout)

router.get("/me", protect, async (req, res) => {
  try {
    // req.user contains userId from protect middleware
    const user = await User.findById(req.user).select("-password");

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });

  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});



module.exports = router;
