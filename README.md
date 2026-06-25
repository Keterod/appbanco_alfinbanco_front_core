# Banco Alfin — Front Core React

Front-end en **React + Vite** para el comité de crédito / backoffice de Banco Alfin.
Consume el backend **Core API FastAPI**.

> Sistema interno · uso exclusivo del comité de crédito.
> La App Fuerza de Ventas (Flutter) es un proyecto aparte.

## Arquitectura del sistema

```txt
App Clientes (Flutter)
  └── registra solicitud → Supabase directo (temporal)
  └── en futuro → Core API FastAPI

App Fuerza de Ventas (Flutter)
  └── reclama expediente → Supabase directo (temporal)
  └── completa datos y valida negocio
  └── en futuro → Core API FastAPI

Front Core React  ←  ESTE PROYECTO
  └── comité revisa y decide
  └── consume Core API FastAPI

Core API FastAPI
  └── auth · solicitudes · reclamos · aprobación
  └── condición · rechazo · desembolso · créditos
  └── cronograma · dashboard · reportes
  └── puente entre React y la base de datos
```

## Flujo funcional

| Paso | App | Acción |
|------|-----|--------|
| 1 | App Clientes | Cliente registra solicitud de crédito. Queda en estado `enviada`. |
| 2 | App Fuerza de Ventas | Asesor ve solicitudes, reclama el expediente, completa datos faltantes, valida información del negocio y lo deja listo para evaluación. |
| 3 | Front Core React | Comité/analista backoffice revisa el expediente y toma la decisión final. |
| 4 | Front Core React | Acciones posibles: `aprobar`, `condicionar` (monto menor), `rechazar`, `desembolsar`. |

## Estados de solicitud

| Estado | Significado |
|--------|-------------|
| `enviada` | Cliente registró la solicitud desde la app |
| `aprobada` | Comité aprobó la solicitud |
| `condicionada` | Comité aprobó con monto menor |
| `rechazada` | Comité rechazó la solicitud |
| `desembolsada` | Crédito desembolsado |

## Elegibilidad

| Valor | Significado |
|-------|-------------|
| `APTO` | Cliente califica para el crédito solicitado |
| `CONDICIONADO` | Cliente califica con condiciones (monto menor, garantía, etc.) |
| `NO APTO` | Cliente no califica para el crédito |

## Puesta en marcha

```powershell
npm install
copy .env.example .env
npm run dev
```

Abrir http://localhost:5173

### Modo demo (sin backend)

| Código | Contraseña |
|--------|------------|
| `OFI001` | `alfin123` |

Para conectar con FastAPI real:

```env
VITE_USE_MOCKS=false
VITE_API_BASE_URL=http://localhost:8003
```

## Estructura del proyecto

```
src/
  main.jsx                 Punto de entrada (Router + AuthProvider)
  App.jsx                  Rutas públicas/privadas
  index.css                Tema Banco Alfin + estilos del portal
  context/AuthContext.jsx   Sesión del asesor (JWT en localStorage)
  services/
    api.js                 Axios central (Bearer + manejo de 401)
    contracts.js           Contratos de datos para la API
    authService.js         Login + perfil
    carteraService.js      Cartera del día
    clientesService.js     Ficha de cliente + créditos
    solicitudesService.js  Solicitudes de crédito + flujo completo
    evaluacionService.js   Pre-evaluación + buró
    cobranzaService.js     Gestión de mora
    reportesService.js     Productividad
  mocks/
    mockSolicitudes.js     Datos mock de solicitudes
    mockClientes.js        Datos mock de clientes
    mockCreditos.js        Datos mock de créditos
    mockAsesor.js          Datos mock del asesor
    mockDashboard.js       Datos mock del dashboard
  components/
    layout/  Header (topbar + pestañas)  PrivateRoute  PageHead
    ui/      Logo  Alert  Badge  Money  Loader  Card  Modal
  pages/
    LoginPage  DashboardPage  CarteraPage  FichaClientePage
    SolicitudesPage  NuevaSolicitudPage  EvaluacionPage
    CobranzaPage  ReportesPage
  utils/format.js          Moneda, fechas, porcentajes, errores
```

## Endpoints FastAPI

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Inicio de sesión |
| GET | `/auth/me` | Perfil del usuario |
| GET | `/solicitudes` | Listar solicitudes |
| GET | `/solicitudes/:id` | Detalle de solicitud |
| POST | `/solicitudes` | Crear solicitud |
| POST | `/solicitudes/:id/reclamar` | Reclamar expediente |
| POST | `/solicitudes/:id/aprobar` | Aprobar solicitud |
| POST | `/solicitudes/:id/condicionar` | Condicionar solicitud |
| POST | `/solicitudes/:id/rechazar` | Rechazar solicitud |
| POST | `/solicitudes/:id/desembolsar` | Desembolsar crédito |
| GET | `/clientes/:id/ficha` | Ficha del cliente |
| GET | `/clientes/:id/creditos` | Créditos del cliente |
| GET | `/creditos/:id/cronograma` | Cronograma de pagos |
| GET | `/cartera` | Cartera del día |
| POST | `/cartera/:id/visita` | Registrar visita |
| GET | `/dashboard/resumen` | Dashboard con KPIs |
| POST | `/pre-evaluar` | Pre-evaluación crediticia |
| POST | `/buro/consulta` | Consulta de buró |
| GET | `/cobranza/mora` | Mora del día |
| POST | `/cobranza/accion` | Registrar gestión de cobranza |
| GET | `/reportes/productividad` | Reporte de productividad |

## Notas

- **App Fuerza de Ventas (Flutter)**: prepara el expediente, no toma la decisión final.
- **Front Core React**: el comité de crédito toma la decisión final.
- **Core API FastAPI**: puente entre React y la base de datos. Centraliza auth, solicitudes, créditos y reportes.
- **Supabase directo**: las apps Flutter pueden seguir usándolo temporalmente mientras se completa la integración con FastAPI.
