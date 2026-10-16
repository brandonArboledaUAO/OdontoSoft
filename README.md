# 🦷 OdontoSoft — Sistema de gestión para consultorio odontológico

Aplicación web desarrollada bajo el marco ágil **Scrum**, con arquitectura de **tres capas**
(presentación, lógica de negocio y datos), conforme al Informe 2 de Arquitectura de Software.

- **Frontend (presentación):** HTML + CSS + JavaScript (sin frameworks).
- **Backend (lógica de negocio):** Python + FastAPI (API REST).
- **Base de datos (datos):** MongoDB + GridFS (para archivos adjuntos).
- **Seguridad:** autenticación con JWT, contraseñas con BCrypt y control de acceso por roles (RBAC).

## Módulos (según los requisitos del SRS)
| Módulo | Requisitos | Rol que lo usa |
|---|---|---|
| Autenticación y control de acceso | RF-01 a RF-03 | Todos |
| Gestión de pacientes | RF-04 a RF-06 | Recepcionista, Odontóloga |
| Agendamiento de citas | RF-07 a RF-09 | Recepcionista, Odontóloga |
| Historia clínica + odontograma | RF-10 a RF-15 | Odontóloga |
| Administración de usuarios | RF-16 | Administrador |

---

## ✅ Requisitos previos
1. **Python 3.11 o superior**
2. **MongoDB 6.0+** corriendo en `localhost:27017` (MongoDB Community + opcionalmente MongoDB Compass).

## 🚀 Puesta en marcha (paso a paso)

```bash
# 1. Entrar a la carpeta del backend
cd OdontoSoft/backend

# 2. Crear y activar un entorno virtual
python -m venv venv
# Windows:
venv\Scripts\activate
# Linux/Mac:
source venv/bin/activate

# 3. Instalar dependencias
pip install -r requirements.txt

# 4. Verificar MongoDB
#    Asegúrese de que el servicio de MongoDB esté activo.
#    La base de datos se define en el archivo .env (DATABASE_NAME=base_Odontosoft).
#    Si desea usar la base que creó en Compass (base_OdontoSort),
#    cambie DATABASE_NAME en .env a: base_OdontoSort

# 5. Cargar los datos iniciales (3 usuarios + 3 pacientes + odontograma + citas)
python seed.py

# 6. Iniciar el servidor
uvicorn main:app --reload
# opcion adicional
python -m uvicorn main:app --reload

```

Luego abra en el navegador: **http://localhost:8000**

> El backend sirve también el frontend. La documentación interactiva de la API
> (Swagger) queda disponible en **http://localhost:8000/docs**.

## 👤 Usuarios de prueba
| Rol | Correo | Contraseña |
|---|---|---|
| Odontóloga | odontologa@odontosoft.com | Odonto123 |
| Recepcionista | recepcion@odontosoft.com | Recepcion123 |
| Administrador | admin@odontosoft.com | Admin123 |

## 🦷 Odontograma
- 32 dientes permanentes en notación **FDI**, organizados en 4 cuadrantes.
- Estados (con código de color tomado de las convenciones del odontograma):
  Sano, Caries (rojo), Obturado/Resina (azul), Sellante (amarillo), Corona (morado),
  En tratamiento (naranja), Para extracción (rosa) y Ausente (gris).
- Interacción por **manipulación directa**: se selecciona un estado en la paleta y se
  hace clic sobre cada diente. La valoración queda **inmutable** una vez registrada.

## 📁 Estructura del proyecto
```
OdontoSoft/
├── backend/
│   ├── core/        # config, conexión a Mongo, seguridad (JWT, BCrypt, RBAC)
│   ├── models/      # nombres de colecciones
│   ├── schemas/     # validación de datos (Pydantic)
│   ├── services/    # lógica de negocio de cada módulo
│   ├── routers/     # endpoints de la API REST
│   ├── utils/       # utilidades y validadores
│   ├── main.py      # aplicación FastAPI (incluye routers + sirve el frontend)
│   ├── seed.py      # carga de datos iniciales
│   └── .env         # variables de entorno
└── frontend/
    ├── css/         # estilos
    ├── js/          # api, layout, odontograma y lógica de cada página
    └── *.html       # login, dashboard, pacientes, citas, historia, usuarios
```

## 🛠️ Notas técnicas
- Las contraseñas se cifran con **BCrypt** usando la librería `bcrypt` directamente
  (más robusto que `passlib` frente a las versiones recientes de bcrypt).
- En producción se recomienda un **proxy inverso (Caddy)** con HTTPS delante de Uvicorn,
  tal como se describe en el Informe 2 de Arquitectura.
- Las colecciones (`usuarios`, `pacientes`, `citas`, `historias`) se crean automáticamente
  al ejecutar `seed.py`.
