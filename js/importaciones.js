// JavaScript para el módulo de importaciones
let registrosGlobal = [];
let registrosPaginados = [];
let paginaActual = 1;
const registrosPorPagina = 6;

// Funciones de paginación
function calcularPaginacion(registros) {
    const totalPaginas = Math.ceil(registros.length / registrosPorPagina);
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const fin = inicio + registrosPorPagina;
    registrosPaginados = registros.slice(inicio, fin);
    return totalPaginas;
}

function actualizarPaginacion(totalPaginas) {
    const paginationContainer = document.getElementById('paginationContainer');
    const paginationInfo = document.getElementById('paginationInfo');
    const btnPrimera = document.getElementById('btnPrimera');
    const btnAnterior = document.getElementById('btnAnterior');
    const btnSiguiente = document.getElementById('btnSiguiente');
    const btnUltima = document.getElementById('btnUltima');

    if (totalPaginas <= 1) {
        paginationContainer.style.display = 'none';
        return;
    }

    paginationContainer.style.display = 'flex';
    paginationInfo.textContent = `Página ${paginaActual} de ${totalPaginas}`;

    // Habilitar/deshabilitar botones
    btnPrimera.disabled = paginaActual === 1;
    btnAnterior.disabled = paginaActual === 1;
    btnSiguiente.disabled = paginaActual === totalPaginas;
    btnUltima.disabled = paginaActual === totalPaginas;
}

function irAPagina(pagina) {
    if (pagina < 1 || pagina > Math.ceil(registrosGlobal.length / registrosPorPagina)) {
        return;
    }
    paginaActual = pagina;
    const totalPaginas = calcularPaginacion(registrosGlobal);
    actualizarPaginacion(totalPaginas);
    renderizarTabla();
}

// Función para consumir la API
async function obtenerDatosAPI() {
    const api = "https://importacionesvr01crud-2946605267.us-central1.run.app";

    try {
        const response = await fetch(api);

        if (response.status === 200) {
            const datos = await response.text();
            console.log("Datos extraídos correctamente");
            return datos;
        } else {
            console.error("Error al extraer los datos");
            throw new Error(`Error HTTP: ${response.status}`);
        }
    } catch (error) {
        console.error("Error en la petición:", error);
        throw error;
    }
}

// Función para actualizar datos en la API
async function actualizarDatosAPI(datos) {
    const api = "https://importacionesvr01crud-2946605267.us-central1.run.app";
    const area = "importacion";

    try {
        console.log('Enviando petición PUT a:', api);
        console.log('Datos enviados:', JSON.stringify(datos, null, 2));

        const url = `${api}?area=${area}`;
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(datos)
        });

        console.log('Respuesta del servidor:', response.status, response.statusText);

        if (response.status === 200) {
            const resultado = await response.text();
            console.log("Datos actualizados correctamente");
            return resultado;
        } else {
            let errorMessage = `Error HTTP: ${response.status}`;
            try {
                const errorData = await response.text();
                console.error('Respuesta de error del servidor:', errorData);
                errorMessage += ` - ${errorData}`;
            } catch (e) {
                console.error('No se pudo leer el mensaje de error del servidor');
            }
            throw new Error(errorMessage);
        }
    } catch (error) {
        console.error("Error en la petición de actualización:", error);
        throw error;
    }
}

function cargarTablaImportaciones(filtrados = null) {
    const tbody = document.querySelector('#tablaImportaciones tbody');
    tbody.innerHTML = '<tr><td colspan="13" class="text-center">Cargando...</td></tr>';
    
    let ultimoId = localStorage.getItem('ultimoIdImportacion');

    const render = function (registros) {
        if (!Array.isArray(registros) || registros.length === 0) {
            tbody.innerHTML = '<tr><td colspan="13" class="text-center">Sin registros</td></tr>';
            actualizarPaginacion(0);
            return;
        }

        // Ordenar para que el registro con el ID más alto (último) esté primero
        if (registros.length > 1) {
            let maxId = Math.max(...registros.map(r => Number(r.ID_IMPORTACIONES) || 0));
            let idxNuevo = registros.findIndex(r => Number(r.ID_IMPORTACIONES) === maxId);
            if (idxNuevo > -1) {
                const nuevo = registros.splice(idxNuevo, 1)[0];
                registros.unshift(nuevo);
            }
        }

        // Calcular paginación
        const totalPaginas = calcularPaginacion(registros);
        actualizarPaginacion(totalPaginas);
        renderizarTabla(ultimoId);
    };

    if (filtrados && Array.isArray(filtrados)) {
        document.getElementById('btnFiltrar').disabled = false;
        render(filtrados);
        return;
    }

    // Deshabilitar el botón de filtro mientras carga
    document.getElementById('btnFiltrar').disabled = true;

    // Consumir la API
    obtenerDatosAPI()
        .then(function (datos) {
            let registros = [];
            try {
                registros = JSON.parse(datos);
            } catch (e) {
                console.log("Los datos no son JSON válido, procesando como texto");
                registros = [];
            }

            if (Array.isArray(registros)) {
                registrosGlobal = registros;
            } else {
                registrosGlobal = [];
            }
            render(registrosGlobal);
            document.getElementById('btnFiltrar').disabled = false;
        })
        .catch(function (err) {
            tbody.innerHTML = '<tr><td colspan="13" class="text-danger">Error al cargar datos: ' + err.message + '</td></tr>';
            document.getElementById('btnFiltrar').disabled = false;
        });
}

// Función para renderizar la tabla con paginación
function renderizarTabla(ultimoId) {
    const tbody = document.querySelector('#tablaImportaciones tbody');
    tbody.innerHTML = '';

    registrosPaginados.forEach(function (row, i) {
        const tr = document.createElement('tr');
        
        // Si es el primer registro y es el más nuevo, resaltar
        if (i === 0 && (String(row.ID_IMPORTACIONES) === String(ultimoId))) {
            tr.classList.add('fila-nueva');
        }

        // Crear las celdas en el orden correcto
        const celdas = [
            row.FECHA_REGISTRO,
            row.NUMERO_DESPACHO,
            row.RESPONSABLE,
            row.PRODUCTOS,
            row.ARCHIVO_PDF_URL,
            row.FECHA_LLEGADA_PRODUCTOS,
            row.TIPO_CARGA,
            row.FECHA_ALMACEN,
            row.ESTADO_IMPORTACION,
            row.CANAL,
            row.FECHA_RECEPCION,
            row.INCIDENCIAS
        ];

        celdas.forEach(function (cell, idx) {
            const td = document.createElement('td');

            if (idx === 0) { // Fecha Registro - solo fecha sin hora
                if (cell && cell !== 'null' && cell !== '') {
                    let fecha = String(cell).split(' ')[0];
                    if (fecha.includes('/')) {
                        const partes = fecha.split('/');
                        if (partes.length === 3) {
                            fecha = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
                        }
                    }
                    td.textContent = fecha;
                } else {
                    td.textContent = '';
                }
            } else if (idx === 3) { // Productos
                td.style.minWidth = '180px';
                td.style.maxWidth = '320px';
                td.style.whiteSpace = 'pre-line';
                td.style.overflowWrap = 'break-word';
                td.style.wordBreak = 'break-word';
                td.style.verticalAlign = 'top';
                td.style.position = 'relative';
                td.style.height = '100%';
                if (cell && String(cell).length > 120) {
                    td.style.overflowY = 'auto';
                    td.style.maxHeight = '80px';
                }
                td.textContent = cell;
            } else if (idx === 4) { // Archivo PDF
                if (cell && typeof cell === 'string' && cell.startsWith('http')) {
                    td.innerHTML = `<button class="btn-action" onclick="window.open('${cell}','_blank')"><i class='fas fa-file-pdf'></i> PDF</button>`;
                } else {
                    td.textContent = cell;
                }
            } else if (idx === 6) { // Tipo de Carga
                td.textContent = cell;
                td.style.fontWeight = 'bold';
                td.style.color = 'var(--primary-color)';
            } else if (idx === 7) { // Fecha de Almacén
                if (cell && cell !== 'null' && cell !== '') {
                    let fecha = cell;
                    if (fecha.includes('/')) {
                        const partes = fecha.split('/');
                        if (partes.length === 3) {
                            fecha = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
                        }
                    }
                    td.textContent = fecha;
                } else {
                    td.textContent = '';
                }
            } else if (idx === 8) { // Estado
                let estado = String(cell).toUpperCase();
                if (estado === 'TRANSITO') {
                    td.innerHTML = `<span class='status-badge status-transito'>${cell}</span>`;
                } else if (estado === 'PRODUCCION') {
                    td.innerHTML = `<span class='status-badge status-produccion'>${cell}</span>`;
                } else if (estado === 'ETA') {
                    td.innerHTML = `<span class='status-badge status-eta'>${cell}</span>`;
                } else {
                    td.textContent = cell;
                }
            } else if (idx === 9) { // Canal
                let canal = String(cell).toUpperCase();
                if (canal === 'ROJO') {
                    td.innerHTML = `<span class='status-badge canal-rojo'>${cell}</span>`;
                } else if (canal === 'VERDE') {
                    td.innerHTML = `<span class='status-badge canal-verde'>${cell}</span>`;
                } else if (canal === 'AMARILLO') {
                    td.innerHTML = `<span class='status-badge canal-amarillo'>${cell}</span>`;
                } else {
                    td.textContent = cell;
                }
            } else if (idx === 10) { // Fecha Recepción
                if (cell && cell !== 'null' && cell !== '') {
                    let fecha = cell;
                    if (cell.includes('/')) {
                        const partes = cell.split('/');
                        if (partes.length === 3) {
                            fecha = `${partes[2]}-${partes[1].padStart(2, '0')}-${partes[0].padStart(2, '0')}`;
                        }
                    }
                    td.textContent = fecha;
                } else {
                    td.textContent = '';
                }
            } else if (idx === 11) { // Incidencias
                let incidencia = String(cell).toUpperCase();
                if (incidencia === 'SI') {
                    td.innerHTML = `<span class='status-badge incidencia-si'>${cell}</span>`;
                } else if (incidencia === 'NO') {
                    td.innerHTML = `<span class='status-badge incidencia-no'>${cell}</span>`;
                } else {
                    td.textContent = cell || '';
                }
            } else {
                td.textContent = cell;
            }
            tr.appendChild(td);
        });

        // Columna ACCIONES
        const tdAcciones = document.createElement('td');
        const rowData = JSON.stringify(row);
        const button = document.createElement('button');
        button.className = 'btn-action';
        button.innerHTML = '<i class="fas fa-edit"></i> Actualizar';
        button.onclick = function () {
            abrirModalActualizar(rowData);
        };
        tdAcciones.appendChild(button);
        tr.appendChild(tdAcciones);
        console.log('Botón de actualizar agregado para fila:', row.ID_IMPORTACIONES);
        tbody.appendChild(tr);
    });
}

function abrirModalActualizar(rowData) {
    console.log('Abriendo modal para:', rowData);
    try {
        let row;
        if (typeof rowData === 'string') {
            const cleanData = rowData.replace(/[\u0000-\u001F\u007F-\u009F]/g, '');
            row = JSON.parse(cleanData);
        } else {
            row = rowData;
        }
        console.log('Datos parseados:', row);

        // Cargar datos en el modal
        document.getElementById('upd_id').value = row.ID_IMPORTACIONES || '';
        document.getElementById('upd_fecha_registro').value = row.FECHA_REGISTRO || '';
        document.getElementById('upd_despacho').value = row.NUMERO_DESPACHO || '';
        document.getElementById('upd_redactado').value = row.RESPONSABLE || '';
        document.getElementById('upd_productos').value = row.PRODUCTOS || '';

        // Convertir fecha de llegada
        if (row.FECHA_LLEGADA_PRODUCTOS) {
            let fechaLlegada = row.FECHA_LLEGADA_PRODUCTOS;
            if (fechaLlegada && fechaLlegada.includes('/')) {
                let partes = fechaLlegada.split('/');
                if (partes.length === 3) {
                    fechaLlegada = partes[2] + '-' + partes[1] + '-' + partes[0];
                }
            }
            document.getElementById('upd_fecha_llegada').value = fechaLlegada;
        } else {
            document.getElementById('upd_fecha_llegada').value = '';
        }

        document.getElementById('upd_tipo_carga').value = row.TIPO_CARGA || '';
        document.getElementById('upd_estado').value = row.ESTADO_IMPORTACION || '';
        document.getElementById('upd_canal').value = row.CANAL || '';
        
        // Cargar fecha de almacén si existe
        if (row.FECHA_ALMACEN) {
            let fAlm = row.FECHA_ALMACEN;
            if (fAlm && fAlm.includes('/')) {
                const partes = fAlm.split('/');
                if (partes.length === 3) {
                    fAlm = `${partes[2]}-${partes[1]}-${partes[0]}`;
                }
            }
            const inpAlm = document.getElementById('upd_fecha_almacen');
            if (inpAlm) inpAlm.value = fAlm;
        }

        // Mostrar el modal
        const modalElement = document.getElementById('modalActualizar');
        const modal = new bootstrap.Modal(modalElement);
        modal.show();

        console.log('Modal abierto correctamente');
    } catch (error) {
        console.error('Error al abrir modal:', error);
        console.error('Datos que causaron el error:', rowData);
        alert('Error al abrir el modal de actualización: ' + error.message);
    }
}

// Event listeners
document.addEventListener('DOMContentLoaded', function () {
    // Event listeners para paginación
    document.getElementById('btnPrimera').onclick = () => irAPagina(1);
    document.getElementById('btnAnterior').onclick = () => irAPagina(paginaActual - 1);
    document.getElementById('btnSiguiente').onclick = () => irAPagina(paginaActual + 1);
    document.getElementById('btnUltima').onclick = () => irAPagina(Math.ceil(registrosGlobal.length / registrosPorPagina));
    
    // Event listener para el botón de guardar actualización
    document.getElementById('btnGuardarActualizacion').onclick = function () {
        console.log('Botón Guardar Cambios clickeado');
        const id = document.getElementById('upd_id').value;
        const fechaLlegada = document.getElementById('upd_fecha_llegada').value;
        
        console.log('ID:', id);
        console.log('Fecha llegada:', fechaLlegada);

        let fechaLlegadaFormateada = '';
        if (fechaLlegada) {
            fechaLlegadaFormateada = fechaLlegada;
        }

        const datos = {
            productos: document.getElementById('upd_productos').value,
            fecha_llegada_productos: fechaLlegadaFormateada,
            tipo_carga: document.getElementById('upd_tipo_carga').value,
            estado_importacion: document.getElementById('upd_estado').value,
            canal: document.getElementById('upd_canal').value,
            fecha_almacen: (document.getElementById('upd_fecha_almacen') && document.getElementById('upd_fecha_almacen').value) ? document.getElementById('upd_fecha_almacen').value : null,
            id: parseInt(id)
        };

        // Validar campos requeridos
        if (!datos.productos || !datos.fecha_llegada_productos || !datos.tipo_carga || !datos.estado_importacion) {
            alert('Por favor complete todos los campos requeridos.');
            return;
        }

        if (!datos.canal) {
            datos.canal = '';
        }

        if (!datos.id) {
            alert('Error: ID de importación no encontrado.');
            return;
        }

        console.log('Datos a enviar:', datos);

        // Usar la API para actualizar
        actualizarDatosAPI(datos)
            .then(function (result) {
                var modal = bootstrap.Modal.getInstance(document.getElementById('modalActualizar'));
                modal.hide();
                cargarTablaImportaciones();
                if (typeof result === 'string' && result.includes('correctamente')) {
                    alert(result);
                } else {
                    alert('Importación actualizada correctamente.');
                }
            })
            .catch(function (err) {
                console.error('Error al actualizar:', err);
                alert('Error al actualizar: ' + (err.message || err));
            });
    };

    // Event listener para filtros
    document.getElementById('btnFiltrar').onclick = function () {
        if (!Array.isArray(registrosGlobal) || registrosGlobal.length === 0) {
            return;
        }
        const fechaInicio = document.getElementById('filtroFechaInicio').value;
        const fechaFinal = document.getElementById('filtroFechaFinal').value;
        const despacho = document.getElementById('filtroDespacho').value.trim().toLowerCase();

        let filtrados = registrosGlobal.filter(function (row) {
            let cumpleFecha = true;
            if (fechaInicio) {
                let f = row.FECHA_REGISTRO;
                if (f && f.length >= 10) {
                    let fRow = f.split(' ')[0].split('/').reverse().join('-');
                    cumpleFecha = cumpleFecha && (fRow >= fechaInicio);
                }
            }
            if (fechaFinal) {
                let f = row.FECHA_REGISTRO;
                if (f && f.length >= 10) {
                    let fRow = f.split(' ')[0].split('/').reverse().join('-');
                    cumpleFecha = cumpleFecha && (fRow <= fechaFinal);
                }
            }

            let cumpleDespacho = true;
            if (despacho) {
                cumpleDespacho = String(row.NUMERO_DESPACHO || '').toLowerCase().includes(despacho);
            }

            return cumpleFecha && cumpleDespacho;
        });
        
        paginaActual = 1;
        cargarTablaImportaciones(filtrados);
    };

    // Cargar datos iniciales
    cargarTablaImportaciones();
});

// Escuchar evento de registro exitoso
window.addEventListener('storage', function (e) {
    if (e.key === 'ultimoIdImportacion') {
        cargarTablaImportaciones();
    }
});
