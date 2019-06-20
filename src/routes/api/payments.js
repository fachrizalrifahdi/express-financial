import express from "express";

import paymentController from "../../controllers/paymentController"; // import controller

import auth from "../../middleware/check-auth";

const router = express.Router();

// basic route payments api
router.get("/", paymentController.paymentIndex);

// post route payments api
router.post("/", auth.checkAuth, paymentController.paymentCreate);

// show selected payments api
router.get("/:paymentId", paymentController.paymentFindOne);

// update selected payments api
router.patch("/:paymentId", auth.checkAuth, paymentController.paymentUpdate);

// delete selected payments api
router.delete("/:paymentId", auth.checkAuth, paymentController.paymentDelete);

export default router;
