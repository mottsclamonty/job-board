import { useState } from 'react';
import { FormRow, Alert } from '../../components';
import { useAppContext } from '../../context/appContext';
import DashboardFormWrapper from '../../assets/wrappers/DashboardFormWrapper';

const Profile = () => {
  const { user, showAlert, displayAlert, updateUser, isLoading } =
    useAppContext();
  const [name, setName] = useState(user?.name);
  const [lastName, setLastName] = useState(user?.lastName);
  const [email, setEmail] = useState(user?.email);
  const [location, setLocation] = useState(user?.location);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name || !email || !lastName || !location) {
      displayAlert();
      return;
    }

    updateUser({ name, email, lastName, location });
  };

  return (
    <DashboardFormWrapper>
      <form className="form" onSubmit={handleSubmit}>
        <h3>profile</h3>
        {showAlert && <Alert />}

        {/* name */}
        <div className="form-center">
          <FormRow
            type="text"
            name="name"
            handleChange={(e) => setName(e.target.value)}
            value={name}
            disabled={email === 'test@example.com'}
          />
          <FormRow
            type="text"
            labelText="last name"
            name="lastName"
            handleChange={(e) => setLastName(e.target.value)}
            value={lastName}
            disabled={email === 'test@example.com'}
          />
          <FormRow
            type="email"
            name="email"
            handleChange={(e) => setEmail(e.target.value)}
            value={email}
            disabled={email === 'test@example.com'}
          />
          <FormRow
            type="text"
            name="location"
            handleChange={(e) => setLocation(e.target.value)}
            value={location}
            disabled={email === 'test@example.com'}
          />
          <button
            type="submit"
            className="btn btn-block"
            disabled={isLoading || email === 'test@example.com'}
          >
            {isLoading ? 'Please wait...' : 'save changes'}
          </button>
        </div>
      </form>
    </DashboardFormWrapper>
  );
};

export default Profile;
