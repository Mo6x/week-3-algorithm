


const { getTrips, getDriver, getVehicle } = require('api');


/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  // Your code goes here

  let dataTrips = await getTrips();
  let arrayOutput = [];

  let uniqueId = dataTrips.map((item) => item.driverID).filter((item, index, arr) => {
      return arr.indexOf(item) === index;
    });


  let vehicleInfo  = uniqueId.map(async (item) => {
    try {
      
      let driverData = await getDriver(item);
      driverData.item = item;

      let vehicle = driverData.vehicleID.map(async (vehicleID) => {
        let vehicleData = await getVehicle(vehicleID);
        return  {
          plate : vehicleData.plate,
          manufacturer : vehicleData.manufacturer,
        };
      });


      let vehicleDetails = await Promise.all(vehicle);
      driverData.vehicleDetails = vehicleDetails;
      return driverData
    } catch (error) {
      return item;
    }
  })

  let driver = await Promise.all(vehicleInfo);
    for (let i = 0; i < uniqueId.length; i++){
    let count = 0;
    let trips = [];
    let cashCount = 0;
    let nonCashCount = 0;
    let totalAmountEarned = 0;
    let totalCashAmount = 0;
    let totalNonCashAmount = 0;

      dataTrips.forEach(item => {
        if(item.driverID === uniqueId[i]){
          let amount = + `${item.billedAmount}`.replace(",", "");

          trips.push({
            user : item.user.name,
            created : item.created,
            pickup : item.pickup.address,
            destination : item.destination.address,
            billed : amount,
            isCash : item.isCash,
          });
          count++


          totalAmountEarned += amount;
        if(item.isCash){
          cashCount++;
          totalCashAmount += amount;
        } else {
          nonCashCount++;
          totalNonCashAmount += amount;
        }
      }

     });

     try {
       if(driver[i].item === uniqueId[i]){
         arrayOutput.push({
           fullName : driver[i].name,
           id : uniqueId[i],
           phone : driver[i].phone,
           noOfTrips : count++,
           noOfVehicles : driver[i].vehicleID.length,
           vehicles : driver[i].vehicleDetails,
           noOfCashTrips : cashCount,
           noOfNonCashTrips : nonCashCount,
           totalAmountEarned : + totalAmountEarned.toFixed(2),
           totalCashAmount : + totalCashAmount.toFixed(2),
           totalNonCashAmount : + totalNonCashAmount.toFixed(2),
           trips : trips
         })
       } else {
         arrayOutput.push({
           id : uniqueId[i],
           noOfTrips : count,
           noOfCashTrips : cashCount,
           noOfNonCashTrips : nonCashCount,
           trips : trips,
           totalAmountEarned : + totalAmountEarned.toFixed(2),
           totalCashAmount : + totalCashAmount.toFixed(2),
           totalNonCashAmount : + totalNonCashAmount.toFixed(2) 

         })
       }
     } catch (error) {
       console.log(error)
     }
   }

   return arrayOutput

}

//driverReport()

module.exports = driverReport