import fs from "fs";

// The top-secret algorithm is:
// If the length of the shipment's destination street name is even, the base suitability score (SS) is the number of vowels in the driver’s
// name multiplied by 1.5.
// If the length of the shipment's destination street name is odd, the base SS is the number of consonants in the driver’s name multiplied by
// 1.
// If the length of the shipment's destination street name shares any common factors (besides 1) with the length of the driver’s name, the
// SS is increased by 50% above the base SS.
// Write an application in the language of your choice that assigns shipment destinations to drivers in a way that maximizes the total SS over the set
// of drivers. Each driver can only have one shipment and each shipment can only be offered to one driver. Your program should run on the
// command line and take as input two newline separated files, the first containing the street addresses of the shipment destinations and the second
// containing the names of the drivers. The output should be the total SS and a matching between shipment destinations and drivers. You do not
// need to worry about malformed input, but you should certainly handle both upper and lower case names.

let shipmentDestinationAddressEven = (hollowAddress) => {
  let length = hollowAddress.length;
  return length % 2 == 0;
};

const driverNumberOfVowels = (hollowDriverName) => {
  const name = hollowDriverName.match(/[aeiou]/gi);
  return name === null ? 0 : name.length;
};

const driverNumberOfConsonants = (hollowDriverName) => {
  const name = hollowDriverName.match(/[bcdfghjklmnpqrstvwxyz]/gi);
  return name === null ? 0 : name.length;
};

const commonFactorsBesides1 = (num) => {
  const array = [];
  for (let i = 2; i <= num; i++) {
    if (num % i == 0) {
      array.push(i);
    }
  }
  return array;
};

const baseSuitabilityScore = (hollowAddress, hollowDriverName) => {
  let score = shipmentDestinationAddressEven(hollowAddress)
    ? driverNumberOfVowels(hollowDriverName) * 1.5
    : driverNumberOfConsonants(hollowDriverName);
  return score;
};

const hasCommonFactors = (hollowAddress, hollowDriverName) => {
  const addressFactors = commonFactorsBesides1(hollowAddress.length);
  const nameFactors = commonFactorsBesides1(hollowDriverName.length);
  // console.log("hasCommonFactors", addressFactors, nameFactors);

  return addressFactors.some((factor) => nameFactors.includes(factor));
};

const finalSuitabilityScore = (hollowAddress, hollowDriverName) => {
  let score = baseSuitabilityScore(hollowAddress, hollowDriverName);
  if (hasCommonFactors(hollowAddress, hollowDriverName)) {
    score = baseSuitabilityScore(hollowAddress, hollowDriverName) * 1.5;
  }
  return score;
};

const readExternalData = (path) => {
  let res;
  try {
    const jsonString = fs.readFileSync(path);
    const response = JSON.parse(jsonString);
    res = response.data;
  } catch (err) {
    console.log("Error parsing JSON string:", err);
  }
  return res;
};

let drivers = await readExternalData("./data/drivers.json");
let destinations = await readExternalData("./data/destinations.json");

const driversAndDestinations = () => {
  let sScoreCounter = 0;
  let totalScore = 0;
  let finalSSArr = [];
  let maxSSIndex;
  const matchObj = {
    driver: "",
    address: "",
  };
  let destinationResult = [];
  destinations.map((addressObj) => {
    drivers.forEach((nameObj) => {
      const hollowAddress = addressObj.address
        .toLowerCase()
        .replace(/\s+/g, "");
      const hollowDriverName = nameObj.name.toLowerCase().replace(/\s+/g, "");
      const finalSS = finalSuitabilityScore(hollowAddress, hollowDriverName);
      // console.log("finalSS", finalSS);
      finalSSArr.push(finalSS);
      sScoreCounter = Math.max(...finalSSArr);
      maxSSIndex = finalSSArr.indexOf(sScoreCounter);
      totalScore += finalSS;
    });
    finalSSArr.length = 0;
    matchObj.driver = drivers[maxSSIndex].name;
    matchObj.address = addressObj.address;
    destinationResult.push(matchObj);

    drivers.splice(maxSSIndex, 1);
    console.log("Best Destination Match:", matchObj);
  });
  console.log("Total Score:", totalScore);
  return totalScore;
};

driversAndDestinations();
