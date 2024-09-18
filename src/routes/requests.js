const express = require("express");
const requestRouter = express.Router();
const { userAuth } = require("../middleware/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const User = require("../models/User");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;

      const toUserId = req.params.toUserId;

      const status = req.params.status;

      const toUser = await User.findById(toUserId).lean().exec();

      if (!toUser) {
        return res.status(404).send({ message: "User not found!" });
      }

      //If there already connection request
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId, toUserId },
          { fromUserId: toUserId, toUserId: fromUserId },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request already exist!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      return res
        .status(200)
        .send({ message: "connection request sent.", data: data });
    } catch (err) {
      res.status(400).send(err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loogedInUser = req.user;

      const { status, requestId } = req.params;

      const allowedStatus = ["accepted", "rejected"];

      if (!allowedStatus.includes(status)) {
        return res.status(400).send({ message: "Status not allowed" });
      }

      const connectionRequests = await ConnectionRequest.findOne({
        toUserId: loogedInUser._id,
        status: "interested",
        _id: requestId,
      });

      if (!connectionRequests) {
        return res
          .status(404)
          .send({ message: "Connection request not found!" });
      }

      connectionRequests.status = status;

      const data = await connectionRequests.save();

      return res.send(data);
    } catch (error) {
      res.status(400).send(error.message);
    }
  }
);

module.exports = requestRouter;
