const express = require('express');
const path = require('path');
require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');

const roastRoutes = require('./routes/roastRoutes');
const feedRoutes = require('./routes/feedRoutes');
const testRoutes = require('./routes/testRoutes');

const app = express();
app.use(cors());
app.use(express.json());

// Add request logging
app.use((req, res, next) => {
  console.log(`📨 ${req.method} ${req.path} - ${new Date().toLocaleTimeString()}`);
  if (req.body && Object.keys(req.body).length > 0) {
    console.log(`📦 Body:`, req.body);
  }
  next();
});

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('✅ MongoDB connected'))
  .catch((err) => console.error('Mongo connect error', err));

// API routes
app.use('/api/roast', roastRoutes);
app.use('/api', feedRoutes);
app.use('/api/test', testRoutes);

// Serve static files from frontend build (for production)
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
} else {
  // Development health check
  app.get('/', (req, res) => res.send('AI Roast Machine backend OK - Development Mode'));
}

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
