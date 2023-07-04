const attachCookie = ({ res, token }) => {
  const expirationTime = 1000 * 60 * 60 * 24; // 1 day in ms

  res.cookie('token', token, {
    httpOnly: true,
    expires: new Date(Date.now() + expirationTime),
    secure: process.env.NODE_ENV === 'production',
  });
};

export default attachCookie;
