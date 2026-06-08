# ParkControl - Testing y Validaciones (Actividad U3 - BDD & AAA)
<img width="120" height="67" alt="image" src="https://github.com/user-attachments/assets/9ab50188-6712-4a50-ab1f-4dc684d6704a" /><br/>
Maestría en Arquitectura de Software <br/>
Hecho por: **Yerlinson Maturana Serna** <br/>

<img width="1298" height="806" alt="image" src="https://github.com/user-attachments/assets/12e22253-99de-4edd-bae2-8bbd141344ab" />

ParkControl es un proyecto Node.js para administrar la operacion basica de un parqueadero publico en Colombia: ingresos, salidas, disponibilidad por tipo de vehiculo, liquidacion, factura en COP e historial reciente.

## Funcionalidades

- Registro de ingreso por placa, tipo de vehiculo y propietario opcional.
- Control de cupos para automoviles, motocicletas y bicicletas.
- Bloqueo de placas duplicadas con tiquete abierto.
- Liquidacion por minutos, tarifa minima, tope diario e IVA del 19%.
- Generacion de factura basica en pesos colombianos.
- Dashboard web con ocupacion, tiquetes abiertos e historial.
- Pruebas unitarias automatizadas con `node:test`.
- Reporte de cobertura con `--experimental-test-coverage`.

## Requisitos

- Node.js 22 o superior.
- No requiere instalar dependencias externas.

## Ejecucion

```bash
npm start
```

Luego abrir:

```text
http://localhost:3000
```

## Pruebas

```bash
npm test
```

## Cobertura

```bash
npm run coverage
```

Resultado verificado:

```text
tests 15
pass 15
fail 0
coverage all files: 94.49% lineas, 90.28% ramas, 91.67% funciones
```

## Estructura

```text
src/domain/              Reglas de negocio y calculo tarifario
src/server/              Servidor HTTP y utilidades API
src/storage/             Persistencia JSON local
public/                  Interfaz web
test/                    Pruebas unitarias automatizadas
docs/                    Plan, trazabilidad y evidencia de pruebas
data/                    Archivo JSON generado por la aplicacion
```

## Componentes principales

- `ParkingLot`: administra cupos, tiquetes abiertos, cierres e historial.
- `tariffCalculator`: normaliza placas, valida tipos de vehiculo y calcula cobros.
- `JsonStore`: guarda y lee el estado del parqueadero en `data/parking-lot.json`.
- `app.js`: expone API HTTP y sirve la interfaz web.

## Factura de tirilla

Al liquidar una salida, ParkControl muestra una factura tipo tirilla con formato de recibo termico. El boton `Imprimir tirilla` abre una ventana de impresion optimizada para papel de 80 mm, incluyendo placa, tipo de vehiculo, entrada, salida, tiempo, subtotal, IVA y total.

## Endpoints

- `GET /api/dashboard`: ocupacion, tiquetes abiertos, historial y tarifas.
- `POST /api/entries`: registra entrada.
- `POST /api/exits`: liquida y cierra salida.

Ejemplo de entrada:

```json
{
  "plate": "ABC123",
  "vehicleType": "car",
  "ownerName": "Ana Perez"
}
```

Ejemplo de salida:

```json
{
  "plate": "ABC123"
}
```
