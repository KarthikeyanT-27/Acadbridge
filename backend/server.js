const bodyParser = require("body-parser");
const cors = require("cors");
const dotenv=require('dotenv');
const express=require('express');
const mongoose=require('mongoose');
const cron = require('node-cron');


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/Acadbridge", { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.error(err));

// Middleware
app.use(cors());
app.use(express.json());
app.use('/uploads',express.static('uploads'));

// Routes
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

const staffRoutes = require('./routes/staff');
app.use('/api/staff', staffRoutes);

const studentRoutes = require('./routes/students');
app.use('/api/student', studentRoutes);

const AdminRoutes = require('./routes/admin');
app.use('/api/admin', AdminRoutes);

const attendanceRoutes = require('./routes/attendance');
app.use('/api/attendance', attendanceRoutes);

const marksRoutes = require('./routes/marks');
app.use('/api/marks', marksRoutes);

const testRoutes = require('./routes/test');
app.use('/api/tests', testRoutes);



// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
