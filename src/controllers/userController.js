import User from "../models/User"; //import user model
import bcrypt from "bcrypt"; //import bcrypt for compare password
import jwt from "jsonwebtoken";

// Index user
const userIndex = (req, res, next) => {
  User.find({
    role: ["user", "partner"]
  })
    .select("_id email phone userName firstName lastName")
    .exec()
    .then(users => {
      res.status(200).send({
        data: users,
        result_count: users.length
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find only user
const userFindUserIndex = (req, res, next) => {
  User.find({
    role: "user"
  })
    .select("_id email phone userName firstName lastName")
    .exec()
    .then(users => {
      res.status(200).send({
        data: users,
        result_count: users.length
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find only partner
const userFindPartnerIndex = (req, res, next) => {
  User.find({
    role: "partner"
  })
    .select("_id email phone userName firstName lastName")
    .exec()
    .then(users => {
      res.status(200).send({
        data: users,
        result_count: users.length
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

// Find only admin
const userFindAdminIndex = (req, res, next) => {
  User.find({
    role: "admin"
  })
    .select("_id email phone userName firstName lastName")
    .exec()
    .then(users => {
      res.status(200).send({
        data: users,
        result_count: users.length
      });
    })
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while retrieving users."
      });
    });
};

// Create user
const userCreate = (req, res, next) => {
  // Create a user
  const user = new User({
    email: req.body.email,
    phone: req.body.phone,
    userName: req.body.userName,
    password: req.body.password,
    firstName: req.body.firstName,
    lastName: req.body.lastName
  });

  // Save User in the database
  user
    .save()
    .then(data => res.status(200).send(data))
    .catch(err => {
      res.status(500).send({
        message: err.message || "Some error occurred while creating the user."
      });
    });
};

// Find User only one data
const userFindOne = (req, res, next) => {
  User.findById(req.params.userId)
    .select("_id email phone userName firstName lastName")
    .exec()
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      res.status(200).send(user);
    })
    .catch(err => {
      if (err.kind === "ObjectId") {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        message: "Error retrieving user with id " + req.params.userId
      });
    });
};

// Update User
const userUpdate = (req, res, next) => {
  const password = req.body.password;

  bcrypt.hash(password, 10, function(err, hash) {
    if (err) {
      return next(err);
    }

    req.body.password = hash;
    // Find user and update it with the request body
    User.findByIdAndUpdate(
      req.params.userId,
      {
        $set: req.body
      },
      {
        new: true
      }
    )
      .then(user => {
        if (!user) {
          return res.status(404).send({
            message: "user not found with id " + req.params.userId
          });
        }
        res.status(200).send(user);
      })
      .catch(err => {
        if (err.kind === "ObjectId") {
          return res.status(404).send({
            message: "user not found with id " + req.params.userId
          });
        }
        return res.status(500).send({
          message: "Something wrong updating note with id " + req.params.userId
        });
      });
  });
};

// Delete User
const userDelete = (req, res, next) => {
  User.findByIdAndRemove(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      res.status(200).send({
        message: "user deleted successfully!"
      });
    })
    .catch(err => {
      if (err.kind === "ObjectId" || err.name === "NotFound") {
        return res.status(404).send({
          message: "user not found with id " + req.params.userId
        });
      }
      return res.status(500).send({
        message: "Could not delete user with id " + req.params.userId
      });
    });
};

const userLogin = (req, res, next) => {
  User.find({
    email: req.body.email
  })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(404).json({
          message: "Auth failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed"
          });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token
          });
        }
        res.status(401).json({
          message: "Auth failed"
        });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
};

const userLogout = (req, res) => {
  res.status(200).send({
    auth: false,
    token: null
  });
};

// export all function
export default {
  userIndex,
  userCreate,
  userFindOne,
  userUpdate,
  userDelete,
  userLogin,
  userLogout,
  userFindUserIndex,
  userFindPartnerIndex,
  userFindAdminIndex
};
