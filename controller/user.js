const User = require("../models/Users");
const { StatusCodes } = require("http-status-codes");
const {
  BadRequestError,
  UnauthenticatedError,
  NotFoundError,
} = require("../errors");
require("express-async-errors");
const getAllUsers = async (req, res) => {
  const users = await User.find({});
  res.status(StatusCodes.OK).json({ users });
};

const getUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NotFoundError(`No user with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ user });
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, currentPassword, password } = req.body;

  // Check if the user exists
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NotFoundError(`No user with id ${id}`);
  }

  // Only update fields that are provided
  if (name !== undefined) user.name = name;
  if (email !== undefined) user.email = email;
  if (password !== undefined) {
    if (!currentPassword) {
      throw new BadRequestError("Please provide your current password");
    }
    const isPasswordCorrect = await user.comparePassword(currentPassword);
    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Password");
    }
    user.password = password;
  }

  await user.save();
  res.status(StatusCodes.OK).json({ user });
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  const user = await User.findOne({ _id: id });
  if (!user) {
    throw new NotFoundError(`No user with id ${id}`);
  }
  await user.deleteOne();
  res
    .status(StatusCodes.OK)
    .json({ msg: `Data ${user.name} has been deleted` });
};

module.exports = { getAllUsers, getUser, updateUser, deleteUser };
