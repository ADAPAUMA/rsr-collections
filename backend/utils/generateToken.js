import jwt from 'jsonwebtoken';

const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '30d',
  });

  // Since it's an API, we can either return the token or set it in a cookie.
  // For standard MERN, we might just return the token if using local storage,
  // but let's return it to the client.
  return token;
};

export default generateToken;
