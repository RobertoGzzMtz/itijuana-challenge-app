// import fs from "fs";
// import inquirer from "inquirer";
// import readline from "readline";

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

let address = "123 Fake street, new jersey, nye";
let driverName = "Joaquin Phoeniix";

let hollowAddress = address.toLowerCase().replace(/\s+/g, "");
let hollowDriverName = driverName.toLowerCase().replace(/\s+/g, "");

let shipmentDestinationAddressEven = () => {
  let length = hollowAddress.length;
  return length % 2 == 0;
};

const driverNumberOfVowels = () => {
  const name = hollowDriverName.match(/[aeiou]/gi);
  return name === null ? 0 : name.length;
};

const driverNumberOfConsonants = () => {
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

const baseSuitabilityScore = () => {
  let score = shipmentDestinationAddressEven()
    ? driverNumberOfVowels() * 1.5
    : driverNumberOfConsonants();
  return score;
};

const hasCommonFactors = () => {
  const addressFactors = commonFactorsBesides1(hollowAddress.length);
  const nameFactors = commonFactorsBesides1(hollowDriverName.length);
  console.log(addressFactors, nameFactors);

  // return addressFactors.includes((factor, i) => factor === nameFactors[i]);

  return addressFactors.some((factor) => nameFactors.includes(factor));
};

const finalSuitabilityScore = () => {
  let score = baseSuitabilityScore();
  if (hasCommonFactors()) {
    score = baseSuitabilityScore() * 1.5;
  }
  return score;
};

console.log(
  driverNumberOfConsonants(),
  driverNumberOfVowels(),
  "shipmentDestinationAddressEven",
  shipmentDestinationAddressEven(),
  "hasCommonFactors",
  hasCommonFactors(),
  "baseSuitabilityScore",
  baseSuitabilityScore(),
  "finalSuitabilityScore",
  finalSuitabilityScore()
);
