// Selecciona los elementos del DOM que necesitamos manipular
const formulario = document.getElementById('formulario-transaccion');
const listaTransacciones = document.getElementById('lista');
const ingresosTotalSpan = document.getElementById('ingresos-total');
const gastosTotalSpan = document.getElementById('gastos-total');
const saldoActualSpan = document.getElementById('saldo-actual');

let transacciones = JSON.parse(localStorage.getItem('transacciones')) || []; // Carga transacciones
let categorias = JSON.parse(localStorage.getItem('categorias')) || []; // Carga categorías

// Función para guardar los datos en localStorage
function guardarDatos() {
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
    localStorage.setItem('categorias', JSON.stringify(categorias));
}

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
    const categoria = document.getElementById('categoria').value;

    if (descripcion && monto) {
        const nuevaTransaccion = {
            descripcion,
            monto: parseFloat(monto),
            tipo,
            categoria // Asumiendo que ya agregaste esto
        };

        transacciones.push(nuevaTransaccion);
        guardarDatos();
        mostrarTransaccion(nuevaTransaccion);
        
        actualizarTotales();
        

        // Limpiar el formulario
        formulario.reset();
    }
});

// Inicializar la aplicación
// actualizarTotales();


// Función para mostrar las transacciones al cargar la página
function cargarTransacciones() {
    transacciones.forEach(mostrarTransaccion);
    actualizarTotales();
}

// Llama a la función al iniciar la app
cargarTransacciones();
