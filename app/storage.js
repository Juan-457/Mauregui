const Storage = (() => {
  const STORAGE_KEYS = {
    vehicles: "vehicles",
    expenses: "vehicleExpenses",
    fixedCosts: "fixedCosts"
  };

  const load = (key) => {
    try {
      const raw = localStorage.getItem(key);
      if (!raw) {
        return [];
      }
      return JSON.parse(raw);
    } catch (error) {
      console.error("Storage load error", error);
      return [];
    }
  };

  const save = (key, data) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const createId = () => `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  const getVehicles = () => load(STORAGE_KEYS.vehicles);
  const getExpenses = () => load(STORAGE_KEYS.expenses);
  const getFixedCosts = () => load(STORAGE_KEYS.fixedCosts);

  const setVehicles = (vehicles) => save(STORAGE_KEYS.vehicles, vehicles);
  const setExpenses = (expenses) => save(STORAGE_KEYS.expenses, expenses);
  const setFixedCosts = (costs) => save(STORAGE_KEYS.fixedCosts, costs);

  return {
    createId,
    getVehicles,
    getExpenses,
    getFixedCosts,
    setVehicles,
    setExpenses,
    setFixedCosts
  };
})();
