import { useLocalStorage, todayKey } from './useLocalStorage.js';

export function useDailyStore(name, initial = []) {
  const [rows, setRows] = useLocalStorage(`${name}:${todayKey()}`, initial);

  const add = (item) => {
    const row = { id: crypto.randomUUID(), ...item };
    setRows((current) => [...current, row]);
    return row;
  };

  const update = (id, patch) => {
    setRows((current) =>
      current.map((r) => (r.id === id ? { ...r, ...patch } : r))
    );
  };

  const remove = (id) => {
    setRows((current) => current.filter((r) => r.id !== id));
  };

  return { rows, add, update, remove, set: setRows };
}
