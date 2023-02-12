const express = require("express");
const router = express.Router();

const adminController = require("../app/Admin/controller");

const { isLoginAdmin } = require("../middleware/auth");

// Router Registration
router.post("/registAdmin", adminController.registerAdmin);

// Router Authentication
router.get("/", adminController.viewSignin);
router.post("/", adminController.actionSignin);
router.get("/logout", adminController.actionLogout);

// Router Page
router.get("/dashboard", adminController.viewDashboard);
router.get("/reportCandidate", adminController.exportData);
router.get("/candidate", adminController.viewCandidate);
router.get("/candidate/detail/:id", adminController.viewDetailCandidate);
router.get("/pdf", adminController.viewFile);
router.delete("/candidate/delete", adminController.actionDelete);

module.exports = router;
