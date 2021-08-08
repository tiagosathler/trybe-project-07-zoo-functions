const { species, employees, hours, prices } = require('./data');
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
  return { ...personalInfo, ...associatedWith };
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

const applyOptions = (namesArrays, sexesArrays, options) => {
  let result = namesArrays;
  if (options.sex) {
    result = namesArrays.map((kindOfAnimal, index1) =>
      kindOfAnimal.filter((nameOfAnimal, index2) =>
        sexesArrays[index1][index2] === options.sex));
  }
  if (options.sorted) {
    result.forEach((kindOfAnimal) => kindOfAnimal.sort());
  }
  return result;
};

const filterAnimals = (region, options = {}) => {
  const animalsByRegion = species
    .filter((animal) => animal.location === region);
  const typesOfAnimals = animalsByRegion.map((kindOfAnimal) => kindOfAnimal.name);
  const allAnimalsByType = animalsByRegion.map((kindOfAnimal) =>
    kindOfAnimal.residents.map((resident) => resident.name));
  const allAnimalSexesByType = animalsByRegion.map((kindOfAnimal) =>
    kindOfAnimal.residents.map((resident) => resident.sex));
  let arraysOfNames;
  if (options.includeNames) {
    arraysOfNames = applyOptions(allAnimalsByType, allAnimalSexesByType, options);
  } else {
    return typesOfAnimals;
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

const getDaySchedule = ({ open, close }) =>
  (open === close ? 'CLOSED' : `Open from ${open}am until ${close - 12}pm`);

function getSchedule(dayName = 'all') {
  const allDays = {
    Tuesday: `${getDaySchedule(hours.Tuesday)}`,
    Wednesday: `${getDaySchedule(hours.Wednesday)}`,
    Thursday: `${getDaySchedule(hours.Thursday)}`,
    Friday: `${getDaySchedule(hours.Friday)}`,
    Saturday: `${getDaySchedule(hours.Saturday)}`,
    Sunday: `${getDaySchedule(hours.Sunday)}`,
    Monday: `${getDaySchedule(hours.Monday)}`,
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
  prices.Adult = Math.round(100 * prices.Adult * (1 + percentage / 100)) / 100;
  prices.Senior = Math.round(100 * prices.Senior * (1 + percentage / 100)) / 100;
  prices.Child = Math.round(100 * prices.Child * (1 + percentage / 100)) / 100;
}

const replaceSpeciesId2Name = (array) =>
  array.map((id) =>
    species.find((specie) =>
      specie.id === id).name);

function getEmployeeCoverage(idOrName = 'all') {
  const fullNames = [];
  const ids = [];
  const allEmployees = employees.reduce((object, person) => {
    const fullName = `${person.firstName} ${person.lastName}`;
    fullNames.push(fullName);
    ids.push(person.id);
    const entrie = { [fullName]: replaceSpeciesId2Name(person.responsibleFor) };
    Object.assign(object, entrie);
    return object;
  }, {});
  if (idOrName === 'all') {
    return allEmployees;
  }
  const fullName = fullNames.find((name, index) =>
    name.split(' ').includes(idOrName) || ids[index] === idOrName);
  const index = fullNames.indexOf(fullName);
  return { [Object.keys(allEmployees)[index]]: Object.values(allEmployees)[index] };
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
