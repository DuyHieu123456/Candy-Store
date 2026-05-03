// src/App.jsx
import AppRouter from "./routes/AppRouter";

function App() {
  // Chỉ cần trả về AppRouter, không để CartDrawer ở đây vì nó sẽ nằm ngoài Router[cite: 13]
  return <AppRouter />;
}

export default App;