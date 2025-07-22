const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/appointments', require('./routes/appointmentRoutes'));
app.use('/api/availability', require('./routes/availabilityRoutes'));
app.use('/api/patients', require('./routes/patientRoutes'));
app.use('/api/clinic', require('./routes/clinicRoutes'));
app.use('/api/users', require('./routes/userRoutes'));


app.get('/', (req, res) => {
  res.send('Clinic Management API is running');
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch((err) => {
  console.error('❌ MongoDB connection failed:', err);
  process.exit(1);
});
