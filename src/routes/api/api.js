import express from "express";

const router = express.Router();

// route index api
router.get("/", (req, res, next) => {
  res.json({
    message: "API is running"
  });
});

export default router;
