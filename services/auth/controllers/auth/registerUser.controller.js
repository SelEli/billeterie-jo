// controllers/registerUser.controller.js
const { success, error } = require('../../utils/response');
const { registerUserService } = require('../../services/auth');

const registerUserController = async (req, res) => {
  try {
    const result = await register(req.body);

    if (!result) {
      return res.status(409).json(error(['Email already registered.']));
    }

    return res.status(201).json(success(result));
  } catch (err) {
    return res.status(400).json(error(['Registration failed.']));
  }
};

module.exports = { registerUserController };
