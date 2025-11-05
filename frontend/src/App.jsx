import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";

function App() {
	  return (
		      <BrowserRouter>
		        <Routes>
		          <Route path="/" element={<Home />} />
			  <Route path="/register" element={<Register />}/>
		  	
		          {/* Ruta para cuando no se encuentra la página */}
		          <Route path="*" element={<h1>404 - Página no encontrada</h1>} />
		        </Routes>
		      </BrowserRouter>
		    );
}

export default App;
