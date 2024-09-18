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

userRouter.get("/feed", userAuth, async (req, res) => {
  let { page, limit } = req.query;
  limit = limit > 50 ? 10 : limit;
  page = (page - 1) * limit;

  try {
    const loggedInUser = req.user;

    const connectionRequest = await ConnectionRequest.find({
      $or: [
        {
          toUserId: loggedInUser._id,
        },
        {
          fromUserId: loggedInUser._id,
        },
      ],
    })
      .populate({ path: "toUserId", select: "_id" })
      .populate({
        path: "fromUserId",
        select: "_id",
      });

    let hideUsersSet = new Set();
    connectionRequest.forEach((user) => {
      hideUsersSet.add(user.fromUserId?._id?.toString());
      hideUsersSet.add(user.toUserId?._id?.toString());
    });
    const feedUsers = await User.find({
      $and: [
        { _id: { $nin: Array.from(hideUsersSet) } },
        { _id: { $ne: loggedInUser._id } },
      ],
    })
      .select("firstName lastName about skills")
      .limit(limit)
      .skip(page);

    res.send(feedUsers);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = userRouter;
