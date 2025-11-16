import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import Favorites from "./pages/Favorites";
import Register from "./pages/Register";
import Games from "./pages/Games";
import GameDetail from "./pages/GameDetail";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { isLoggedIn }  from "./utils/auth";
import ProtectedRoute from "./components/ProtectedRoute";
import ProtectedAdminRoute from "./components/ProtectedAdminRoute";
import Adminz from "./pages/Adminz";
import AddGame from "./pages/AddGame";
import { useState, useEffect } from "react";

function App() {
	  const [auth, setAuth] = useState(null);

	  useEffect(() => {
		      (async () => {
			            const result = await isLoggedIn();
			            console.log("Estado de sesión:", result); // <-- útil para debug
			            setAuth(result);
			          })();
		    }, []);

	  if (auth === null) {
		      return <p>Cargando...</p>;
		    }

	  return (
		      <BrowserRouter>
		        <Routes>
		          <Route path="/" element={auth ? <Navigate to="/dashboard" /> : <Home />} />
			  <Route path="/login" element={auth ? <Navigate to="/dashboard" /> : <Login />} />
		  	  <Route path="/register" element={auth ? <Navigate to="/dashboard" /> : <Register />} />

		  	  <Route path="/games" element={<Games />}/>
			  <Route path="/games/:id" element={<GameDetail />}/>		  	  

			  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
			  <Route path="/favorites" element={<ProtectedRoute><Favorites /></ProtectedRoute>}/>

		  	  <Route path="/adminz/*" element={<ProtectedAdminRoute><Adminz /></ProtectedAdminRoute>}/>
		  	<Route path="/adminz/add/game" element={<ProtectedAdminRoute><AddGame /></ProtectedAdminRoute>} />
			  {/* Ruta para cuando no se encuentra la página */}
		          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
		        </Routes>
		      </BrowserRouter>
		    );
}

export default App;
