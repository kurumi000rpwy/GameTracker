import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { isLoggedIn } from "../utils/auth";

function ProtectedRoute({ children }) {
	  const [auth, setAuth] = useState(null);

	  useEffect(() => {
		      (async () => setAuth(await isLoggedIn()))();
		    }, []);

	  if (auth === null) return <p>Cargando...</p>;
	  return auth ? children : <Navigate to="/login" />;
}

export default ProtectedRoute;
