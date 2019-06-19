import express from "express";

import depositController from "../../controllers/depositController"; // import controller

import auth from "../../middlewares/check-auth";

const router = express.Router();

// basic route deposits api
router.get("/", depositController.depositIndex);

// post route deposits api
router.post("/", auth.checkAuth, depositController.depositCreate);

// show selected deposits api
router.get("/:depositDataId", depositController.depositFindOne);

// update selected deposits api
router.patch(
  "/:depositDataId",
  auth.checkAuth,
  depositController.depositUpdate
);

// delete selected deposits api
router.delete(
  "/:depositDataId",
  auth.checkAuth,
  depositController.depositDelete
);

export default router;
