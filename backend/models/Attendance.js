// models/Attendance.js
const mongoose = require('mongoose');

const attendanceSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  name:{
    type:String,
    required:true,
  },
  batch:{
    type:String,
    required:true,
  },
  registernumber:{
    type:String,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    default: 'present',
  },
});

const Attendance = mongoose.model('Attendance', attendanceSchema);

module.exports = Attendance;
