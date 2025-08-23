import { Op } from 'sequelize';
import db from '../models/index.js';
import helper from '../utils/helper.js';
import message from '../utils/message.js';

const userRepository = {
  getAllUsers: async (req) => {
    const { page = 1, limit = 10, email, ...where } = req.query;
    const users = await db.User.findAndCountAll({
      where: {
        ...where,
        ...(email && {
          email: {
            [Op.like]: `%${email}%`,
          },
        }),
      },
      limit,
      offset: (page - 1) * limit,
    });
    return users;
  },

  getUserById: async (id) => {
    const user = await db.User.findByPk(id);
    return user;
  },

  registerUser: async (body) => {
    const user = await db.User.create(body);
    return user;
  },

  loginUser: async (body) => {
    const user = await db.User.findOne({
      where: {
        email: body.email,
      },
      raw: true,
      nest: true,
    });

    if (!user) {
      throw new Error(message.USER_NOT_FOUND);
    }

    const passwordmatched = await helper.matchPassword(body.password, user.password);
    if (!passwordmatched) {
      throw new Error(message.EMAIL_OR_PASSWORD_NOT_MATCH);
    }

    delete user.password;
    user.token = helper.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return user;
  },

  updateUser: async (id, body) => {
    const user = await db.User.update(body, {
      where: { id },
    });
    return user;
  },
};

export default userRepository;
