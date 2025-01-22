"use strict";

const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

// User Registration
// Handles user registration by validating the password format,
// checking for existing email, and saving new user data.
exports.register = async (req, res) => {
  const { username, email, password, skin_type } = req.body;

  const passwordRegex = /^[A-Z].{7,}$/;
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Password must be at least 8 characters and begin with uppercase letters.",
    });
  }

  try {
    const existingUser = await User.findUserByEmail(email);
    if (existingUser)
      return res.status(400).json({ message: "Email Already Exist" });

    await User.createUser(username, email, password, skin_type);
    res.status(201).json({ message: "Registration Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User Login
// Handles user login by verifying email and password,
// and generating access and refresh tokens.
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User Not Found" });

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid)
      return res.status(400).json({ message: "Incorrect Password" });

    const activeToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    await User.createOrUpdateAuthToken(user.id, activeToken, refreshToken);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      message: "Login Successfully",
      loginResult: {
        userID: user.id,
        username: user.username,
        active_token: activeToken,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Refresh Active Token
// Generates a new active token using the refresh token,
// ensuring continued authentication without requiring a login.
exports.refreshToken = async (req, res) => {
  const refresh_token = req.cookies.refreshToken;

  if (!refresh_token)
    return res.status(400).json({ message: "Refresh Token Required" });

  try {
    const decoded = jwt.verify(refresh_token, process.env.JWT_SECRET);

    const user = await User.findUserById(decoded.id);
    if (!user) return res.status(404).json({ message: "User Not Found" });

    const authRecord = await User.findAuthByUserId(user.id);
    if (!authRecord || authRecord.refresh_token !== refresh_token) {
      return res.status(403).json({ message: "Invalid Refresh Token" });
    }

    const activeToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.json({
      message: "Token Updated",
      loginResult: {
        userID: user.id,
        username: user.username,
        active_token: activeToken,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Invalid or Expired Refresh Token" });
  }
};
