import { Link, Navigate } from 'react-router-dom';
import main from '../assets/images/main.svg';
import Wrapper from '../assets/wrappers/LandingWrapper';
import { Logo } from '../components';
import { useAppContext } from '../context/appContext';
const Landing = () => {
  const { user } = useAppContext();
  return (
    <>
      {user && <Navigate to="/" />}
      <Wrapper>
        <nav>
          <Link to="/">
            <Logo />
          </Link>
        </nav>
        <div className="container page">
          <div className="info">
            <h1>
              job <span>tracker</span>
            </h1>
            <p>
              On the hunt for a new job? Simplify your life by tracking all of
              your applications in one place. Add new applications with a smooth
              and easy-to-use interface, search and filter all of your tracked
              applications, and quickly visualize your successes and monthly
              application rates.
            </p>
            <Link to="/register" className="btn btn-hero">
              Login/Register
            </Link>
          </div>
          <img src={main} alt="job hunt" className="img main-img" />
        </div>
      </Wrapper>
    </>
  );
};

export default Landing;
