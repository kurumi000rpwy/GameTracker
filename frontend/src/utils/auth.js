export async function isLoggedIn() {
	  try {
		      const res = await fetch("http://localhost:8080/api/userinfo", {
			            credentials: "include", // importante: envía las cookies
			          });
		      const data = await res.json();
		      return data.success; // true si el token es válido
		    } catch {
			        return false;
			      }
}
