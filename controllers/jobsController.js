import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import Job from '../models/Job.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';

const createJob = async (req, res) => {
  const { company, position } = req.body;

  if (!company || !position) {
    throw new BadRequestError('Please provide all values');
  }

  req.body.createdBy = req.user.userId;

  const newJob = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({
    job: newJob,
  });
};

const deleteJob = async (req, res) => {
  const { id: jobId } = req.params;

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  await Job.deleteOne({ _id: jobId });

  res.status(StatusCodes.OK).json({ msg: 'Job successfully deleted' });
};

const updateJob = async (req, res) => {
  const { id: jobId } = req.params;
  const { company, position, jobLocation, jobType, jobStatus } = req.body;

  if (!company || !position || !jobLocation || !jobType || !jobStatus) {
    throw new BadRequestError('Please provide all values');
  }

  const job = await Job.findOne({ _id: jobId });

  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  // Check permission to update job
  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate(
    { _id: jobId },
    { company, position, jobLocation, jobType, jobStatus },
    {
      new: true,
      runValidators: true,
    }
  );

  res.status(StatusCodes.OK).json({ updatedJob });
};

const getAllJobs = async (req, res) => {
  console.log(req.user.userId);
  const allJobs = await Job.find({ createdBy: req.user.userId });
  res
    .status(StatusCodes.OK)
    .json({ jobs: allJobs, totalJobs: allJobs.length, pageCount: 1 });
};

const getJob = async (req, res) => {
  const { id } = req.params;
  res.send(`Job # ${id}`);
};

const showStats = async (req, res) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: '$jobStatus', count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((accumulator, stat) => {
    const { _id: title, count } = stat;
    accumulator[title] = count || 0;
    return accumulator;
  }, {});

  const defaultStats = {
    pending: stats.pending || 0,
    declined: stats.declined || 0,
    interview: stats.interview || 0,
  };
  let monthlyApplications = [];
  res.status(StatusCodes.OK).json({ stats: defaultStats, monthlyApplications });
};

export { createJob, deleteJob, updateJob, getAllJobs, getJob, showStats };
