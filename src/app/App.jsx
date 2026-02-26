import { useState } from "react";
import "./App.css";

import MobileShell from "./layout/MobileShell/mobileSell";
import AppRoutes from "./routes";
import Providers from "./providers";

function App() {
  const [count, setCount] = useState(0);

  return (
    <Providers>
      <MobileShell>
        <AppRoutes />
      </MobileShell>
    </Providers>
  );
}

export default App;
