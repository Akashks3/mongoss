const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

const mongoURI = 'mongodb://localhost:27017/studentDB'; 

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('Error connecting to MongoDB:', err));

const mentorSchema = new mongoose.Schema({
  name: String,
  subject: String,
  experience: Number, 
});

const Mentor = mongoose.model('Mentor', mentorSchema);


const studentSchema = new mongoose.Schema({
  name: String,
  age: Number,
  course: String,
  mentor: { type: mongoose.Schema.Types.ObjectId, ref: 'Mentor' },
});

const Student = mongoose.model('Student', studentSchema);


app.post('/mentors', async (req, res) => {
  try {
    const mentor = new Mentor(req.body);
    await mentor.save();
    res.status(201).send(mentor);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/mentors', async (req, res) => {
  try {
    const mentors = await Mentor.find();
    res.status(200).send(mentors);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/', async (req, res) => {
  try {
    const students = await Student.find().populate('mentor'); 
    res.status(200).send(students);
  } catch (err) {
    res.status(500).send(err);
  }
});


const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port http://localhost:${port}`);
});
