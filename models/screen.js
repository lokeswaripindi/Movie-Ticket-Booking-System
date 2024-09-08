/*
Model class for Screen, it defines the schema of a screen and validates the input.
*/

const mongoose = require('mongoose');

// Schema for Row
// It contains fields: number of seats, aisle seats, and reserved seats.
const RowSchema = new mongoose.Schema({
  numberOfSeats: {
    type: Number,
    required: true,
    min: 1, // Ensure at least 1 seat
  },
  aisleSeats: {
    type: [Number],
    default: [],
    validate: {
      validator: function (aisleSeats) {
        return aisleSeats.every(seat => seat >= 0); // Ensure all seat numbers are non-negative
      },
      message: 'Aisle seat numbers must be non-negative integers.'
    }
  },
  reservedSeats: {
    type: [Number],
    default: [],
    validate: {
      validator: function (reservedSeats) {
        return reservedSeats.every(seat => seat >= 0); // Ensure all seat numbers are non-negative
      },
      message: 'Reserved seat numbers must be non-negative integers.'
    }
  }
});

// Schema for Screen
// It contains fields: name of the screen and a map of seat information.
const ScreenSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  seatInfo: {
    type: Map,
    of: RowSchema,
    required: true,
    validate: {
      validator: function (seatInfo) {
        return Array.from(seatInfo.values()).every(row => row.numberOfSeats >= 1);
      },
      message: 'Each row must have at least 1 seat.'
    }
  }
}, {
  timestamps: true // Automatically creates createdAt and updatedAt fields
});

const Screen = mongoose.model('Screen', ScreenSchema);

module.exports = { Screen };
