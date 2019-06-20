import Bank from "../models/Bank"; //import report model
import jwt from "jsonwebtoken";

// Index bank
const bankIndex = (req, res, next) => {
  Bank.find()
    .select("_id bankName bankCode state")
    .exec()
    .then(banks => {
      res.status(200).send({
        data: banks,
        result_count: banks.length
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving banks."
      });
    });
};

// Create bank
const bankCreate = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
  // Create a bank
  const bank = new Bank({
    user: decoded.userId,
    bankName: req.body.bankName,
    bankCode: req.body.bankCode
  });

  // Save Bank in the database
  bank
    .save()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the bank."
      });
    });
};

// Find Bank only one data
const bankFindOne = (req, res, next) => {
  Bank.findById(req.params.bankId)
    .select("_id bankName bankCode state")
    .exec()
    .then(bank => {
      if (!bank) {
        return res.status(404).send({
          message: "bank not found with id " + req.params.bankId
        });
      }
      res.status(200).send(bank);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "bank not found with id " + req.params.bankId
        });
      }
      return res.status(500).send({
        message: "Error retrieving bank with id " + req.params.bankId
      });
    });
};

// Update Bank
const bankUpdate = (req, res, next) => {
  // Find bank and update it with the request body
  Bank.findByIdAndUpdate(
    req.params.bankId,
    {
      $set: req.body
    },
    {
      new: true
    }
  )
    .then(bank => {
      if (!bank) {
        return res.status(404).send({
          message: "bank not found with id " + req.params.bankId
        });
      }
      res.status(200).send(bank);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "bank not found with id " + req.params.bankId
        });
      }
      return res.status(500).send({
        message: "Error updating bank with id " + req.params.bankId
      });
    });
};

// Delete Bank
const bankDelete = (req, res, next) => {
  Bank.findByIdAndRemove(req.params.bankId)
    .then(bank => {
      if (!bank) {
        return res.status(404).send({
          message: "Bank not found with id " + req.params.bankId
        });
      }
      res.status(200).send({
        message: "Bank deleted successfully!"
      });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Bank not found with id " + req.params.bankId
        });
      }
      return res.status(500).send({
        message: "Could not delete bank with id " + req.params.bankId
      });
    });
};

// export all function
export default {
  bankIndex,
  bankCreate,
  bankFindOne,
  bankUpdate,
  bankDelete
};
