import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { ParkingLot } from '../src/domain/parkingLot.js';

describe('ParkingLot - Gestion de tiquetes', () => {
  it('Given cupos disponibles When se registra un ingreso Then crea un tiquete abierto', () => {
    const lot = new ParkingLot({ capacity: { car: 1, motorcycle: 1, bicycle: 1 } });

    const ticket = lot.registerEntry({
      plate: 'abc123',
      vehicleType: 'car',
      ownerName: 'Ana Perez',
      entryTime: '2026-06-08T08:00:00.000Z'
    });

    assert.equal(ticket.plate, 'ABC123');
    assert.equal(ticket.status, 'open');
    assert.equal(lot.getOccupancy().car.available, 0);
  });

  it('Given un vehiculo activo When intenta entrar otra vez Then evita duplicados', () => {
    const lot = new ParkingLot({ capacity: { car: 2, motorcycle: 1, bicycle: 1 } });
    lot.registerEntry({ plate: 'KLM456', vehicleType: 'car' });

    assert.throws(
      () => lot.registerEntry({ plate: 'klm456', vehicleType: 'car' }),
      /tiquete abierto/i
    );
  });

  it('Given cupos agotados When entra otro vehiculo del mismo tipo Then rechaza el ingreso', () => {
    const lot = new ParkingLot({ capacity: { car: 1, motorcycle: 1, bicycle: 1 } });
    lot.registerEntry({ plate: 'ABC123', vehicleType: 'car' });

    assert.throws(
      () => lot.registerEntry({ plate: 'DEF456', vehicleType: 'car' }),
      /No hay cupos/i
    );
  });

  it('Given un tiquete abierto When se cierra Then genera factura en COP', () => {
    const lot = new ParkingLot({ capacity: { car: 2, motorcycle: 1, bicycle: 1 } });
    lot.registerEntry({
      plate: 'QWE789',
      vehicleType: 'car',
      entryTime: '2026-06-08T08:00:00.000Z'
    });

    const closedTicket = lot.closeTicket({
      plate: 'qwe789',
      exitTime: '2026-06-08T09:00:00.000Z'
    });

    assert.equal(closedTicket.status, 'closed');
    assert.equal(closedTicket.invoice.currency, 'COP');
    assert.equal(closedTicket.invoice.number, 'FE-2026-1');
    assert.equal(lot.getOpenTickets().length, 0);
  });

  it('Given una placa sin tiquete abierto When se liquida Then informa que no existe', () => {
    const lot = new ParkingLot();

    assert.throws(
      () => lot.closeTicket({ plate: 'AAA111' }),
      /No existe/i
    );
  });

  it('Given varios movimientos When se consulta historial Then retorna los mas recientes primero', () => {
    const lot = new ParkingLot({ capacity: { car: 3, motorcycle: 3, bicycle: 3 } });
    lot.registerEntry({ plate: 'AAA111', vehicleType: 'car', entryTime: '2026-06-08T08:00:00.000Z' });
    lot.registerEntry({ plate: 'BBB222', vehicleType: 'motorcycle', entryTime: '2026-06-08T09:00:00.000Z' });

    const history = lot.getHistory();

    assert.equal(history[0].plate, 'BBB222');
    assert.equal(history[1].plate, 'AAA111');
  });
});
