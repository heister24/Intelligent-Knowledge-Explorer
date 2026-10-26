export const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found in session",
      });
    }

    return res.status(200).json({
      success: true,
      user: req.user,
    });
  } catch (error) {
    console.error(`Error in getMe controller: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error while retrieving user profile",
      error: error.message,
    });
  }
};
