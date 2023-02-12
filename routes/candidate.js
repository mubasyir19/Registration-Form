const express = require("express");
const router = express.Router();

const { upload } = require("../middleware/multer");
const candidateController = require("../app/Candidate/controller");

// Candidate
router.get("/", candidateController.viewForm);
router.post("/", upload, candidateController.actionRegist);
router.get("/success", candidateController.viewSuccessSubmit);
router.get("/close", candidateController.viewCloseForm);

module.exports = router;
