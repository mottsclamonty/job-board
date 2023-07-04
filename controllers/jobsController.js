import { StatusCodes } from 'http-status-codes';
import {
  BadRequestError,
  NotFoundError,
  UnauthenticatedError,
} from '../errors/index.js';
import Job from '../models/Job.js';
import checkPermissions from '../utils/checkPermissions.js';
import mongoose from 'mongoose';
import moment from 'moment';

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
  const { search, jobStatus, jobType, sort } = req.query;

  const queryObject = {
    createdBy: req.user.userId,
  };

  if (jobStatus && jobStatus !== 'all') {
    queryObject.jobStatus = jobStatus;
  }
  if (jobType && jobType !== 'all') {
    queryObject.jobType = jobType;
  }
  // find jobs with positions matching case insensitive search regex
  if (search) {
    queryObject.position = { $regex: search, $options: 'i' };
  }

  let query = Job.find(queryObject);

  // Different sort options
  if (sort === 'latest') {
    query = query.sort('-createdAt');
  }
  if (sort === 'oldest') {
    query = query.sort('createdAt');
  }
  if (sort === 'a-z') {
    query = query.sort('position');
  }
  if (sort === 'z-a') {
    query = query.sort('-position');
  }

  // pagination
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  query = query.skip(skip).limit(limit);

  // awaiting modified query promise
  const allJobs = await query;

  // total number of jobs and number of pages
  const totalJobs = await Job.countDocuments(queryObject);
  const pageCount = Math.ceil(totalJobs / limit);

  res.status(StatusCodes.OK).json({ jobs: allJobs, totalJobs, pageCount });
};

const getJob = async (req, res) => {
  const { id } = req.params;
  res.send(`Job # ${id}`);
};

const showStats = async (req, res) => {
  // Aggregate and group all jobs based on job status
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

  // Aggregate and group how many applications were made for each of the past 6 months
  let monthlyApplications = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    {
      $group: {
        _id: {
          year: {
            $year: '$createdAt',
          },
          month: {
            $month: '$createdAt',
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': -1, '_id.month': -1 } },
    { $limit: 6 },
  ]);

  // Make the aggregated data less clunky
  monthlyApplications = monthlyApplications
    .map((item) => {
      const {
        _id: { year, month },
        count,
      } = item;

      const date = moment()
        .month(month - 1)
        .year(year)
        .format('MMM Y');
      return { date, count };
    })
    .reverse();

  res.status(StatusCodes.OK).json({ stats: defaultStats, monthlyApplications });
};

export { createJob, deleteJob, updateJob, getAllJobs, getJob, showStats };
