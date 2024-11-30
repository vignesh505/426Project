const express = require('express');
const db = require('../db/database');
const authMiddleware = require('../middlewares/authMiddleware');
const fetch = require('node-fetch'); // For OpenFDA API

const router = express.Router();

router.get('/', authMiddleware, (req, res) => {
  db.all('SELECT * FROM medications WHERE user_id = ?', [req.session.userId], (err, medications) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(medications);
  });
});


router.post('/', authMiddleware, (req, res) => {
  const { name, dosage, frequency, time } = req.body;

  db.run('INSERT INTO medications (name, dosage, frequency, time, user_id) VALUES (?, ?, ?, ?, ?)',
    [name, dosage, frequency, time, req.session.userId], (err) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'Medication added successfully' });
    });
});


router.get('/info/:name', authMiddleware, async (req, res) => {
  const { name } = req.params;

  try {
    const response = await fetch(`https://api.fda.gov/drug/label.json?search=openfda.brand_name:${name}&limit=1`);
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      res.json({
        brand_name: data.results[0].openfda.brand_name,
        purpose: data.results[0].purpose,
        warnings: data.results[0].warnings,
      });
    } else {
      res.json({ message: 'No information found for this medication' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Error fetching medication details' });
  }
});

module.exports = router;
