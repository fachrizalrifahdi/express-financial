import Deposit from "../models/Deposit"; //import report model
import jwt from "jsonwebtoken";

// Index deposit
const depositIndex = (req, res, next) => {
  Deposit.find()
    .populate("user", "role email phone userName firstName lastName")
    .select("_id deposit")
    .exec()
    .then(deposits => {
      res.status(200).send({
        data: deposits,
        result_count: deposits.length
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving deposits."
      });
    });
};

// Create deposit
const depositCreate = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
  // Create a deposit
  const deposit = new Deposit({
    user: decoded.userId,
    deposit: req.body.deposit
  });

  // Save Deposit in the database
  deposit
    .save()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the deposit."
      });
    });
};

// Find Deposit only one data
const depositFindOne = (req, res, next) => {
  Deposit.findById(req.params.depositId)
    .select("_id deposit")
    .exec()
    .then(deposit => {
      if (!deposit) {
        return res.status(404).send({
          message: "deposit not found with id " + req.params.depositId
        });
      }
      res.status(200).send(deposit);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "deposit not found with id " + req.params.depositId
        });
      }
      return res.status(500).send({
        message: "Error retrieving deposit with id " + req.params.depositId
      });
    });
};

// Update Deposit
const depositUpdate = (req, res, next) => {
  // Find deposit and update it with the request body
  Deposit.findByIdAndUpdate(
    req.params.depositId,
    {
      $set: req.body
    },
    {
      new: true
    }
  )
    .then(deposit => {
      if (!deposit) {
        return res.status(404).send({
          message: "deposit not found with id " + req.params.depositId
        });
      }
      res.status(200).send(deposit);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "deposit not found with id " + req.params.depositId
        });
      }
      return res.status(500).send({
        message: "Error updating deposit with id " + req.params.depositId
      });
    });
};

// Delete Deposit
const depositDelete = (req, res, next) => {
  Deposit.findByIdAndRemove(req.params.depositId)
    .then(deposit => {
      if (!deposit) {
        return res.status(404).send({
          message: "Deposit not found with id " + req.params.depositId
        });
      }
      res.status(200).send({
        message: "Deposit deleted successfully!"
      });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Deposit not found with id " + req.params.depositId
        });
      }
      return res.status(500).send({
        message: "Could not delete deposit with id " + req.params.depositId
      });
    });
};

// export all function
export default {
  depositIndex,
  depositCreate,
  depositFindOne,
  depositUpdate,
  depositDelete
};
