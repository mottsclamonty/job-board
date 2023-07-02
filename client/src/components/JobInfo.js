import React from 'react';
import JobInfoWrapper from '../assets/wrappers/JobInfoWrapper';
const JobInfo = ({ icon, text }) => {
  return (
    <JobInfoWrapper>
      <span className="icon">{icon}</span>
      <span className="text">{text}</span>
    </JobInfoWrapper>
  );
};
export default JobInfo;
