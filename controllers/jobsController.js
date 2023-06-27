const createJob = async (req, res) => {
  res.send('creating job');
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
