const Admin = require("../models/admin");
const Candidate = require("../models/candidate");
const bcrypt = require("bcryptjs");
const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");
const PDFtable = require("pdfkit-table");

module.exports = {
  // Registration
  registerAdmin: async (req, res) => {
    try {
      const { nama, npm, kelas, region, username, password } = req.body;

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const result = await Admin.create({
        nama,
        npm,
        kelas,
        region,
        username,
        password: hash,
      });

      res.json({
        message: "success add admin",
        data: result,
      });
    } catch (error) {
      console.log(error);
    }
  },

  // Authentication
  viewSignin: async (req, res) => {
    try {
      res.render("admin/signin/view_signin");
    } catch (error) {
      console.log(error);
    }
  },
  actionSignin: async (req, res) => {
    try {
      const { username, password } = req.body;
      // Get data Admin base on username
      const checkAdmin = await Admin.findOne({ username: username });

      // Check username
      if (checkAdmin) {
        // Check status
        if (checkAdmin.status === "Aktif") {
          // Comparing password from body and password in database
          const checkPassword = await bcrypt.compare(password, checkAdmin.password);
          // Check password
          if (checkPassword) {
            // Send session data Admin
            req.session.admin = {
              id: checkAdmin._id,
              nama: checkAdmin.nama,
              npm: checkAdmin.npm,
              kelas: checkAdmin.kelas,
              region: checkAdmin.region,
              status: checkAdmin.status,
              username: checkAdmin.username,
            };

            // Response Success
            res.redirect("/admin/dashboard");
          } else {
            // Response Error password
            req.flash("alertMessage", "Password yang Anda inputkan salah");
            req.flash("alertStatus", "danger");
            res.redirect("/");
          }
        } else {
          // Response Error status
          req.flash("alertMessage", "Mohon maaf status Anda Non-Aktif");
          req.flash("alertStatus", "danger");
          res.redirect("/");
        }
      } else {
        // Response Error username
        req.flash("alertMessage", "Username yang Anda inputkan salah");
        req.flash("alertStatus", "danger");
        res.redirect("/admin");
      }
    } catch (error) {
      // Resopnse Error
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin");
    }
  },
  actionLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin");
  },

  // Dashboard
  viewDashboard: async (req, res) => {
    try {
      const candidate = await Candidate.countDocuments();
      res.render("admin/dashboard/dashboard", {
        candidate,
      });
    } catch (error) {
      console.log(error);
    }
  },

  // Candidate
  viewCandidate: async (req, res) => {
    try {
      const alertMessage = req.flash("alertMessage");
      const alertStatus = req.flash("alertStatus");
      const alert = { message: alertMessage, status: alertStatus };

      // Get data Candidate
      const candidate = await Candidate.find();

      res.render("admin/candidate/view_candidate", {
        alert,
        candidate,
      });
    } catch (error) {
      // Response Error
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/dashboard");
      console.log(error);
    }
  },
  exportData: async (req, res) => {
    try {
      res.setHeader("Content-Disposition", 'attachment; filename="Report Data Candidate.pdf"');

      const candidate = await Candidate.find();

      const doc = new PDFtable();

      for (let i = 0; i < candidate.length; i++) {
        const table = {
          title: {
            options: { align: "center" },
            label: "Daftar Calon Programmer Laboratorium Psikologi Gunadarma PTA 2023/2024",
            fontSize: 15,
          },
          headers: [
            { label: "No", property: "no" },
            { label: "Nama", property: "nama" },
            { label: "NPM", property: "npm" },
            { label: "Kelas", property: "kelas" },
            { label: "Jurusan", property: "jurusan" },
            { label: "Region", property: "region" },
          ],
          datas: [
            {
              no: i + 1,
              nama: candidate[i].nama,
              npm: candidate[i].npm,
              npm: candidate[i].npm,
              kelas: candidate[i].kelas,
              jurusan: candidate[i].jurusan,
              region: candidate[i].region,
            },
          ],
        };
        doc.table(table, {
          prepareHeader: () => doc.font("Helvetica-Bold").fontSize(12),
          prepareRow: (row, i) => doc.font("Helvetica").fontSize(12),
        });
      }

      // Menulis dokumen ke respon
      doc.pipe(res);
      doc.end();
    } catch (error) {
      console.log(error);
    }
  },
  viewDetailCandidate: async (req, res) => {
    try {
      // Get id from params
      const { id } = req.params;

      // get Data candidate base on id
      const candidate = await Candidate.findOne({ _id: id });
      // console.log("Data ==> ", candidate);

      res.render("admin/candidate/detail_candidate", {
        candidate,
      });
    } catch (error) {
      console.log(error);
    }
  },
  viewFile: async (req, res) => {
    try {
      const filename = req.query.file;
      const filePath = __dirname + "/../../public/uploads/" + filename;

      fs.readFile(filePath, (err, data) => {
        if (err) {
          return res.status(500).send(err);
        }

        // Set tipe konten sebagai PDF
        res.contentType("application/pdf");

        // Kirim buffer PDF sebagai respon
        res.send(data);
      });
    } catch (error) {
      console.log(error);
    }
  },
  actionDelete: async (req, res) => {
    try {
      const { id } = req.body;

      const candidate = await Candidate.findOne({ _id: id });

      // Hold Files
      let fileToDelete = [
        `public/uploads/${candidate.photo}`,
        `public/uploads/${candidate.cv}`,
        `public/uploads/${candidate.krs}`,
        `public/uploads/${candidate.ktp}`,
        `public/uploads/${candidate.ktm}`,
        `public/uploads/${candidate.nilai}`,
        ,
      ];

      // Remove file from folder
      fileToDelete.forEach((file) => {
        fs.unlink(file, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      });

      // Delete data from database
      await candidate.remove();

      // Response Success
      req.flash("alertMessage", "Berhasil hapus Candidate");
      req.flash("alertStatus", "success");
      res.redirect("/admin/candidate");
    } catch (error) {
      // Response Error
      req.flash("alertMessage", `${error.message}`);
      req.flash("alertStatus", "danger");
      res.redirect("/admin/candidate");
      console.log(error);
    }
  },
};
