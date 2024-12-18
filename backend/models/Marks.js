const mongoose = require('mongoose');

const marksSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  subject: {
    type: String,
    required: true,
  },
  marks: {
    type: Number,
    required: true,
    set: v => Math.round(v), // Ensure marks are stored as integers
  },  
  batch: {
    type: String,
    required: true,
  },
  department:{
    type:String,
  },
  date: {
    type: Date,
    required: true,
  },
  isPass: {
    type: Boolean,
    default: function() { return this.marks >= 50; }, // Assuming 50 is the passing mark
  },
});

const Marks = mongoose.model('Marks', marksSchema);

module.exports = Marks;
