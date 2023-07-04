import { useEffect } from 'react';
import { JobStatsContainer, ChartsContainer, Loading } from '../../components/';
import { useAppContext } from '../../context/appContext';
const Stats = () => {
  const { showStats, isLoading, monthlyApplications } = useAppContext();

  useEffect(() => {
    showStats();
    // eslint-disable-next-line
  }, []);

  if (isLoading) {
    return <Loading center />;
  }

  return (
    <>
      <JobStatsContainer />
      {monthlyApplications.length > 0 && <ChartsContainer />}
    </>
  );
};

export default Stats;
