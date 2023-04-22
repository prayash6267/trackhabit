const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

// Connect to the database
mongoose.connect('mongodb://localhost/habit-tracker', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const app = express();

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Use body-parser to parse request bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Define the Habit model
const habitSchema = new mongoose.Schema({
  name: String,
  description: String,
  frequency: Number,
  completed: [Date]
});

const Habit = mongoose.model('Habit', habitSchema);

// Define routes
app.get('/', async (req, res) => {
  const habits = await Habit.find();
  res.render('index', { habits });
});

app.post('/habits', async (req, res) => {
  const habit = new Habit(req.body);
  await habit.save();
  res.redirect('/');
});

app.post('/habits/:id/complete', async (req, res) => {
  const habit = await Habit.findById(req.params.id);
  habit.completed.push(new Date());
  await habit.save();
  res.redirect('/');
});

// Start the server
app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
