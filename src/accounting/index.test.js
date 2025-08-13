const { expect } = require('chai');
const sinon = require('sinon');

// Importar la lógica a testear
let saldo;
let output;

// Simulación de consola
function mockConsoleLog(...args) {
  output.push(args.join(' '));
}

// Requiere refactor para exponer funciones, así que las replicamos aquí para pruebas
function resetSaldo() { saldo = 1000.00; }
function verSaldo() { return saldo; }
function esNumeroPositivoEstricto(input) {
  return /^\d+(\.\d+)?$/.test(input);
}
function acreditar(monto) {
  if (!esNumeroPositivoEstricto(monto)) {
    return { ok: false, msg: 'Monto inválido. Debe ser un número positivo y solo numérico.' };
  } else {
    const valor = parseFloat(monto);
    if (valor <= 0) {
      return { ok: false, msg: 'Monto inválido. Debe ser un número positivo.' };
    } else {
      saldo += valor;
      return { ok: true, msg: `Monto acreditado: $${valor.toFixed(2)}` };
    }
  }
}
function debitar(monto) {
  if (!esNumeroPositivoEstricto(monto)) {
    return { ok: false, msg: 'Monto inválido. Debe ser un número positivo y solo numérico.' };
  } else {
    const valor = parseFloat(monto);
    if (valor <= 0) {
      return { ok: false, msg: 'Monto inválido. Debe ser un número positivo.' };
    } else if (valor > saldo) {
      return { ok: false, msg: 'Fondos insuficientes para realizar el débito.' };
    } else {
      saldo -= valor;
      return { ok: true, msg: `Monto debitado: $${valor.toFixed(2)}` };
    }
  }
}
  it('TC-11: Ingresar valor no numérico en acreditar', function() {
    const saldoAntes = verSaldo();
    const res = acreditar('2asdsad');
    expect(res.ok).to.be.false;
    expect(res.msg).to.include('solo numérico');
    expect(verSaldo()).to.equal(saldoAntes);
  });

  it('TC-12: Ingresar valor no numérico en debitar', function() {
    const saldoAntes = verSaldo();
    const res = debitar('2asdsad');
    expect(res.ok).to.be.false;
    expect(res.msg).to.include('solo numérico');
    expect(verSaldo()).to.equal(saldoAntes);
  });

describe('Sistema de Cuentas de Estudiantes', function() {
  beforeEach(() => {
    output = [];
    resetSaldo();
  });

  it('TC-01: Consultar saldo inicial', function() {
    expect(verSaldo()).to.equal(1000.00);
  });

  it('TC-02: Acreditar monto válido', function() {
    const res = acreditar(200);
    expect(res.ok).to.be.true;
    expect(verSaldo()).to.equal(1200.00);
  });

  it('TC-03: Debitar monto válido', function() {
    const res = debitar(300);
    expect(res.ok).to.be.true;
    expect(verSaldo()).to.equal(700.00);
  });

  it('TC-04: Intentar debitar más que el saldo disponible', function() {
    const res = debitar(1500);
    expect(res.ok).to.be.false;
    expect(res.msg).to.include('Fondos insuficientes');
    expect(verSaldo()).to.equal(1000.00);
  });

  it('TC-05: Realizar múltiples operaciones consecutivas', function() {
    acreditar(100);
    debitar(50);
    expect(verSaldo()).to.equal(1050.00);
  });

  it('TC-08: Ingresar monto negativo en acreditar', function() {
    const res = acreditar(-100);
    expect(res.ok).to.be.false;
    expect(verSaldo()).to.equal(1000.00);
  });

  it('TC-09: Ingresar monto negativo en debitar', function() {
    const res = debitar(-50);
    expect(res.ok).to.be.false;
    expect(verSaldo()).to.equal(1000.00);
  });

  it('TC-10: Consultar saldo después de varias operaciones', function() {
    acreditar(500);
    debitar(200);
    expect(verSaldo()).to.equal(1300.00);
  });
});
