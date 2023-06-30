import { StatusCodes } from 'http-status-codes';
import { BadRequestError } from '../errors/index.js';
import Job from '../models/Job.js';
import User from '../models/User.js';
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
  res.send('deleting job');
};

const updateJob = async (req, res) => {
  res.send('updating job');
};

const getAllJobs = async (req, res) => {
  res.send('all jobs');
};

const getJob = async (req, res) => {
  const { id } = req.params;
  res.send(`Job # ${id}`);
};

const showStats = async (req, res) => {
  res.send('showing job stats');
};

export { createJob, deleteJob, updateJob, getAllJobs, getJob, showStats };
