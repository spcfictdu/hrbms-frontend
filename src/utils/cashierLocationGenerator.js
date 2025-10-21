const floors = [
  "Basement",
  "First Floor",
  "Second Floor",
  "Third Floor",
  "Fourth Floor",
  "Fifth Floor",
  "Sixth Floor",
  "Seventh Floor",
  "Eighth Floor",
  "Ninth Floor",
  "Tenth Floor",
  "Roof",
  "Sub-Basement",
  "Mezzanine",
];
const areas = [
  "Lobby",
  "Office",
  "Store Room",
  "Restaurant",
  "Kitchen",
  "Elevator Area",
  "Conference Room",
  "Break Room",
  "Reception",
  "Warehouse",
  "Lab",
  "Gym",
  "Atrium",
];

function createSeededRandom(seed) {
  return function () {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };
}

export function* generateCashierLocation(n = null) {
  /**
   * Generate randomized locations for cashier drawers.
   *
   * @param {number|null} n - Number of locations to generate. If null, generates infinitely (use in a loop).
   * @yields {string} Format like "Floor Area"
   */
  const random = createSeededRandom(42); // Fixed seed for reproducibility
  let counter = 1;
  while (true) {
    if (n !== null && counter > n) {
      break;
    }
    let location;
    if (counter === 1) {
      location = "First Floor Lobby";
    } else {
      const floorIndex = Math.floor(random() * floors.length);
      const areaIndex = Math.floor(random() * areas.length);
      const floor = floors[floorIndex];
      const area = areas[areaIndex];
      location = `${floor} ${area}`;
    }
    yield location;
    counter++;
  }
}
