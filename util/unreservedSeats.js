const { Screen } = require('./../models/screen');

// Function to get unreserved seats for a given screen name.
const getUnreservedSeats = async (screenName) => {
  try {
    const screen = await Screen.findOne({ name: screenName });

    if (!screen) {
      throw new Error('No such screen name found. Please check and try again!');
    }

    const seatInfo = screen.seatInfo;
    const seats = {};

    // Iterate over each row to calculate unreserved seats
    for (let [rowName, rowDetails] of seatInfo) {
      const { reservedSeats, numberOfSeats } = rowDetails;
      const reservedSeatsSet = new Set(reservedSeats);
      const unreservedSeats = [];

      // Find all unreserved seats in the row
      for (let i = 0; i < numberOfSeats; i++) {
        if (!reservedSeatsSet.has(i)) {
          unreservedSeats.push(i);
        }
      }

      seats[rowName] = unreservedSeats;
    }

    return { seats };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { getUnreservedSeats };
