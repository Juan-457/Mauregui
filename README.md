# Mauregui Automotores · App interna (MVP)

Esta carpeta contiene una app estática para gestionar inventario, gastos por vehículo y costos fijos con sincronización hacia SharePoint mediante Power Automate.

## Configuración rápida

1. Copiar `app/config.example.js` a `app/config.js` y completar:
   - `PASSWORD` (acceso temporal).
   - URLs de los webhooks de Power Automate.
2. Abrir `index.html` o desplegar en GitHub Pages.
3. Ingresar a `/app/` desde el botón **APP** del sitio principal.

## Estructura de datos en SharePoint Lists

Crear tres listas en SharePoint:

### 1) Vehicles (Inventario)
Campos sugeridos:
- `Title` (texto) → usar para `licensePlate` (patente).
- `brand` (texto)
- `model` (texto)
- `year` (número)
- `purchaseCost` (número)
- `salePrice` (número)
- `status` (opciones: Salon, Reservado, Vendido)
- `notes` (texto multilínea)
- `createdBy` (texto)
- `timestamp` (fecha/hora)

### 2) VehicleExpenses (Gastos)
Campos sugeridos:
- `Title` (texto) → usar para `licensePlate`.
- `date` (fecha)
- `category` (opciones)
- `amount` (número)
- `provider` (texto)
- `paymentMethod` (texto)
- `invoiceNumber` (texto)
- `notes` (texto multilínea)
- `createdBy` (texto)
- `timestamp` (fecha/hora)

### 3) FixedCosts (Costos fijos)
Campos sugeridos:
- `Title` (texto) → usar para `month`.
- `category` (opciones)
- `amount` (número)
- `notes` (texto multilínea)
- `createdBy` (texto)
- `timestamp` (fecha/hora)

## Power Automate: flujos sugeridos

Crear tres flujos (uno por lista) con estos pasos:

1. **Trigger:** When a HTTP request is received.
2. **Schema JSON:** usar los objetos que se envían desde la app.
3. **Action:** Create item (SharePoint).
4. Mapear campos del JSON a columnas de la lista.
5. Copiar la URL del webhook en `app/config.js`.

### JSON esperado

Vehículo:
```json
{
  "type": "vehicle",
  "licensePlate": "AA123BB",
  "brand": "Ford",
  "model": "Focus",
  "year": 2021,
  "purchaseCost": 12000000,
  "salePrice": 14500000,
  "status": "Salon",
  "notes": "",
  "createdBy": "Usuario",
  "timestamp": "ISO8601"
}
```

Gasto de vehículo:
```json
{
  "type": "vehicle_expense",
  "licensePlate": "AA123BB",
  "date": "YYYY-MM-DD",
  "category": "Combustible",
  "amount": 25000,
  "provider": "",
  "paymentMethod": "",
  "invoiceNumber": "",
  "notes": "",
  "createdBy": "Usuario",
  "timestamp": "ISO8601"
}
```

Costo fijo:
```json
{
  "type": "fixed_cost",
  "month": "YYYY-MM",
  "category": "Alquiler",
  "amount": 500000,
  "notes": "",
  "createdBy": "Usuario",
  "timestamp": "ISO8601"
}
```

## Despliegue en GitHub Pages

1. Subir este repositorio a GitHub.
2. Settings → Pages → seleccionar la rama principal y carpeta raíz (`/`).
3. Guardar. La app quedará disponible en `https://TU_USUARIO.github.io/TU_REPO/app/`.

## Notas funcionales

- Los datos se guardan localmente (localStorage) y se envían al webhook.
- Si un envío falla, el registro queda como **Pendiente** y se puede reintentar.
- La validación de gastos para vehículos vendidos permite cargar gastos hasta fin del mes siguiente a la fecha de venta (configurable en el vehículo).
