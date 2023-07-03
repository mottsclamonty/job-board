import { useEffect } from 'react';
import JobsContainerWrapper from '../assets/wrappers/JobsContainerWrapper';
import { useAppContext } from '../context/appContext';
import Loading from './Loading';
import Job from './Job';
const JobsContainer = () => {
  const {
    getJobs,
    jobs,
    totalJobs,
    isLoading,
    search,
    searchStatus,
    searchType,
    sort,
  } = useAppContext();

  useEffect(() => {
    getJobs();
  }, [search, searchStatus, searchType, sort]);

  if (isLoading) {
    return <Loading center />;
  }

  if (jobs.length === 0) {
    return (
      <JobsContainerWrapper>
        <h2>No jobs to display right now</h2>
      </JobsContainerWrapper>
    );
  }
  return (
    <JobsContainerWrapper>
      <h5>
        {totalJobs} job{jobs.length > 1 && 's'} found
      </h5>
      <div className="jobs">
        {jobs.map((job) => {
          return <Job key={job._id} {...job} />;
        })}
      </div>
      {/* add pagination later */}
    </JobsContainerWrapper>
  );
};

export default JobsContainer;
