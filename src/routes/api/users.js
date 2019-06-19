import express from "express";

import userController from "../../controllers/userController"; // import controller

import auth from "../../middleware/check-auth";

const router = express.Router();

// basic route users api
router.get("/", userController.userIndex);

// find user route users api
router.get("/user", userController.userFindUserIndex);

// find admin route users api
router.get("/admin", auth.checkAuth, userController.userFindAdminIndex);

// post route users api
router.post("/", userController.userCreate);

// user login for users api
router.post("/login", userController.userLogin);

// user logout for users api
router.get("/logout", userController.userLogout);

// show selected users api
router.get("/:userId", userController.userFindOne);

// update selected users api
router.patch("/:userId", auth.checkAuth, userController.userUpdate);

// delete selected users api
router.delete("/:userId", auth.checkAuth, userController.userDelete);

export default router;
