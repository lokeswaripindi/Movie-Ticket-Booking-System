require('./config/config');

const express = require('express');
const bodyParser = require('body-parser');
const { ObjectID } = require('mongodb');

let { mongoose } = require('./db/mongoose');
let { Screen } = require('./models/screen');
let { isAvailable } = require('./util/checkSeatAvaibility');
let { getUnreservedSeats } = require('./util/unreservedSeats');
let { getSeatAvailableAtChoice } = require('./util/checkSeatOfChoice');

let app = express();
app.use(bodyParser.json());

const port = process.env.PORT || 9090; // Set default port for local development

// API to accept details of movie screen
app.post('/screens', async (req, res) => {
  try {
    let screen = new Screen(req.body);
    await screen.save();
    res.status(201).json({
      status: 'success',
      message: 'Screen details added successfully.',
      data: screen
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to add screen details.',
      error: e.message
    });
  }
});

// API to reserve tickets for given seats in a given screen
app.post('/screens/:screen_name/reserve', async (req, res) => {
  try {
    let screenName = req.params.screen_name;
    let seats = req.body.seats;
    await isAvailable(screenName, seats);
    res.status(200).json({
      status: 'success',
      message: 'Reservation is successful.'
    });
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Reservation failed.',
      error: e.message
    });
  }
});

/*
API to get the available seats for a given screen
And also
API to get information of available tickets at a given position
Same endpoint will be used for both. We will differentiate from queries.
*/
app.get('/screens/:screen_name/seats', async (req, res) => {
  try {
    let query = req.query;
    if (query.status && query.status === 'unreserved') { // To get the available seats for a given screen
      let unreservedSeats = await getUnreservedSeats(req.params.screen_name);
      res.status(200).json({
        status: 'success',
        message: 'Unreserved seats retrieved successfully.',
        data: unreservedSeats
      });
    } else if (query.numSeats && query.choice) { // To get information of available tickets at a given position
      let seatOfChoice = await getSeatAvailableAtChoice(req.params.screen_name, query.numSeats, query.choice);
      res.status(200).json({
        status: 'success',
        message: 'Seats available at the given choice retrieved successfully.',
        data: seatOfChoice
      });
    } else { // Return error 404 if any other endpoint is used.
      res.status(404).json({
        status: 'fail',
        message: 'Page not found.'
      });
    }
  } catch (e) {
    res.status(400).json({
      status: 'fail',
      message: 'Failed to retrieve seat information.',
      error: e.message
    });
  }
});

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

module.exports = { app };
