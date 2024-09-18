const express = require("express");
const authRouter = express.Router();
const User = require("../models/User");
const { validateSignupData } = require("../utils/validation");
const bcrypt = require("bcrypt");

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignupData(req);

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    req.body.password = passwordHash;

    const user = new User(req.body);
    await user.save();
    res.status(200).json("success");
  } catch (err) {
    res.status(400).json(err.message);
  }
});

authRouter.get("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });

    if (!user) {
      res.send("User not found").status(404);
    }

    const isPassMatch = await user.verifyPassword(password);

    if (!isPassMatch) {
      res.send("Password not match").status(401);
    } else {
      const token = await user.getJWT();

      res.cookie("token", token, {
        httpOnly: true,
        maxAge: 24 * 7 * 60 * 60 * 1000,
      });

      const userObj = Object.assign({}, user._doc);
      userObj.token = token;
      res.send(userObj).status(200);
    }
  } catch (err) {
    throw new Error(err.message);
  }
});

module.exports = authRouter;
