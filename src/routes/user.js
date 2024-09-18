const express = require("express");
const { userAuth } = require("../middleware/auth");
const User = require("../models/User");
const ConnectionRequest = require("../models/ConnectionRequest");
const userRouter = express.Router();

userRouter.get("/requests", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      status: "interested",
      toUserId: loggedInUser._id,
    }).populate({
      path: "fromUserId",
      select: "firstName lastName -_id",
    });

    res.send({
      message: "success",
      data: connectionRequests,
    });
  } catch (error) {
    res.status(400).send(error.message);
  }
});

userRouter.get("/connection", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
          status: "accepted",
        },
        {
          fromUserId: loggedInUser._id,
          status: "accepted",
        },
      ],
    })
      .populate({ path: "fromUserId", select: "firstName lastName _id" })
      .populate({ path: "toUserId", select: "firstName lastName _id" });

    const userConnections = connectionRequests.map((requests) => {
      if (requests.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return requests.toUserId;
      }
      return requests.fromUserId;
    });

    res.send(userConnections);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
