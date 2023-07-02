import { UnauthenticatedError } from '../errors/index.js';

const checkPermissions = (reqUser, resourceUserId) => {
  // potential admin check if I decide to add admin status later
  // if (reqUser.role === 'admin') return;
  if (reqUser.userId === resourceUserId.toString()) return;
  throw new UnauthenticatedError('Not authorized to access this route');
};

export default checkPermissions;
