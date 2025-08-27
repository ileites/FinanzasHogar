// Selecciona los elementos del DOM que necesitamos manipular
const formulario = document.getElementById('formulario-transaccion');
const listaTransacciones = document.getElementById('lista');
const ingresosTotalSpan = document.getElementById('ingresos-total');
const gastosTotalSpan = document.getElementById('gastos-total');
const saldoActualSpan = document.getElementById('saldo-actual');

let transacciones = []; // Array para almacenar todas las transacciones

// Función para actualizar los totales y el saldo
function actualizarTotales() {
    const ingresos = transacciones
        .filter(t => t.tipo === 'ingreso')
        .reduce((total, t) => total + parseFloat(t.monto), 0);

    const gastos = transacciones
        .filter(t => t.tipo === 'gasto')
        .reduce((total, t) => total + parseFloat(t.monto), 0);

    const saldo = ingresos - gastos;

    ingresosTotalSpan.textContent = `$${ingresos.toFixed(2)}`;
    gastosTotalSpan.textContent = `$${gastos.toFixed(2)}`;
    saldoActualSpan.textContent = `$${saldo.toFixed(2)}`;
}

// Función para mostrar una transacción en la lista
function mostrarTransaccion(transaccion) {
    const li = document.createElement('li');
    li.innerHTML = `
        <span>${transaccion.descripcion}</span>
        <span class="${transaccion.tipo}">${transaccion.tipo === 'ingreso' ? '+' : '-'}$${transaccion.monto}</span>
    `;
    listaTransacciones.appendChild(li);
}

// Maneja el envío del formulario
formulario.addEventListener('submit', (e) => {
    e.preventDefault(); // Evita que la página se recargue

    const descripcion = document.getElementById('descripcion').value;
    const monto = document.getElementById('monto').value;
    const tipo = document.getElementById('tipo').value;

    if (descripcion && monto) {
        const nuevaTransaccion = {
            descripcion,
            monto: parseFloat(monto),
            tipo
        };

        transacciones.push(nuevaTransaccion);
        mostrarTransaccion(nuevaTransaccion);
        actualizarTotales();

        // Limpiar el formulario
        formulario.reset();
    }
});

// Inicializar la aplicación
actualizarTotales();
