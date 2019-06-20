import Payment from "../models/payment"; //import report model
import jwt from "jsonwebtoken";

// Index payment
const paymentIndex = (req, res, next) => {
  Payment.find()
    .populate("user", "role email phone userName firstName lastName")
    .select("_id paymentChannel")
    .exec()
    .then(payments => {
      res.status(200).send({
        data: payments,
        result_count: payments.length
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving payments."
      });
    });
};

// Create payment
const paymentCreate = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
  // Create a payment
  const payment = new Payment({
    user: decoded.userId,
    paymentChannel: req.body.paymentChannel
  });

  // Save payment in the database
  payment
    .save()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the payment."
      });
    });
};

// Find payment only one data
const paymentFindOne = (req, res, next) => {
  payment
    .findById(req.params.paymentId)
    .select("_id paymentChannel")
    .exec()
    .then(payment => {
      if (!payment) {
        return res.status(404).send({
          message: "payment not found with id " + req.params.paymentId
        });
      }
      res.status(200).send(payment);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "payment not found with id " + req.params.paymentId
        });
      }
      return res.status(500).send({
        message: "Error retrieving payment with id " + req.params.paymentId
      });
    });
};

// Update payment
const paymentUpdate = (req, res, next) => {
  // Find payment and update it with the request body
  payment
    .findByIdAndUpdate(
      req.params.paymentId,
      {
        $set: req.body
      },
      {
        new: true
      }
    )
    .then(payment => {
      if (!payment) {
        return res.status(404).send({
          message: "Payment not found with id " + req.params.paymentId
        });
      }
      res.status(200).send(payment);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Payment not found with id " + req.params.paymentId
        });
      }
      return res.status(500).send({
        message: "Error updating payment with id " + req.params.paymentId
      });
    });
};

// Delete payment
const paymentDelete = (req, res, next) => {
  payment
    .findByIdAndRemove(req.params.paymentId)
    .then(payment => {
      if (!payment) {
        return res.status(404).send({
          message: "Payment not found with id " + req.params.paymentId
        });
      }
      res.status(200).send({
        message: "Payment deleted successfully!"
      });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Payment not found with id " + req.params.paymentId
        });
      }
      return res.status(500).send({
        message: "Could not delete Payment with id " + req.params.paymentId
      });
    });
};

// export all function
export default {
  paymentIndex,
  paymentCreate,
  paymentFindOne,
  paymentUpdate,
  paymentDelete
};
