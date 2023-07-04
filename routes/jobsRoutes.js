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

import checkTestUser from '../middleware/checkTestUser.js';

jobsRouter.route('/').post(checkTestUser, createJob).get(getAllJobs);
jobsRouter.route('/stats').get(showStats);
jobsRouter
  .route('/:id')
  .delete(checkTestUser, deleteJob)
  .patch(checkTestUser, updateJob);

export default jobsRouter;
