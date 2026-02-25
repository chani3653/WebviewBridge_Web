import { Routes, Route } from "react-router-dom";

import Home from "../pages/home/Home";
import Playground from "../pages/Playground/Playground";
import Console from "../pages/Console/Console";
import NotFound from "../pages/NotFound/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/playground" element={<Playground />} />
      <Route path="/console" element={<Console />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
