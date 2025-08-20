// controllers/auth/loginUser.controller.js
const { success, error } = require('../../utils/response');
const { loginService } = require('../../services/auth');

const loginController = async (req, res) => {
  try {
    const result = await loginService(req.body);

    if (!result) {
      return res.status(401).json(error(['Invalid credentials.']));
    }

    return res.status(200).json(success(result));
  } catch (err) {
    return res.status(400).json(error(['Login failed.']));
  }
};

module.exports = { loginController };
