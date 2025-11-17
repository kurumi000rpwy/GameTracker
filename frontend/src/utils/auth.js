export async function isLoggedIn() {
	  try {
		      const res = await fetch("https://spectra-8r7j.onrender.com/api/userinfo", {
			            credentials: "include", // importante: envía las cookies
			          });
		      const data = await res.json();
		      return data.success; // true si el token es válido
		    } catch {
			        return false;
			      }
}
