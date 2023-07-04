import { useState, useCallback } from 'react';
import SearchContainerWrapper from '../assets/wrappers/SearchContainerWrapper';
import { FormRow, FormRowSelect } from '.';
import { useAppContext } from '../context/appContext';
import debounce from 'lodash.debounce';

const SearchContainer = () => {
  const {
    isLoading,
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

  const [typingSearch, setTypingSearch] = useState('');

  const handleSearch = (e) => {
    handleChange({ name: e.target.name, value: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setTypingSearch('');
    clearFilters();
  };

  // eslint-disable-next-line
  const debouncedHandleSearch = useCallback(
    debounce((e) => {
      setTypingSearch(e.target.value);
      handleChange({ name: e.target.name, value: e.target.value });
    }, 350),
    []
  );

  return (
    <SearchContainerWrapper>
      <form className="form">
        <h4>Search Form</h4>
        <div className="form-center">
          <FormRow
            type="text"
            name="search"
            value={typingSearch}
            handleChange={(e) => {
              setTypingSearch(e.target.value);
              debouncedHandleSearch(e);
            }}
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
