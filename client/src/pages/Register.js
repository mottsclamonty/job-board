import { useState, useEffect } from 'react';
import Wrapper from '../assets/wrappers/RegisterPageWrapper';
import { Logo, FormRow, Alert } from '../components';
import { useAppContext } from '../context/appContext';
import { useNavigate } from 'react-router-dom';

const initialState = {
  name: '',
  email: '',
  password: '',
  isMember: true,
};

const Register = () => {
  const [values, setValues] = useState(initialState);
  const { isLoading, showAlert, displayAlert, clearAlert, user, setupUser } =
    useAppContext();
  const navigate = useNavigate();

  const toggleMember = () => {
    setValues({ ...values, isMember: !values.isMember });
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const { name, email, password, isMember } = values;

    if (!email || !password || (!isMember && !name)) {
      displayAlert();
      return;
    }

    const currentUser = { name, email, password };

    setupUser({
      currentUser,
      endpoint: isMember ? 'login' : 'register',
      alertText: `${
        isMember ? 'Login' : 'Registration'
      } successful! Redirecting to dashboard...`,
    });

    clearAlert();
  };

  useEffect(() => {
    if (user) {
      setTimeout(() => {
        navigate('/');
      }, 3000);
    }
  }, [user, navigate]);

  return (
    <Wrapper className="full-page">
      <form className="form" onSubmit={onSubmit}>
        <Logo />
        <h3>{values.isMember ? 'Login' : 'Register'}</h3>
        {showAlert && <Alert />}
        {/* name field -- only show for register */}
        {!values.isMember && (
          <FormRow
            type="text"
            name="name"
            handleChange={handleChange}
            value={values.name}
          />
        )}
        {/* email field */}
        <FormRow
          type="email"
          name="email"
          handleChange={handleChange}
          value={values.email}
        />
        {/* password field */}
        <FormRow
          type="password"
          name="password"
          handleChange={handleChange}
          value={values.password}
        />
        <button type="submit" className="btn btn-block" disabled={isLoading}>
          Submit
        </button>
        <button
          type="button"
          className="btn btn-block btn-alt"
          disabled={isLoading}
          onClick={() => {
            setupUser({
              currentUser: {
                name: 'test',
                email: 'test@example.com',
                password: 'secret',
              },
              endpoint: 'login',
              alertText: 'Loading demo app...',
            });
          }}
        >
          demo app
        </button>
        <p>
          {values.isMember ? 'Not a member yet?' : 'Already a member?'}
          <button type="button" className="member-btn" onClick={toggleMember}>
            {values.isMember ? 'Sign up' : 'Log in'}
          </button>
        </p>
      </form>
    </Wrapper>
  );
};

export default Register;
