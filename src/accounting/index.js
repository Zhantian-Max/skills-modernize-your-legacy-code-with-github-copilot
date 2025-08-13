// Sistema de Cuentas de Estudiantes - Node.js
// Preserva la lógica de negocio y el flujo de datos del sistema COBOL original

const readline = require('readline');

let saldo = 1000.00;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function mostrarMenu() {
  console.log('\n--- Sistema de Cuentas de Estudiantes ---');
  console.log('1. Ver saldo');
  console.log('2. Acreditar');
  console.log('3. Debitar');
  console.log('4. Salir');
  rl.question('Seleccione una opción: ', manejarOpcion);
}

function manejarOpcion(opcion) {
  switch (opcion.trim()) {
    case '1':
      verSaldo();
      break;
    case '2':
      rl.question('Ingrese el monto a acreditar: ', (monto) => acreditar(monto));
      break;
    case '3':
      rl.question('Ingrese el monto a debitar: ', (monto) => debitar(monto));
      break;
    case '4':
      console.log('Saliendo del sistema.');
      rl.close();
      break;
    default:
      console.log('Opción no válida. Intente de nuevo.');
      mostrarMenu();
  }
}

function verSaldo() {
  console.log(`Saldo actual: $${saldo.toFixed(2)}`);
  mostrarMenu();
}

function esNumeroPositivoEstricto(input) {
  // Solo acepta números positivos estrictos, sin letras ni símbolos extra
  return /^\d+(\.\d+)?$/.test(input);
}

function acreditar(monto) {
  if (!esNumeroPositivoEstricto(monto)) {
    console.log('Monto inválido. Debe ser un número positivo y solo numérico.');
  } else {
    const valor = parseFloat(monto);
    if (valor <= 0) {
      console.log('Monto inválido. Debe ser un número positivo.');
    } else {
      saldo += valor;
      console.log(`Monto acreditado: $${valor.toFixed(2)}`);
    }
  }
  mostrarMenu();
}

function debitar(monto) {
  if (!esNumeroPositivoEstricto(monto)) {
    console.log('Monto inválido. Debe ser un número positivo y solo numérico.');
  } else {
    const valor = parseFloat(monto);
    if (valor <= 0) {
      console.log('Monto inválido. Debe ser un número positivo.');
    } else if (valor > saldo) {
      console.log('Fondos insuficientes para realizar el débito.');
    } else {
      saldo -= valor;
      console.log(`Monto debitado: $${valor.toFixed(2)}`);
    }
  }
  mostrarMenu();
}

// Iniciar la aplicación
mostrarMenu();
