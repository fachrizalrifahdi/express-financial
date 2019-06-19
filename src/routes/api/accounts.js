import express from "express";

import accountController from "../../controllers/accountController"; // import controller

import multer from "multer";

import auth from "../../middlewares/check-auth";

// method storage image to folder uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./uploads");
  },
  filename: (req, file, cb) => {
    console.log("file", file);
    cb(null, new Date().toISOString().replace(/:/g, "-") + file.originalname);
  }
});

// filtering image
const fileFilter = (req, file, cb) => {
  // reject a file
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// filter and limiting file size
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const router = express.Router();

// basic route user profiles api
router.get("/", accountController.accountIndex);

// post route add middleware uploadimage for user profiles api
router.post(
  "/",
  auth.checkAuth,
  upload.single("accountImage"),
  accountController.accountCreate
);

// show selected user profiles api
router.get("/:accountDataId", accountController.accountFindOne);

// update selected user profiles api
router.patch(
  "/:accountDataId",
  auth.checkAuth,
  accountController.accountUpdate
);

// delete selected user profiles api
router.delete(
  "/:accountDataId",
  auth.checkAuth,
  accountController.accountDelete
);

export default router;
