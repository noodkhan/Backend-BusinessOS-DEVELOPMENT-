const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      trim: true
    },

    reportType: {
      type: String,
      enum: ["daily", "weekly", "monthly", "yearly", "custom"],
      required: true
    },

    startDate: {
      type: Date,
      required: true
    },

    endDate: {
      type: Date,
      required: true
    },

    title: {
      type: String,
      required: true,
      trim: true
    },

    description: {
      type: String,
      default: ""
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Report", reportSchema);