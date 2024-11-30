const express = require('express');
const session = require('express-session');
const authRoutes = require('./routes/auth');
const medicationRoutes = require('./routes/medications');

const app = express();
const PORT = 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'healthcareapp',
  resave: false,
  saveUninitialized: false,
}));


app.use('/auth', authRoutes);
app.use('/medications', medicationRoutes);


app.use(express.static('public'));


app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
