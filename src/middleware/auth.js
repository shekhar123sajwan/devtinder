const jwt = require("jsonwebtoken");
const User = require("../models/User");

const userAuth = async (req, res, next) => {
  const { token } = req.cookies;

  try {
    const decodedObj = await jwt.verify(token, "devtinder");

    if (!decodedObj) {
      throw new Error("Something went wrong!");
    }

    const user = await User.findOne({ email: decodedObj?.user?.email })
      .lean()
      .exec();

    if (!user) {
      throw new Error("Something went wrong!");
    }

    req.user = user;
    next();
  } catch (err) {
    res.status(400).send(err.message);
  }
};

module.exports = {
  userAuth,
};
