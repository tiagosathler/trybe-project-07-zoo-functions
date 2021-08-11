const { species, employees, hours, prices } = require('./data');
const data = require('./data');

// Requisito 01
function getSpeciesByIds(...ids) {
  return ids.map((id) => species.find((kind) => kind.id === id));
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
  return animal
    ? species.find((kindOfAnimal) => kindOfAnimal.name === animal).residents.length
    : species.reduce((acc, kindOfAnimal) => {
      acc[kindOfAnimal.name] = kindOfAnimal.residents.length;
      return acc;
    }, {});
}

// Requisito 08
function calculateEntry({ Adult: adult = 0, Child: child = 0, Senior: senior = 0 } = {}) {
  return adult * prices.Adult + child * prices.Child + senior * prices.Senior;
}

//  Requisito 09 - função de suporte
const applyOptions = (residents, sex, sorted) => {
  let arrays = residents;
  if (sex) {
    arrays = arrays.reduce((acc, kind) => {
      acc.push(kind.filter((resident) => resident.sex === sex));
      return acc;
    }, []);
  }
  arrays = arrays.map((kind) => kind.map((resident) => resident.name));
  if (sorted) {
    arrays.forEach((names) => names.sort());
  }
  return arrays;
};

// Requisito 09
function getAnimalMap({ includeNames, sex, sorted } = {}) {
  return ['NE', 'NW', 'SE', 'SW'].reduce((acc, region) => {
    const speciesByRegion = species.filter((animal) => animal.location === region);
    const animals = speciesByRegion.map((animal) => animal.name);
    if (includeNames) {
      const residents = speciesByRegion.map((animal) => animal.residents);
      const residentsApplied = applyOptions(residents, sex, sorted);
      animals.forEach((animal, index) => {
        acc[region].push({ [animal]: residentsApplied[index] });
      });
    } else {
      acc[region] = animals;
    }
    return acc;
  }, { NE: [], NW: [], SE: [], SW: [] });
}

// Requisito 10
function getSchedule(dayName) {
  const allDays = Object.entries(hours).reduce((acc, [day, { open, close }]) => {
    acc[day] = open === close
      ? 'CLOSED'
      : `Open from ${open}am until ${close - 12}pm`;
    return acc;
  }, {});
  return dayName ? { [dayName]: allDays[dayName] } : allDays;
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

// Requisito 13
function getEmployeeCoverage(idOrName) {
  const allEmployees = employees.reduce((acc, { firstName, lastName, responsibleFor }) => {
    const fullName = `${firstName} ${lastName}`;
    acc[fullName] = responsibleFor.map((currentId) =>
      species.find(({ id }) =>
        id === currentId).name);
    return acc;
  }, {});
  if (!idOrName) {
    return allEmployees;
  }
  const { firstName, lastName } = employees.find(({ firstName: a, lastName: b, id }) =>
    a === idOrName || b === idOrName || id === idOrName);
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
