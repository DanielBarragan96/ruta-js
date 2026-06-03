const TYPES = ["E", "S", "P", "M", "D", "B"];

const SAMPLE_CLIENTS = ["Martínez", "García", "López", "Hernández", "Ramírez", "Torres", "Flores"];

export function createTestCards(data, currWeek, restartIndexes, saveTasks, setData) {
  TYPES.forEach((type) => {
    const dayIdx = Math.floor(Math.random() * 7);
    const date = currWeek[dayIdx];
    if (!date) return;
    data[dayIdx].push({
      id: crypto.randomUUID(),
      date,
      index: data[dayIdx].length,
      type,
      clienteMin: type !== "B" ? SAMPLE_CLIENTS[Math.floor(Math.random() * SAMPLE_CLIENTS.length)] : "",
      obraMin: "",
      equipo: "",
      notas: "",
    });
  });
  restartIndexes();
  saveTasks(data.flat());
  setData([...data]);
}
