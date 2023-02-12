const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const maxSize = 1000000; // File limit 1 MB

const upload = multer({
  storage: storage,
  limits: { fileSize: maxSize },
}).fields([{ name: "photo" }, { name: "cv" }, { name: "krs" }, { name: "nilai" }, { name: "ktp" }, { name: "ktm" }]);

module.exports = { upload };
