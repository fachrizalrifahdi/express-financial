import Account from "../models/Account"; //import Account model
import jwt from "jsonwebtoken";

// Index account
const accountIndex = (req, res, next) => {
  Account.find()
    .populate("user", "role email phone userName firstName lastName")
    .select("_id country accountImage")
    .exec()
    .then(accounts => {
      res.status(200).send({
        data: accounts,
        result_count: accounts.length
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

// Create account
const accountCreate = (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_KEY);
  req.userData = decoded;
  // Create a user profile
  const account = new Account({
    user: decoded.userId,
    address: req.body.address,
    country: req.body.country,
    accountImage: req.file.path
  });

  // Save account in the database
  account
    .save()
    .then(data => {
      res.status(200).send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the account."
      });
    });
};

// Find account only one data
const accountFindOne = (req, res, next) => {
  Account.findById(req.params.account6DataId)
    .populate("user", "role email phone userName firstName lastName")
    .select("_id age contact address city userProfileImage")
    .exec()
    .then(account => {
      if (!account) {
        return res.status(404).send({
          message: "Account Data not found with id " + req.params.accountId
        });
      }
      res.status(200).send(account);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Account Data not found with id " + req.params.accountId
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with id " + req.params.accountId
      });
    });
};

// Update account
const accountUpdate = (req, res, next) => {
  // Find account and update it with the request body
  Account.findByIdAndUpdate(
    req.params.accountId,
    {
      $set: req.body || req.file.path
    },
    {
      new: true
    }
  )
    .then(account => {
      if (!account) {
        return res.status(404).send({
          message: "Account not found with id " + req.params.accountId
        });
      }
      res.status(200).send(account);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "Account not found with id " + req.params.accountId
        });
      }
      return res.status(500).send({
        message: "Error updating Account with id " + req.params.accountId
      });
    });
};

// Delete account
const accountDelete = (req, res, next) => {
  Account.findByIdAndRemove(req.params.accountId)
    .then(account => {
      if (!account) {
        return res.status(404).send({
          message: "Account Data not found with id " + req.params.accountId
        });
      }
      res.status(200).send({
        message: "Account Data deleted successfully!"
      });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "Account Data not found with id " + req.params.accountId
        });
      }
      return res.status(500).send({
        message: "Could not delete Account Data with id " + req.params.accountId
      });
    });
};

// export all function
export default {
  accountIndex,
  accountCreate,
  accountFindOne,
  accountUpdate,
  accountDelete
};
