const User = require("../models/Users");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const { UnauthenticatedError } = require("../errors");
require("dotenv").config();
require("express-async-errors");

const auth = async (req, res, next) => {
  // Check headers
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError("Authentication invalid");
  }

  const token = authHeader.split(" ")[1];
  const payload = jwt.verify(token, process.env.JWT_SECRET);

  // Check if user exists
  const user = await User.findById(payload.userId).select("-password");
  if (!user) {
    throw new UnauthenticatedError("User not found");
  }

  // Attach the user to the job routes
  req.user = { userId: payload.userId, name: payload.name };
  next();
};

module.exports = auth;
