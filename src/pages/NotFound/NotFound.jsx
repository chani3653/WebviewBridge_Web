import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div style={{ padding: 16 }}>
      <h3>404</h3>
      <Link to="/">Go Home</Link>
    </div>
  );
}
