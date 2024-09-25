const Status = require("../models/Status");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const createStatus = async (req, res) => {
  const { statusName, statusCode } = req.body;
  if (!statusName || !statusCode) {
    throw new BadRequestError("Please provide all values");
  }
  const status = await Status.create(req.body);
  if (!status) {
    throw new BadRequestError("Status not created");
  }
  res.status(StatusCodes.CREATED).json({ status });
};

const getAllStatus = async (req, res) => {
  const status = await Status.find({});
  if (!status) {
    throw new NotFoundError("No status found");
  }
  res.status(StatusCodes.OK).json({ status, count: status.length });
};

const updateStatus = async (req, res) => {
  const { id: statusId } = req.params;
  const { statusName } = req.body;
  if (!statusName) {
    throw new BadRequestError("Please provide statusName");
  }
  const status = await Status.findOneAndUpdate({ _id: statusId }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!status) {
    throw new NotFoundError(`No status with id ${statusId}`);
  }
  res.status(StatusCodes.OK).json({ status });
};

const deleteStatus = async (req, res) => {
  const { id: statusId } = req.params;
  const status = await Status.findOneAndDelete({ _id: statusId });
  if (!status) {
    throw new NotFoundError(`No status with id ${statusId}`);
  }
  res.status(StatusCodes.OK).json({ status });
};
module.exports = {
  createStatus,
  getAllStatus,
  updateStatus,
  deleteStatus,
};
