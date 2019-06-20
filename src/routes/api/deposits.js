import express from "express";

import depositController from "../../controllers/depositController"; // import controller

import auth from "../../middleware/check-auth";

const router = express.Router();

// basic route deposits api
router.get("/", depositController.depositIndex);

// post route deposits api
router.post("/", auth.checkAuth, depositController.depositCreate);

// show selected deposits api
router.get("/:depositId", depositController.depositFindOne);

// update selected deposits api
router.patch("/:depositId", auth.checkAuth, depositController.depositUpdate);

// delete selected deposits api
router.delete("/:depositId", auth.checkAuth, depositController.depositDelete);

export default router;
