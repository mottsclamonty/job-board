import React from 'react';
import JobStatsContainerWrapper from '../assets/wrappers/JobStatsContainerWrapper';
import { useAppContext } from '../context/appContext';
import JobStatItem from './JobStatItem';
import { FaStopwatch, FaTimesCircle, FaUserTie } from 'react-icons/fa';
const JobStatsContainer = () => {
  const { stats } = useAppContext();
  const statArray = [
    {
      title: 'pending applications',
      count: stats.pending || 0,
      icon: <FaStopwatch />,
      color: '#e9b949',
      bcg: '#fcefc7',
    },
    {
      title: 'scheduled interviews',
      count: stats.interview || 0,
      icon: <FaUserTie />,
      color: '#45BF55',
      bcg: '#c0f4b8',
    },
    {
      title: 'declined applications',
      count: stats.declined || 0,
      icon: <FaTimesCircle />,
      color: '#d66a6a',
      bcg: '#ffeeee',
    },
  ];
  return (
    <JobStatsContainerWrapper>
      {statArray.map((stat) => (
        <JobStatItem key={stat.title} {...stat} />
      ))}
    </JobStatsContainerWrapper>
  );
};

export default JobStatsContainer;
