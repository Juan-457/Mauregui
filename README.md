# Mauregui

Repositorio del sitio y app interna MVP de Mauregui Automotores.

## Contenido

- `index.html`: sitio principal / landing de la marca.
- `app/index.html`: acceso a la app interna.
- `app/app.js`, `app/api.js`, `app/auth.js`, `app/storage.js`: logica del MVP.
- `app/config.example.js`: plantilla de configuracion.
- `app/config.js`: configuracion local de la app.
- `CNAME`, `sitemap.xml`: configuracion de publicacion.
- Videos e imagenes de marca en la raiz.

## Proposito de la app

La app interna permite gestionar:

- inventario de vehiculos
- gastos por vehiculo
- costos fijos

La sincronizacion operativa esta pensada hacia SharePoint mediante Power Automate.

## Configuracion rapida

1. Copiar `app/config.example.js` a `app/config.js` si hace falta regenerar la configuracion.
2. Completar password temporal y URLs de webhooks.
3. Abrir `index.html` para el sitio o `app/index.html` para la app.

## Integracion con SharePoint / Power Automate

La documentacion operativa original de este repo asume tres listas principales:

- `Vehicles`
- `VehicleExpenses`
- `FixedCosts`

Y tres flujos HTTP en Power Automate para crear items en esas listas a partir del JSON que envia la app.

## Verlo localmente

```bash
cd Mauregui
python3 -m http.server 8000
```

Abrir:

- `http://localhost:8000/` para el sitio
- `http://localhost:8000/app/` para la app

## Deploy

El proyecto se publica como sitio estatico. Mantener:

- `CNAME`
- la carpeta `app/` completa
- los assets multimedia usados por el home

## Notas

- `app/config.js` puede contener configuracion sensible; revisar antes de compartir o publicar forks.
- El README anterior incluia el detalle completo de listas y payloads; si se necesita volver a ese nivel de detalle, conviene documentarlo en un archivo tecnico separado.
