const { Screen } = require('./../models/screen');

// Function to check if given seats are available to be booked.
const isAvailable = async (screenName, seats) => {
  try {
    const screen = await Screen.findOne({ name: screenName });

    if (!screen) {
      throw new Error("No such screen exists.");
    }

    // Loop through each row provided in the request
    for (const row in seats) {
      const actualRow = screen.seatInfo.get(row);
      
      if (!actualRow) {
        throw new Error(`No such row '${row}' exists in this screen.`);
      }

      const { numberOfSeats, reservedSeats } = actualRow;
      const seatsToReserve = seats[row];
      const reservedSeatsSet = new Set(reservedSeats);

      // Check each seat to reserve
      for (const seat of seatsToReserve) {
        if (seat >= numberOfSeats || seat < 0) {
          throw new Error(`Invalid seat number '${seat}' for row '${row}'. Please provide a seat number between 0 and ${numberOfSeats - 1}.`);
        }
        if (reservedSeatsSet.has(seat)) {
          throw new Error(`Seat number '${seat}' in row '${row}' is already reserved. Please choose a different seat.`);
        }
      }

      // Reserve the seats
      actualRow.reservedSeats.push(...seatsToReserve);
    }

    // Save the updated screen information to the database
    const savedScreen = await screen.save();
    if (!savedScreen) {
      throw new Error("Failed to save changes in screen during reservation.");
    }
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { isAvailable };
