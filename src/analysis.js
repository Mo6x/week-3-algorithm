//const { getTrips } = require('api');

/** 
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */



const { getTrips, getDriver } = require("api");

// const trips = require('api/data/trips.json');
// const driver = require('api/data/drivers.json');
// const vehicles = require('api/data/vehicles.json')

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */


async function analysis() {
  // Your code goes here
  const data = await getTrips();
  let totalBills = 0;
  let cashBills = 0;
  let cashCount = 0;
  let nonCashCount = 0;
  let vehicleCount = 0;
  let nonCashBills = 0;
  let driversIdObj = {};
  let driverEarning = {};

  data.map((trip) => {
    let billedAmt = +`${trip.billedAmount}`.replace(",", "");
    totalBills += billedAmt;

    if (trip.isCash) {
      cashCount++;
      cashBills += billedAmt;
    } else {
      nonCashCount++;
      nonCashBills += billedAmt;
    }

    driversIdObj[trip.driverID] = (driversIdObj[trip.driverID] || 0) + 1;
    driverEarning[trip.driverID] =
      (driverEarning[trip.driverID] || 0) + billedAmt;
  });

  let uniqueDrivers = Object.keys(driversIdObj);

  // Helper function
  function highest(params) {
    let highTrip = Object.entries(params).sort((a, b) => b[1] - a[1]);
    // console.log(highTrip);
    let index = highTrip[0];
    // console.log(highTrip[0]);
    return index;
  }

  let mostTrips = {};
  let mostEarning = {};

  //console.log(highest(driversIdObj));
  let mapArr = data.map(async (driver, index) => {
    // console.log(highest(driversIdObj)[0])

    try {
      const driverData = await getDriver(uniqueDrivers[index]);
      if (driverData.vehicleID.length > 1) {
        vehicleCount++;
      }
      if (highest(driversIdObj)[0] == uniqueDrivers[index]) {
        mostTrips.name = driverData.name;
        mostTrips.email = driverData.email;
        mostTrips.phone = driverData.phone;
        mostTrips.noOfTrips = highest(driversIdObj)[1];
        mostTrips.totalAmountEarned = driverEarning[highest(driversIdObj)[0]];
      }


      if (highest(driverEarning)[0] == uniqueDrivers[index]) {
        mostEarning.name = driverData.name;
        mostEarning.email = driverData.email;
        mostEarning.phone = driverData.phone;
        mostEarning.noOfTrips = driversIdObj[highest(driverEarning)[0]];
        mostEarning.totalAmountEarned = highest(driverEarning)[1];
      }
    } catch (error) {
     // console.log(error);
    }
  });

  await Promise.all(mapArr);

  let output = {
    noOfCashTrips: cashCount,
    noOfNonCashTrips: nonCashCount,
    billedTotal: +totalBills.toFixed(2),
    cashBilledTotal: +cashBills.toFixed(2),
    nonCashBilledTotal: +nonCashBills.toFixed(2),
    noOfDriversWithMoreThanOneVehicle: vehicleCount,
    mostTripsByDriver: mostTrips,
    highestEarningDriver: mostEarning,
  };

  //console.log(output);
  return output;
}
//analysis();
module.exports = analysis;










