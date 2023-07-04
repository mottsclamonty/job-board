import React from 'react';
import img from '../assets/images/not-found.svg';
import Wrapper from '../assets/wrappers/ErrorPageWrapper';
import { Link } from 'react-router-dom';
const Error = () => {
  return (
    <Wrapper className="full-page">
      <div>
        <img src={img} alt="not found" />
        <h3>Sorry, we couldn't find the page you were looking for</h3>
        <Link to="/">back home</Link>
      </div>
    </Wrapper>
  );
};

export default Error;
