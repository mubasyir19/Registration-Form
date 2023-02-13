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
router.get("/dashboard", isLoginAdmin, adminController.viewDashboard);
router.get("/reportCandidate", isLoginAdmin, adminController.exportData);
router.get("/candidate", isLoginAdmin, adminController.viewCandidate);
router.get("/candidate/detail/:id", isLoginAdmin, adminController.viewDetailCandidate);
router.get("/pdf", isLoginAdmin, adminController.viewFile);
router.delete("/candidate/delete", isLoginAdmin, adminController.actionDelete);

module.exports = router;
