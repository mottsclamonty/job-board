import React from 'react';
import SearchContainerWrapper from '../assets/wrappers/SearchContainerWrapper';
import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/appContext';
const SearchContainer = () => {
  const {
    isLoading,
    search,
    searchStatus,
    searchType,
    searchLimit,
    searchLimitOptions,
    sort,
    sortOptions,
    jobStatusOptions,
    jobTypeOptions,
    handleChange,
    clearFilters,
  } = useAppContext();

  const handleSearch = (e) => {
    if (isLoading) return;
    handleChange({ name: e.target.name, value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ search, searchStatus, searchType, sort });
    clearFilters();
  };

  return (
    <SearchContainerWrapper>
      <form className="form">
        <h4>Search Form</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="search"
            value={search}
            handleChange={handleSearch}
          />
          <FormRowSelect
            type="text"
            name="searchStatus"
            labelText="job status"
            options={['all', ...jobStatusOptions]}
            value={searchStatus}
            handleChange={handleSearch}
          />
          <FormRowSelect
            type="text"
            name="searchType"
            labelText="job type"
            options={['all', ...jobTypeOptions]}
            value={searchType}
            handleChange={handleSearch}
          />
          <FormRowSelect
            type="text"
            name="sort"
            options={sortOptions}
            value={sort}
            handleChange={handleSearch}
          />
          <FormRowSelect
            type="text"
            name="searchLimit"
            labelText="Results per page"
            options={searchLimitOptions}
            value={searchLimit}
            handleChange={handleSearch}
          />
          <button
            type="button"
            className="btn btn-block btn-danger"
            onClick={handleSubmit}
            disabled={isLoading}
          >
            Clear Search Filters
          </button>
        </div>
      </form>
    </SearchContainerWrapper>
  );
};

export default SearchContainer;
