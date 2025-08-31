import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import message from './message.js';
import config from '../config/config.js';

const helper = {
  matchPassword: async (plainPassword, hashedPassword) => {
    if (!plainPassword || !hashedPassword) return false;
    return await bcrypt.compare(plainPassword, hashedPassword);
  },

  hashvalue: (value) => {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(value, salt);
    return hash;
  },

  isHashed: (stringToCheck) => {
    return typeof stringToCheck === 'string' && /^\$2[aby]?\$\d{2}\$/.test(stringToCheck);
  },

  generateToken: (payload) => {
    return jwt.sign(payload, config.jwt.secret, {
      expiresIn: config.jwt.expiry || '1d',
    });
  },

  decodeToken: (token) => {
    if (!token) {
      throw new Error('No token provided');
    }

    try {
      const decoded = jwt.verify(token, config.jwt.secret);
      console.log('🚀 ~ decoded:', decoded);
      return decoded;
    } catch (err) {
      console.log('🚀 ~ decodeToken ~ err:', err);
      return message[err.message] || err.message;
    }
  },
};

export default helper;
