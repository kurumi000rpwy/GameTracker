import { BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Games from "./pages/Games";
import GameDetail from "./pages/GameDetail";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { isLoggedIn }  from "./utils/auth";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
	  const [auth, setAuth] = useState(null);

	  useEffect(() => {
		      (async () => setAuth(await isLoggedIn()))();
		    }, []);

	  if (auth === null) return <p>Cargando...</p>
	  return (
		      <BrowserRouter>
		        <Routes>
		          <Route path="/" element={<Home />} />
			  <Route path="/register" element={<Register />}/>
		  	  <Route path="/games" element={<Games />}/>
			  <Route path="/games/:id" element={<GameDetail />}/>		  	  

			  <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
		          <Route path="/login" element={<Login />} />
			  {/* Ruta para cuando no se encuentra la página */}
		          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
		        </Routes>
		      </BrowserRouter>
		    );
}

export default App;
