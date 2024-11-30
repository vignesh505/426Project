const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const authRoutes = require('./routes/auth');
const medicationRoutes = require('./routes/medications');

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: 'securesecretkey',
    resave: false,
    saveUninitialized: false,
    store: new SQLiteStore({ db: 'sessions.sqlite', dir: './db' }),
  })
);

app.use('/auth', authRoutes);
app.use('/medications', medicationRoutes);

app.use(express.static('public'));

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
