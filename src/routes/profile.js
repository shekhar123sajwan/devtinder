const express = require("express");
const profileRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const bcrypt = require("bcrypt");
const {
  validateEditProfileData,
  validateForgotPasswordData,
} = require("../utils/validation");
const User = require("../models/User");

profileRouter.get("/view", userAuth, async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request!");
    }

    const loggedInUser = req.user;

    Object.keys(req.body).forEach((key) => {
      loggedInUser[key] = req.body[key];
    });

    await loggedInUser.save();

    res.send(loggedInUser);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

profileRouter.patch("/forgot-password", userAuth, async (req, res) => {
  try {
    if (!validateForgotPasswordData(req)) {
      throw new Error("Invalid Password Change Request!");
    }

    if (req.body.password !== req.body.confirmPassword) {
      throw new Error("Passwords does not match!");
    }

    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const user = req.user;

    user.password = passwordHash;

    await user.save();

    return res.status(200).send({ message: "Password Change", data: user });
  } catch (err) {
    res.status(400).send(err.message);
  }
});
module.exports = profileRouter;
