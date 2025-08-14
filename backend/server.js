require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const roastRoutes = require('./routes/roastRoutes');
const feedRoutes = require('./routes/feedRoutes');
const testRoutes = require('./routes/testRoutes');
const authRoutes = require('./routes/authRoutes');
const personRoutes = require('./routes/personRoutes');

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

app.use('/api/roast', roastRoutes);
app.use('/api', feedRoutes);
app.use('/api/test', testRoutes);
app.use('/api/auth', authRoutes);
app.use('/api', personRoutes);

// health
app.get('/', (req, res) => res.send('AI Roast Machine backend OK'));

app.listen(PORT, () => console.log(`Server running on ${PORT}`));
