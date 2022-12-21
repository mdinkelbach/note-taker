const express = require('express')
const router = express.Router()
const { readFromFile, readAndAppend } = require('../helpers/fsUtils');
const uuid = require('../helpers/uuid');

const app = express();

// GET Route for notes page
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, '/public/notes.html'))
);

// GET Route for retrieving all the notes
app.get('/api/notes', (req, res) => {
    console.info(`${req.method} request received for notes`);
  
    readFromFile('./db/notes.json').then((data) => res.json(JSON.parse(data)));
  });

// POST Route for submitting notes
app.post('/api/notes', (req, res) => {
    // Log that a POST request was received
    console.info(`${req.method} request received to submit notes`);
  
    // Destructuring assignment for the items in req.body
    const { email, notesType, notes } = req.body;
  
    // If all the required properties are present
    if (email && notesType && notes) {
      // Variable for the object we will save
      const newNotes = {
        email,
        notesType,
        notes,
        notes_id: uuid(),
      };
  
      readAndAppend(newNotes, './db/notes.json');
  
      const response = {
        status: 'success',
        body: newNotes,
      };
  
      res.json(response);
    } else {
      res.json('Error in posting notes');
    }
  });

module.exports = router