const express = require("express");
const profileRouter = express.Router();

const { userAuth } = require("../middleware/auth");
profileRouter.get("/", userAuth, async (req, res) => {
  try {
    const user = req.user;

    return res.status(200).send(user);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = profileRouter;
