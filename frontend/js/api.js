/* ===== Cliente de la API + manejo de sesión ===== */
const API_BASE = "http://localhost:8000";

function getToken(){ return sessionStorage.getItem("token"); }
function getUser(){ try{ return JSON.parse(sessionStorage.getItem("user")); }catch(e){ return null; } }
function setSession(token, user){
  sessionStorage.setItem("token", token);
  sessionStorage.setItem("user", JSON.stringify(user));
}
function clearSession(){ sessionStorage.removeItem("token"); sessionStorage.removeItem("user"); }

async function api(path, opts){
  opts = opts || {};
  const headers = {};
  const token = getToken();
  if(token) headers["Authorization"] = "Bearer " + token;

  let body = opts.body || null;
  if(body && !opts.isForm){ headers["Content-Type"] = "application/json"; body = JSON.stringify(body); }

  const res = await fetch(API_BASE + path, { method: opts.method || "GET", headers, body });

  if(res.status === 401 && !path.startsWith("/auth/login")){
    clearSession();
    const p = location.pathname;
    if(!(p.endsWith("index.html") || p === "/" || p === "")) location.href = "index.html";
    throw { status:401, detail:"Sesión expirada" };
  }

  const ct = res.headers.get("content-type") || "";
  const data = ct.includes("application/json") ? await res.json() : await res.blob();
  if(!res.ok) throw { status: res.status, detail: (data && data.detail) || "Error en la solicitud" };
  return data;
}
