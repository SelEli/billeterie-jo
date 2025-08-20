const { success, error } = require('../../utils/response');
const { getProfileService } = require('../../services/auth');

const getProfileController = async (req, res) => {
  try {
    const user = await getProfileService(req.user.userId);

    if (!user) {
      return res.status(404).json(error(['Profile not found.']));
    }

    return res.status(200).json(success(user));
  } catch (err) {
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { getProfileController };
