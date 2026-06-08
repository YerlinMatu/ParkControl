# Evidencia de ejecucion de pruebas de ParkControl

Fecha de verificacion: 2026-06-08

## Comando de pruebas

```bash
npm test
```

Resultado:

```text
tests 15
suites 3
pass 15
fail 0
cancelled 0
skipped 0
todo 0
```

## Comando de cobertura

```bash
npm run coverage
```

Resultado:

```text
file                           | line % | branch % | funcs %
src/domain/parkingLot.js       |  94.59 |    87.50 |   87.50
src/domain/tariffCalculator.js |  95.00 |    76.92 |  100.00
src/server/httpUtils.js        |  65.63 |    85.71 |   33.33
all files                      |  94.49 |    90.28 |   91.67
```

## Interpretacion

La cobertura global de lineas es 94.49%, superior al 75% solicitado en la guia. Las pruebas se concentran en reglas de negocio criticas para evitar regresiones en calculo de tarifas, control de cupos, duplicidad de placas y liquidacion de salidas.

La utilidad `httpUtils` tiene menor cobertura individual porque las funciones de respuesta HTTP se validan indirectamente desde el servidor en ejecucion, mientras que la lectura y validacion de JSON si cuenta con pruebas unitarias directas.
