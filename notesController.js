const fs = require("fs");
const path = require("path");

const dataPath = path.join(__dirname, "..", "data", "notes.json");

function readNotes() {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data || "[]");
}

function saveNotes(notes) {
  fs.writeFileSync(dataPath, JSON.stringify(notes, null, 2));
}

exports.getAllNotes = (req, res) => {
  const notes = readNotes();
  res.status(200).json({ success: true, count: notes.length, data: notes });
};

exports.getNoteById = (req, res) => {
  const notes = readNotes();
  const note = notes.find((n) => n.id === req.params.id);

  if (!note) {
    return res.status(404).json({ success: false, message: "Note nahi mila" });
  }

  res.status(200).json({ success: true, data: note });
};

exports.createNote = (req, res) => {
  const { title, content } = req.body;

  if (!title || !content) {
    return res
      .status(400)
      .json({ success: false, message: "Title aur content dono required hain" });
  }

  const notes = readNotes();

  const newNote = {
    id: Date.now().toString(),
    title,
    content,
    createdAt: new Date().toISOString(),
  };

  notes.push(newNote);
  saveNotes(notes);

  res.status(201).json({ success: true, data: newNote });
};

exports.updateNote = (req, res) => {
  const { title, content } = req.body;
  const notes = readNotes();

  const index = notes.findIndex((n) => n.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Note nahi mila" });
  }

  notes[index] = {
    ...notes[index],
    title: title || notes[index].title,
    content: content || notes[index].content,
    updatedAt: new Date().toISOString(),
  };

  saveNotes(notes);

  res.status(200).json({ success: true, data: notes[index] });
};

exports.deleteNote = (req, res) => {
  const notes = readNotes();
  const index = notes.findIndex((n) => n.id === req.params.id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: "Note nahi mila" });
  }

  const deletedNote = notes.splice(index, 1);
  saveNotes(notes);

  res.status(200).json({ success: true, data: deletedNote[0] });
};