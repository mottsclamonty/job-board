import React from 'react';
import DashboardFormWrapper from '../../assets/wrappers/DashboardFormWrapper';
import { FormRow, FormRowSelect, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
const AddJob = () => {
  const {
    isLoading,
    showAlert,
    displayAlert,
    user,
    isEditing,
    position,
    company,
    jobLocation,
    jobType,
    jobTypeOptions,
    jobStatus,
    jobStatusOptions,
    handleChange,
    clearValues,
    createJob,
    editJob,
    editJobId,
  } = useAppContext();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!position || !company || !jobLocation) {
      displayAlert();
      return;
    }
    if (isEditing) {
      editJob(editJobId, {
        company,
        position,
        jobStatus,
        jobLocation,
        jobType,
      });
      return;
    }
    createJob({ company, position, jobStatus, jobLocation, jobType });
  };

  const handleJobInput = (e) => {
    handleChange({ name: e.target.name, value: e.target.value });
  };

  return (
    <DashboardFormWrapper>
      <form className="form">
        <h3>{isEditing ? 'edit job' : 'add job'}</h3>
        {showAlert && <Alert />}

        <div className="form-center">
          {/* position */}
          <FormRow
            type="text"
            name="position"
            value={position}
            handleChange={handleJobInput}
            disabled={user?.email === 'test@example.com'}
          />

          {/* company */}
          <FormRow
            type="text"
            name="company"
            value={company}
            handleChange={handleJobInput}
            disabled={user?.email === 'test@example.com'}
          />

          {/* location */}
          <FormRow
            type="text"
            labelText="location"
            name="jobLocation"
            value={jobLocation}
            handleChange={handleJobInput}
            disabled={user?.email === 'test@example.com'}
          />

          {/* status */}
          <FormRowSelect
            name="jobStatus"
            labelText="job status"
            value={jobStatus}
            handleChange={handleJobInput}
            options={jobStatusOptions}
            disabled={user?.email === 'test@example.com'}
          />

          {/* type */}
          <FormRowSelect
            name="jobType"
            labelText="job type"
            value={jobType}
            handleChange={handleJobInput}
            options={jobTypeOptions}
            disabled={user?.email === 'test@example.com'}
          />

          <div className="btn-container">
            <button
              type="submit"
              className="btn btn-block submit-btn"
              onClick={handleSubmit}
              disabled={isLoading || user?.email === 'test@example.com'}
            >
              submit
            </button>
            <button
              type="submit"
              className="btn btn-block clear-btn"
              onClick={(e) => {
                e.preventDefault();
                clearValues();
              }}
              disabled={user?.email === 'test@example.com'}
            >
              clear
            </button>
          </div>
        </div>
      </form>
    </DashboardFormWrapper>
  );
};

export default AddJob;
