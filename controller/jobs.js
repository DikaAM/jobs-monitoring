const Jobs = require("../models/Jobs");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const Status = require("../models/Status");

const createJob = async (req, res) => {
  const { company, position, statusCode } = req.body;
  req.body.createdBy = req.user.userId;
  if (!company || !position || !statusCode) {
    throw new BadRequestError(
      "Please provide company, position and statusCode"
    );
  }
  //Check if statusCode exists in database
  const status = await Status.find({ statusCode });
  if (!status) {
    throw new BadRequestError("Invalid status code");
  }
  //If statusCode exists, get statusName from database
  req.body.status = status[0].statusName;
  //Create job
  const job = await Jobs.create(req.body);
  res.status(StatusCodes.CREATED).json(job);
};

const getAllJobs = async (req, res) => {
  const jobs = await Jobs.find({ createdBy: req.user.userId }).sort(
    "createdAt"
  );
  if (!jobs) {
    throw new NotFoundError("No jobs found");
  }
  res.status(StatusCodes.OK).json({ jobs, count: jobs.length });
};
const getAJob = async (req, res) => {
  const { id } = req.params;
  const job = await Jobs.findOne({ _id: id, createdBy: req.user.userId });
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }
  res.status(StatusCodes.OK).json({ job });
};
const updateJob = async (req, res) => {
  const { id } = req.params;
  const { company, position, statusCode } = req.body;

  const job = await Jobs.findOne({ _id: id, createdBy: req.user.userId });
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }
  //Check if statusCode exists in database
  const status = await Status.find({ statusCode });
  if (!status) {
    throw new BadRequestError("Invalid status code");
  }
  //Just update the job if value is provided
  if (company !== undefined) job.company = company;
  if (position !== undefined) job.position = position;
  if (statusCode !== undefined) job.status = status[0].statusName;
  const newJob = await job.save();
  res.status(StatusCodes.OK).json({ newJob, msg: "Job updated" });
};

const deleteJob = async (req, res) => {
  const { id } = req.params;
  const job = await Jobs.findOne({ _id: id, createdBy: req.user.userId });
  if (!job) {
    throw new NotFoundError(`No job with id ${id}`);
  }
  await job.deleteOne();
  res
    .status(StatusCodes.OK)
    .json({ job, msg: `Job with id ${id}has been deleted` });
};

module.exports = {
  createJob,
  getAllJobs,
  getAJob,
  updateJob,
  deleteJob,
};
