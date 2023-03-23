import "./App.css";
import Column from "./Column";

const data = [
  {
    date: "2023-03-27",
    tasks: [
      { index: 0, clienteMin: "Cliente1", obraMin: "Obra1" },
      { index: 1, clienteMin: "Cliente2", obraMin: "Obra2" },
    ],
  },
  {
    date: "2023-03-28",
    tasks: [
      { index: 0, clienteMin: "Cliente1", obraMin: "Obra1" },
      { index: 1, clienteMin: "Cliente2", obraMin: "Obra2" },
    ],
  },
];
function App() {
  return (
    <div className="app">
      {data.map((day, i) => (
        <Column key={i} date={day.date} tasks={day.tasks} />
      ))}
    </div>
  );
}

export default App;
