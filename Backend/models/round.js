// models/Round.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const RoundSchema = new Schema({
  roundNumber: { type: Number, required: true },
  roundStartTime: { type: Date, required: true },
  roundEndTime: { type: Date, required: true },
  scanned: [{
    user: { type: Schema.Types.ObjectId, required: true },
    scannedAt: { type: Date, default: Date.now }
  }],
  absent: { type: Number, default: 0 },
  attend: { type: Number, default: 0 }
});

module.exports = mongoose.model('Round', RoundSchema);
