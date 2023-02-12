const mongoose = require("mongoose");

let candidateSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    npm: {
      type: String,
      required: true,
    },
    kelas: {
      type: String,
      required: true,
    },
    jurusan: {
      type: String,
      required: true,
    },
    region: {
      type: String,
      required: true,
    },
    photo: {
      type: String,
    },
    krs: {
      type: String,
    },
    ktp: {
      type: String,
    },
    ktm: {
      type: String,
    },
    nilai: {
      type: String,
    },
    cv: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Candidate", candidateSchema);
