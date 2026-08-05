// models/Course.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CourseSchema = new Schema({
  courseTopic: { type: String, required: true },
  courseDescription: { type: String },
  participate: { type: Number, default: 0 },
  totalAttend: { type: Number, default: 0 },
  totalAbsent: { type: Number, default: 0 },
  rounds: [{ type: Schema.Types.ObjectId, ref: 'Round' }],
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['private', 'public'], default: 'private' },
  creator: { type: Schema.Types.ObjectId, ref: 'Admin' } ,
  courseImage :{ type: String, required: false , default : ''},
} , { minimize: false });

module.exports = mongoose.model('Course', CourseSchema);
