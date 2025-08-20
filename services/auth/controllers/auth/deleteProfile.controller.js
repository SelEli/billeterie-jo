const { success, error } = require('../../utils/response');
const { deleteProfileService } = require('../../services/auth');

const deleteProfileController = async (req, res) => {
  try {
    const deleted = await deleteProfileService(req.user.userId);

    if (!deleted) {
      return res.status(404).json(error(['Profile not found.']));
    }

    return res.status(204).json(success(null));
  } catch (err) {
    return res.status(500).json(error(['Internal server error.']));
  }
};

module.exports = { deleteProfileController };
