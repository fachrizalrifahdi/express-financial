import express from "express";

import bankController from "../../controllers/bankController"; // import controller

import auth from "../../middleware/check-auth";

const router = express.Router();

// basic route banks api
router.get("/", bankController.bankIndex);

// post route banks api
router.post("/", auth.checkAuth, bankController.bankCreate);

// show selected banks api
router.get("/:bankId", bankController.bankFindOne);

// update selected banks api
router.patch("/:bankId", auth.checkAuth, bankController.bankUpdate);

// delete selected banks api
router.delete("/:bankId", auth.checkAuth, bankController.bankDelete);

export default router;
