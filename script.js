// Este es el único elemento del DOM que necesitamos al inicio
const mainContent = document.getElementById('main-content');
const sidebarItems = document.querySelectorAll('.sidebar li');

// Carga de datos inicial desde localStorage
let transacciones = JSON.parse(localStorage.getItem('transacciones')) || [];
let categorias = JSON.parse(localStorage.getItem('categorias')) || [];
let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
let subcategorias = JSON.parse(localStorage.getItem('subcategorias')) || [];

// Función para guardar los datos en localStorage
function guardarDatos() {
    localStorage.setItem('transacciones', JSON.stringify(transacciones));
    localStorage.setItem('categorias', JSON.stringify(categorias));
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    localStorage.setItem('subcategorias', JSON.stringify(subcategorias));
}

// Función para cargar una página dinámicamente
async function loadPage(pageName) {
    try {
        const response = await fetch(`${pageName}.html`);
        const html = await response.text();
        mainContent.innerHTML = html;

        // Lógica que se ejecuta solo si la página cargada es el dashboard
        if (pageName === 'dashboard') {
            // Re-seleccionar los elementos del DOM después de que se han cargado
            const formulario = document.getElementById('formulario-transaccion');
            const listaTransacciones = document.getElementById('lista');
            const ingresosTotalSpan = document.getElementById('ingresos-total');
            const gastosTotalSpan = document.getElementById('gastos-total');
            const saldoActualSpan = document.getElementById('saldo-actual');
            const categoriaSelect = document.getElementById('categoria');

            // Llenar el <select> de categorías con los datos guardados
            // Esto es crucial para que las categorías que crees aparezcan en el formulario
            categorias.forEach(cat => {
                const option = document.createElement('option');
                option.value = cat.nombre;
                option.textContent = cat.nombre;
                categoriaSelect.appendChild(option);
            });
            
            // Lógica para actualizar los totales y el saldo
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
            
            // Lógica para mostrar una transacción en la lista
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
            transacciones.forEach(mostrarTransaccion);
            actualizarTotales();
        } else if (pageName === 'categorias') {
            // Lógica para la página de categorías (la crearemos más adelante)
            console.log('Cargando la página de Categorías...');
        } else if (pageName === 'usuarios') {
            // Lógica para la página de usuarios (la crearemos más adelante)
            console.log('Cargando la página de Usuarios...');
        }
        
    } catch (error) {
        console.error('Error al cargar la página:', error);
        mainContent.innerHTML = '<p>Error al cargar la página. Por favor, inténtelo de nuevo.</p>';
    }
}

// Manejar los clics en la barra lateral
sidebarItems.forEach(item => {
    item.addEventListener('click', () => {
        sidebarItems.forEach(i => i.classList.remove('active'));
        item.classList.add('active');
        const pageName = item.getAttribute('data-page');
        loadPage(pageName);
    });
});

// Cargar la página de inicio por defecto
loadPage('dashboard');
