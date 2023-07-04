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
              job <span>tracking</span> app
            </h1>
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Explicabo
              recusandae omnis, molestias quidem, reiciendis illum inventore
              excepturi atque minus illo velit ab perspiciatis nostrum vitae
              quod numquam distinctio iure quo.
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
