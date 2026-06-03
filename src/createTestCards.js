const TYPES = ["E", "S", "P", "M", "D", "B"];

const SAMPLE_CLIENTS = ["Martínez", "García", "López", "Hernández", "Ramírez", "Torres", "Flores"];
const SAMPLE_OBRAS   = ["Bodega Norte", "Planta GDL", "Almacén Central", "Nave Industrial", "Oficinas MTY"];
const SAMPLE_EQUIPOS = ["1Dem", "2Dem", "Bailarinas", "Montacargas", "Grúa"];

function pick(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function buildCard(type, date, index) {
  const withObra  = ["E", "S", "M"].includes(type);
  const withEquipo = ["E", "S", "M", "P"].includes(type);
  return {
    id: crypto.randomUUID(),
    date,
    index,
    type,
    clienteMin: type !== "B" ? pick(SAMPLE_CLIENTS) : "",
    obraMin:    withObra   ? pick(SAMPLE_OBRAS)   : "",
    equipo:     withEquipo ? pick(SAMPLE_EQUIPOS) : "",
    notas: "",
  };
}

export function createTestCards(data, currWeek, restartIndexes, saveTasks, setData) {
  TYPES.forEach((type) => {
    const dayIdx = Math.floor(Math.random() * 7);
    const date = currWeek[dayIdx];
    if (!date) return;
    data[dayIdx].push(buildCard(type, date, data[dayIdx].length));
  });
  restartIndexes();
  saveTasks(data.flat());
  setData([...data]);
}
