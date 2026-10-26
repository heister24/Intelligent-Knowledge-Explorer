import redis from "../../shared/redis/redis.js";

const authMiddleware = async (req, res, next) => {
  try {
    const sessionId = req.cookies?.sessionId;
    if (!sessionId) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: No session ID found in cookies",
      });
    }

    const data = await redis.get(`sessionId-${sessionId}`);
    if (!data) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Session has expired or is invalid",
      });
    }

    let parsedUser;
    try {
      parsedUser = JSON.parse(data);
    } catch (parseError) {
      return res.status(500).json({
        success: false,
        message: "Failed to parse session data",
        error: parseError.message,
      });
    }

    req.user = parsedUser;
    next();
  } catch (error) {
    console.error(`Error At AuthMiddleware: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: "Internal server error during authentication",
      error: error.message,
    });
  }
};

export default authMiddleware;
