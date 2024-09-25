const mongoose = require("mongoose");

const StatusSchema = new mongoose.Schema({
  statusName: {
    type: String,
    required: [true, "Please provide status"],
    maxlength: 50,
    unique: true,
  },
  statusCode: {
    type: String,
    required: [true, "Please provide status code"],
    maxlength: 50,
    unique: true,
  },
});

const Status = mongoose.model("Status", StatusSchema);

module.exports = Status;
