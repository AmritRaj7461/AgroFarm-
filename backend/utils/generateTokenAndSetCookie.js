const jwt = require("jsonwebtoken");

exports.generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ id: userId }, "YOUR_SECRET_KEY", {
        expiresIn: "7d",
    });

    res.cookie("token", token, {
        httpOnly: true,
        secure: false, // change to true on production with HTTPS
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    return token;
};
