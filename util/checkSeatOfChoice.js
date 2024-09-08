const { Screen } = require('./../models/screen');

// Function to check and return the best choice of seats
// if the user specifies the number of seats they want and a choice of seat
const getSeatAvailableAtChoice = async (screenName, numSeats, choice) => {
  try {
    const screen = await Screen.findOne({ name: screenName });

    if (!screen) {
      throw new Error('No such screen name exists.');
    }

    const choiceRow = choice.substring(0, 1);
    const choiceSeatNo = Number(choice.substring(1));
    const rowInfo = screen.seatInfo.get(choiceRow);

    if (!rowInfo) {
      throw new Error(`Row '${choiceRow}' does not exist.`);
    }

    const { aisleSeats, reservedSeats, numberOfSeats } = rowInfo;
    const aisleSeatsSet = new Set(aisleSeats);
    const reservedSeatsSet = new Set(reservedSeats);

    if (reservedSeatsSet.has(choiceSeatNo)) {
      throw new Error('The chosen seat is already reserved.');
    }

    let i = choiceSeatNo;
    let j = choiceSeatNo;

    // Expand to find the required number of seats around the choice
    while (j - i < numSeats - 1) {
      if (i > 0 && !reservedSeatsSet.has(i - 1) && (!aisleSeatsSet.has(i) || i === choiceSeatNo)) {
        i--;
      } else if (j < numberOfSeats - 1 && !reservedSeatsSet.has(j + 1) && (!aisleSeatsSet.has(j) || j === choiceSeatNo)) {
        j++;
      } else {
        break;
      }
    }

    // If unable to find the required number of seats together, reject
    if (j - i !== numSeats - 1) {
      throw new Error('Sorry, no such seats available!');
    }

    // Collect the result
    const availableSeats = { [choiceRow]: [] };
    for (let a = i; a <= j; a++) {
      availableSeats[choiceRow].push(a);
    }

    return { availableSeats };
  } catch (err) {
    throw new Error(err.message);
  }
};

module.exports = { getSeatAvailableAtChoice };
