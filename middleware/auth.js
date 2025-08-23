import helper from '../utils/helper.js';
import message from '../utils/message.js';

const auth = (roles) => {
  return (req, res, next) => {
    const token = req.headers.authorization?.split(' ')?.[1];

    if (!token) res.status(401).send(message.TOKEN_NOT_PROVIDED);

    const decoded = helper.decodeToken(token);
    if (typeof decoded == 'string') res.status(401).send(decoded);

    if (roles[0] !== '*' && !roles.includes(decoded.role)) {
      res.status(403).send(message.UNAUTHORIZED);
    }

    req.user = decoded;

    next();
  };
};

export default auth;
