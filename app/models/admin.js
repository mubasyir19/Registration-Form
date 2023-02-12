const mongoose = require("mongoose");

let adminSchema = new mongoose.Schema(
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
    region: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Aktif", "Non-aktif"],
      default: "Aktif",
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
