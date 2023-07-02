import React from 'react';
import JobStatItemWrapper from '../assets/wrappers/JobStatItemWrapper';
const JobStatItem = ({ title, count, icon, color, bcg }) => {
  return (
    <JobStatItemWrapper color={color} bcg={bcg}>
      <header>
        <span className="count">{count}</span>
        <div className="icon">{icon}</div>
      </header>
      <h5 className="title">{title}</h5>
    </JobStatItemWrapper>
  );
};

export default JobStatItem;
