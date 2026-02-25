import { useState } from "react";
import "./App.css";

import MobileShell from "./layout/MobileShell/mobileSell";
import AppRoutes from "./routes";

function App() {
  const [count, setCount] = useState(0);

  return (
    <MobileShell>
      <AppRoutes />
    </MobileShell>
  );
}

export default App;
