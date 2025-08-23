import repositories from '../repositories/index.js';

const userService = {
  getAllUsers: async (req) => {
    const users = await repositories.user.getAllUsers(req);
    return users;
  },

  getUserProfile: async (req) => {
    const { id } = req.user;
    const user = await repositories.user.getUserById(id);
    delete user.dataValues.password;
    return user;
  },

  getUserById: async (req) => {
    const { id } = req.params;
    const user = await repositories.user.getUserById(id);
    delete user.dataValues.password;
    return user;
  },

  registerUser: async (req) => {
    const { body } = req;
    const user = await repositories.user.registerUser(body);
    return user;
  },

  loginUser: async (req) => {
    const { body } = req;
    const user = await repositories.user.loginUser(body);
    return user;
  },
};

export default userService;
