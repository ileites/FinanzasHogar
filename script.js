// Selecciona los elementos del DOM que necesitamos manipular
const mainContent = document.getElementById('main-content');
const sidebarItems = document.querySelectorAll('.sidebar li');

let transacciones = JSON.parse(localStorage.getItem('transacciones')) || []; // Carga transacciones
let categorias = JSON.parse(localStorage.getItem('categorias')) || []; // Carga categorías

// Función para guardar los datos en localStorage
function guardarDatos() {
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
    localStorage.setItem('categorias', JSON.stringify(categorias));
}


//funcion para cargar una pagina
async function loadPage(pageName) {
    try {
        const response = await fetch(`${pageName}.html`);
        const html = await response.text();
        mainContent.innerHTML = html;

        // **AQUÍ ES DONDE RECONECTAMOS LA LÓGICA DEL DASHBOARD**
        if (pageName === 'dashboard') {
            // Re-seleccionar los elementos del DOM que se acaban de cargar
            const formulario = document.getElementById('formulario-transaccion');
            const listaTransacciones = document.getElementById('lista');
            const ingresosTotalSpan = document.getElementById('ingresos-total');
            const gastosTotalSpan = document.getElementById('gastos-total');
            const saldoActualSpan = document.getElementById('saldo-actual');

            // Lógica para guardar datos
            function guardarDatos() {
                localStorage.setItem('transacciones', JSON.stringify(transacciones));
                localStorage.setItem('categorias', JSON.stringify(categorias));
            }

            // Lógica para actualizar totales
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
            
            // Lógica para mostrar transacción
            function mostrarTransaccion(transaccion) {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span>${transaccion.descripcion}</span>
                    <span class="${transaccion.tipo}">${transaccion.tipo === 'ingreso' ? '+' : '-'}$${transaccion.monto}</span>
                    <span>(${transaccion.categoria || 'Sin categoría'})</span>
                `;
                listaTransacciones.appendChild(li);
            }

            // Maneja el envío del formulario
            formulario.addEventListener('submit', (e) => {
                e.preventDefault();

                const descripcion = document.getElementById('descripcion').value;
                const monto = document.getElementById('monto').value;
                const tipo = document.getElementById('tipo').value;
                const categoria = document.getElementById('categoria').value;

                if (descripcion && monto) {
                    const nuevaTransaccion = {
                        descripcion,
                        monto: parseFloat(monto),
                        tipo,
                        categoria
                    };

                    transacciones.push(nuevaTransaccion);
                    guardarDatos();
                    mostrarTransaccion(nuevaTransaccion);
                    actualizarTotales();
                    formulario.reset();
                }
            });

            // Cargar las transacciones al iniciar el dashboard
            cargarTransacciones();
        }
    } catch (error) {
        console.error('Error al cargar la página:', error);
        mainContent.innerHTML = '<p>Error al cargar la página. Por favor, inténtelo de nuevo.</p>';
    }
}


// Manejar los clics en la barra lateral
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        // Remover la clase 'active' de todos los elementos
        sidebarItems.forEach(i => i.classList.remove('active'));
        // Añadir la clase 'active' al elemento clicado
        item.classList.add('active');

        const pageName = item.getAttribute('data-page');
        loadPage(pageName);
    });
});

// Cargar la página de inicio por defecto (el dashboard)
loadPage('dashboard');
/*
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
*/
