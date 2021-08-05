const { species, employees, prices } = require('./data');
const data = require('./data');

function getSpeciesByIds(...ids) {
  if (ids.length === 0) {
    return [];
  }
  return ids.map((id) => species.filter((kind) => kind.id === id)[0]);
}

function getAnimalsOlderThan(animal, age) {
  return species
    .find((specie) => specie.name === animal)
    .residents.every((resident) => resident.age >= age);
}

function getEmployeeByName(employeeName) {
  if (employeeName === undefined) {
    return {};
  }
  return employees
    .find((person) => person.firstName === employeeName || person.lastName === employeeName);
}

function createEmployee(personalInfo, associatedWith) {
  const { id, firstName, lastName } = personalInfo;
  const { managers, responsibleFor } = associatedWith;
  return { id, firstName, lastName, managers, responsibleFor };
}

function isManager(id) {
  return employees.some((person) => person.managers.includes(id));
}

function addEmployee(id, firstName, lastName, managers = [], responsibleFor = []) {
  const newEmployee = { id, firstName, lastName, managers, responsibleFor };
  employees.push(newEmployee);
}

function countAnimals(animal) {
  if (animal === undefined) {
    return species.reduce((object, kind) => {
      const entrie = { [kind.name]: kind.residents.length };
      Object.assign(object, entrie);
      return object;
    }, {});
  }
  return species.find((kind) => kind.name === animal).residents.length;
}

function calculateEntry(entrants) {
  if (entrants === undefined || Object.keys(entrants).length === 0) {
    return 0;
  }
  return Object.entries(prices).reduce((sum, entriesPair) => {
    const key = entriesPair[0];
    const value = entriesPair[1];
    if (Object.keys(entrants).includes(key)) {
      return sum + value * entrants[key];
    }
    return sum;
  }, 0);
}

const filterBySex = (namesArrays, sexArrays, kindOfSex) =>
  namesArrays.map((kindOfAnimal, index1) =>
    kindOfAnimal.filter((nameOfAnimal, index2) => sexArrays[index1][index2] === kindOfSex));

const applyOptions = (namesArrays, sexArrays, options) => {
  let result = namesArrays;
  if (options.sex === 'male') {
    result = filterBySex(namesArrays, sexArrays, 'male');
  }
  if (options.sex === 'female') {
    result = filterBySex(namesArrays, sexArrays, 'female');
  }
  if (options.sorted) {
    result.forEach((kindOfAnimal) => kindOfAnimal.sort());
  }
  return result;
};

const filterAnimals = (region, options = {}) => {
  const animalsByRegion = species
    .filter((animal) => animal.location === region);
  const kindsOfAnimals = animalsByRegion.map((kindOfAnimal) => kindOfAnimal.name);
  const allAnimalsPerKind = animalsByRegion.map((kindOfAnimal) =>
    kindOfAnimal.residents.map((resident) => resident.name));
  const allSexPerKind = animalsByRegion.map((kindOfAnimal) =>
    kindOfAnimal.residents.map((resident) => resident.sex));
  let arraysOfNames;
  if (options.includeNames) {
    arraysOfNames = applyOptions(allAnimalsPerKind, allSexPerKind, options);
  } else {
    return kindsOfAnimals;
  }
  return animalsByRegion.map((kindOfAnimal, index) =>
    ({ [kindOfAnimal.name]: arraysOfNames[index] }));
};

function getAnimalMap(options) {
  return {
    NE: filterAnimals('NE', options),
    NW: filterAnimals('NW', options),
    SE: filterAnimals('SE', options),
    SW: filterAnimals('SW', options),
  };
}

function getSchedule(dayName = 'all') {
  const allDays = {
    Tuesday: 'Open from 8am until 6pm',
    Wednesday: 'Open from 8am until 6pm',
    Thursday: 'Open from 10am until 8pm',
    Friday: 'Open from 10am until 8pm',
    Saturday: 'Open from 8am until 10pm',
    Sunday: 'Open from 8am until 8pm',
    Monday: 'CLOSED',
  };
  if (dayName === 'all') {
    return allDays;
  }
  return { [dayName]: allDays[dayName] };
}

function getOldestFromFirstSpecies(id) {
  const specieId = employees.find((person) => person.id === id).responsibleFor[0];
  const object = species.find((kindOfAnimal) =>
    kindOfAnimal.id === specieId).residents.sort((a, b) => b.age - a.age)[0];
  return [object.name, object.sex, object.age];
}

function increasePrices(percentage) {
  prices.Adult = Math.ceil(100 * prices.Adult * (1 + percentage / 100)) / 100;
  prices.Senior = Math.ceil(100 * prices.Senior * (1 + percentage / 100)) / 100;
  prices.Child = Math.ceil(100 * prices.Child * (1 + percentage / 100)) / 100;
}

function getEmployeeCoverage(idOrName) {
  // seu código aqui
}

module.exports = {
  calculateEntry,
  getSchedule,
  countAnimals,
  getAnimalMap,
  getSpeciesByIds,
  getEmployeeByName,
  getEmployeeCoverage,
  addEmployee,
  isManager,
  getAnimalsOlderThan,
  getOldestFromFirstSpecies,
  increasePrices,
  createEmployee,
};
