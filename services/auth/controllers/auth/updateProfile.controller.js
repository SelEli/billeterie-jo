// controllers/updateProfile.controller.js
const { success, error } = require('../../utils/response');
const { updateProfileService } = require('../../services/auth');

const updateProfileController = async (req, res) => {
  try {
    const updated = await updateProfile(req.user.userId, req.body);

    if (!updated) {
      return res.status(404).json(error(['Profile not found.']));
    }

    return res.status(200).json(success(updated));
  } catch (err) {
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { updateProfileController };
