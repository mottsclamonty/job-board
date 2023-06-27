import express from 'express';
const jobsRouter = express.Router();

import {
  createJob,
  deleteJob,
  updateJob,
  getAllJobs,
  getJob,
  showStats,
} from '../controllers/jobsController.js';

jobsRouter.route('/').post(createJob).get(getAllJobs);
jobsRouter.route('/stats').get(showStats);
jobsRouter.route('/:id').delete(deleteJob).patch(updateJob).get(getJob);

export default jobsRouter;
