const Candidate = require("../models/candidate");
const path = require("path");

module.exports = {
  viewForm: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      res.render("daftar/form", {
        alert,
      });
    } catch (error) {
      // Response Error
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/registrasi");
      console.log(error);
    }
  },
  viewSuccessSubmit: async (req, res) => {
    try {
      res.render("daftar/success_submit");
    } catch (error) {
      // Response Error
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/registrasi/success");
      console.log(error);
    }
  },
  actionRegist: async (req, res) => {
    // Checking File
    // console.log("Files => ", req.files);
    // console.log("File Photo => ", req.files.photo[0].filename);
    // console.log("File CV => ", req.files.cv[0].filename);
    // console.log("File KRS => ", req.files.krs[0].filename);
    // console.log("File Nilai => ", req.files.nilai[0].filename);
    try {
      // const result = await Candidate.create({
      await Candidate.create({
        nama: req.body.nama,
        npm: req.body.npm,
        kelas: req.body.kelas,
        jurusan: req.body.jurusan,
        region: req.body.region,
        photo: `${req.files.photo[0].filename}`,
        krs: `${req.files.krs[0].filename}`,
        ktp: `${req.files.ktp[0].filename}`,
        ktm: `${req.files.ktm[0].filename}`,
        nilai: `${req.files.nilai[0].filename}`,
        cv: `${req.files.cv[0].filename}`,
      });
      res.redirect("/registrasi/success");
      // console.log(result);

      /* Format Result in JSON */
      // console.log("Hasil ==>", result);
      // res.status(201).json({
      //   message: "Berhasil registrasi",
      //   data: result,
      // });
    } catch (error) {
      // Response Error
      if (error.message === `Cannot read properties of undefined (reading '0')`) {
        req.flash("alertMessage", `Lengkapi data Anda sebelum submit`);
      }
      if (error instanceof multer.MulterError) {
        if (error.code === "LIMIT_FILE_SIZE") {
          req.flash("alertMessage", `File size is too large. Please upload a file with a size less than 1 MB.`);
          // return res
          //   .status(400)
          //   .json({ error: "File size is too large. Please upload a file with a size less than 1 MB." });
        }
      }
      req.flash("alertStatus", "danger");
      res.redirect("/registrasi");
      console.log(error);
    }
  },
  viewCloseForm: async (req, res) => {
    try {
      res.render("daftar/close_form");
    } catch (error) {
      // Response Error
      console.log(error);
    }
  },
};
