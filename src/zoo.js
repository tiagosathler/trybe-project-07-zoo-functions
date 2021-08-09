const { species, employees, hours, prices } = require('./data');
const data = require('./data');

// Requisito 01
function getSpeciesByIds(...ids) {
  return ids.length !== 0 ? ids.map((id) => species.filter((kind) => kind.id === id)[0]) : [];
}

// Requisito 02
function getAnimalsOlderThan(animal, age) {
  return species
    .find((specie) => specie.name === animal)
    .residents.every((resident) => resident.age >= age);
}

// Requisito 03
function getEmployeeByName(employeeName) {
  return employeeName ? employees
    .find((person) => person.firstName === employeeName || person.lastName === employeeName) : {};
}

// Requisito 04
function createEmployee(personalInfo, associatedWith) {
  return { ...personalInfo, ...associatedWith };
}

// Requisito 05
function isManager(id) {
  return employees.some((person) => person.managers.includes(id));
}

// Requisito 06
function addEmployee(id, firstName, lastName, managers = [], responsibleFor = []) {
  employees.push(createEmployee({ id, firstName, lastName, managers, responsibleFor }));
}

// Requisito 07
function countAnimals(animal) {
  if (animal === undefined) {
    return species.reduce((acc, kindOfAnimal) => {
      acc[kindOfAnimal.name] = kindOfAnimal.residents.length;
      return acc;
    }, {});
  }
  return species.find((kindOfAnimal) => kindOfAnimal.name === animal).residents.length;
}

// Requisito 08
function calculateEntry(entrants) {
  if (entrants === undefined || Object.keys(entrants).length === 0) {
    return 0;
  }
  return Object.entries(prices).reduce((sum, [key, value]) => {
    if (Object.keys(entrants).includes(key)) {
      return sum + value * entrants[key];
    }
    return sum;
  }, 0);
}

const applyOptions = (namesArrays, sexesArrays, { sex, sorted }) => {
  let result = namesArrays;
  if (sex) {
    result = namesArrays.map((kindOfAnimal, index1) =>
      kindOfAnimal.filter((nameOfAnimal, index2) =>
        sexesArrays[index1][index2] === sex));
  }
  if (sorted) {
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
  if (!options.includeNames) {
    return typesOfAnimals;
  }
  const arraysOfNames = applyOptions(allAnimalsByType, allAnimalSexesByType, options);
  return animalsByRegion.map((kindOfAnimal, index) =>
    ({ [kindOfAnimal.name]: arraysOfNames[index] }));
};

// Requisito 09
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

// Requisito 10
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

// Requisito 11
function getOldestFromFirstSpecies(id) {
  const specieId = employees.find((person) => person.id === id).responsibleFor[0];
  const animalObj = species.find((kindOfAnimal) =>
    kindOfAnimal.id === specieId)
    .residents.sort((a, b) => b.age - a.age)[0];
  return Object.values(animalObj);
}

// Requisito 12
function increasePrices(percentage) {
  Object.entries(prices).forEach(([key, value]) => {
    prices[key] = Math.round(100 * value * (1 + percentage / 100)) / 100;
  });
}

const replaceSpeciesId2Name = (array) =>
  array.map((id) =>
    species.find((specie) =>
      specie.id === id).name);

// Requisito 13
function getEmployeeCoverage(idOrName = 'all') {
  const allEmployees = employees.reduce((acc, person) => {
    const fullName = `${person.firstName} ${person.lastName}`;
    acc[fullName] = replaceSpeciesId2Name(person.responsibleFor);
    return acc;
  }, {});
  if (idOrName === 'all') {
    return allEmployees;
  }
  const { firstName, lastName } = employees.find((person) =>
    person.firstName === idOrName
    || person.lastName === idOrName
    || person.id === idOrName);
  const fullName = `${firstName} ${lastName}`;
  return { [fullName]: allEmployees[fullName] };
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
