const noteApp = require('express').Router();
const { v4: uuidv4 } = require('uuid');
const { readAndAppend, readFromFile } = require('../helpers/fsUtils');
const note = require('../db/db.json')

noteApp.get('/', (req, res) =>
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)))
);

noteApp.post('/', (req, res) => {
  const { title, text} = req.body;

  if (title && text) {
    const newNotes = {
      title,
      text,
      notes_id: uuidv4(),
    };

    readAndAppend(newNotes, './db/db.json');

    const response = {
      status: 'success',
      body: newNotes,
    };

    res.json(response);
  } else {
    res.json('Error in posting notes');
  }
});

noteApp.get('/:notes_id', (req, res) => {
  if (req.params.notes_id) {
    console.info(`${req.method} request received to get a single note`);
    const noteId = req.params.notes_id;
    for (let i = 0; i < note.length; i++) {
      const currentNote = note[i];
      if (currentNote.notes_id === noteId) {
        res.json(currentNote);
        return;
      }
    }
    res.status(404).send('Note not found');
  } else {
    res.status(400).send('Note ID not provided');
  }
});

module.exports = noteApp;