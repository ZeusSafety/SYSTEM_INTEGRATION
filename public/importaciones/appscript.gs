function mostrarFormularioImportaciones() {
  var html = HtmlService.createHtmlOutputFromFile('importaciones')
     .setWidth(2500)
     .setHeight(1500);
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'IMPORTACIONES');
}

function mostrarArchivo_importacion() {
  var html = HtmlService.createHtmlOutputFromFile('ficha_importacion')
     .setWidth(2500)
     .setHeight(1500);
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'FICHA IMPORTACIÓN');
}

mostrarHistorial_Archivo_importacion
function mostrarHistorial_Archivo_importacion() {
  var html = HtmlService.createHtmlOutputFromFile('historial_ficha_import')
     .setWidth(2500)
     .setHeight(1500);
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'HISTORIAL DE FICHA IMPORTACIÓN');
}

function mostrarListadoImportaciones() {
  var html = HtmlService.createHtmlOutputFromFile('listado_import')
     .setWidth(2500)
     .setHeight(1500);
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'IMPORTACIONES');
}

function mostrarListadoImportacionesActualizar() {
  var html = HtmlService.createHtmlOutputFromFile('listado_import_update')
     .setWidth(2500)
     .setHeight(1500);
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'IMPORTACIONES ACTUALIZAR');
}

function mostrarFormularioMarketing() {
  var html = HtmlService.createHtmlOutputFromFile('marketing')
     .setWidth(2500)
     .setHeight(1500);
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'MARKETING');
}

function mostrarListadoMarketing() {
  var html = HtmlService.createHtmlOutputFromFile('listado_marke')
     .setWidth(2500)
     .setHeight(1500);
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'MARKETING');
}

function mostrarListadoRespuestas() {
  var html = HtmlService.createHtmlOutputFromFile('respuestas')
     .setWidth(2500)
     .setHeight(1500);
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'RESPUESTAS');
}

function mostrarMenu() {
  var html = HtmlService.createHtmlOutputFromFile('menu')
     .setWidth(2500)
     .setHeight(1500);
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'MENU');
}

function mostrarLogin() {
  var html = HtmlService.createHtmlOutputFromFile('login')
     .setWidth(2500)
     .setHeight(1500);
  SpreadsheetApp.getUi()
      .showModalDialog(html, 'LOGIN');
}

// Función para obtener la URL del script
function getScriptUrl() {
  return ScriptApp.getService().getUrl();
}

// Función para incluir archivos HTML
function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename).getContent();
}


/**
 * Función auxiliar para obtener datos de una sola columna.
 * @param {string} nombreHoja Nombre de la hoja.
 * @param {number} numColumna Número de la columna (1-index).
 * @return {Array<string>} Array de valores de la columna.
 */
function _obtenerDatosDeColumna(nombreHoja, numColumna) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName(nombreHoja);
  if (!hoja) {
    return [];
  }
  var datos = hoja.getDataRange().getValues();
  var valores = datos.slice(1).map(function (fila) {
    return String(fila[numColumna - 1]).trim();
  }).filter(String).sort();
  return valores;
}

/**
 * Función auxiliar para obtener datos con ID y nombre.
 * @param {string} nombreHoja Nombre de la hoja.
 * @param {number} idColumna Número de la columna del ID (1-index).
 * @param {number} nombreColumna Número de la columna del nombre (1-index).
 * @return {Array<object>} Array de objetos {id: ..., nombre: ...}.
 */
function _obtenerDatosConId(nombreHoja, idColumna, nombreColumna) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName(nombreHoja);
  if (!hoja) {
    return [];
  }
  var datos = hoja.getDataRange().getValues();
  var valores = datos.slice(1).map(function (fila) {
    return {
      id: String(fila[idColumna - 1]).trim(),
      nombre: String(fila[nombreColumna - 1]).trim()
    };
  }).filter(function (item) {
    return item.id !== ''; // Filtrar si el ID está vacío
  }).sort(function (a, b) {
    return a.nombre.localeCompare(b.nombre); // Ordenar por nombre
  });
  return valores;
}

/**
 * Función auxiliar para buscar el ID correspondiente a un nombre en una hoja específica.
 * @param {string} nombreHoja Nombre de la hoja donde buscar.
 * @param {string} nombreABuscar El nombre a buscar en la segunda columna.
 * @return {string|null} El ID encontrado en la primera columna o null si no se encuentra.
 */
function _buscarIdPorNombre(nombreHoja, nombreABuscar) {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var hoja = ss.getSheetByName(nombreHoja);
  if (!hoja) {
    return null;
  }
  var datos = hoja.getDataRange().getValues();
  for (var i = 1; i < datos.length; i++) {
    if (String(datos[i][1]).trim() === String(nombreABuscar).trim()) { // Asumiendo que el nombre está en la segunda columna
      return String(datos[i][0]).trim(); // El ID está en la primera columna
    }
  }
  return null;
}

// Función para navegar entre páginas
function navigateTo(page) {
  const url = getScriptUrl() + '?page=' + page;
  return url;
}

// Función para manejar errores
function handleError(error) {
  Logger.log('Error: ' + error);
  return {
    success: false,
    error: error.toString()
  };
}

/**
 * Función que se ejecuta cuando se carga la web app
 * Versión optimizada y limpia
 */
function doGet(e) {
  // Obtener parámetros de la URL
  var page = e.parameter.page || 'menu';
  var debug = e.parameter.debug || false;
  
  console.log('=== INICIO DOGET ===');
  console.log('Página solicitada: ' + page);
  console.log('Parámetros recibidos: ' + JSON.stringify(e.parameter));
  
  try {
    // Validar que la página solicitada existe
    var archivosDisponibles = [
      'menu', 'importacion', 'logistica', 'logistica_simple', 
      'importaciones', 'listado_import', 'incidencia_listado_logistica',
      'incidencia_logistica_formulario', 'test', 'test_simple', 'marketing',
      'listado_marke', 'listado_import_update', 'listado_incidencias_log-admi','reg_indicencias_logis',
      'admin', 'ficha_importacion', 'historial_ficha_import','listado_solicitudes', 'market',
    ];
    
    if (!archivosDisponibles.includes(page)) {
      console.log('Página no válida: ' + page + ', redirigiendo al menú');
      page = 'menu';
    }
    
    console.log('Cargando página: ' + page);
    
    // Crear la página HTML
    var htmlOutput = HtmlService.createTemplateFromFile(page)
      .evaluate()
      .setTitle(getTituloPagina(page))
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
    
    console.log('Página cargada exitosamente: ' + page);
    return htmlOutput;
    
  } catch (error) {
    console.log('ERROR en doGet: ' + error.message);
    console.log('Stack trace: ' + error.stack);
    
    // Página de error detallada
    var errorHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Error - ZEUS SAFETY</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 40px; background: #f5f5f5; }
          .error-container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
          .error-title { color: #d32f2f; font-size: 24px; margin-bottom: 20px; }
          .error-details { background: #f8f8f8; padding: 15px; border-radius: 5px; margin: 15px 0; }
          .btn-back { background: #2196f3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="error-container">
          <h1 class="error-title">⚠️ Error al cargar la página</h1>
          <div class="error-details">
            <p><strong>Página solicitada:</strong> ${page}</p>
            <p><strong>Error:</strong> ${error.message}</p>
            <p><strong>Hora:</strong> ${new Date().toLocaleString()}</p>
          </div>
          <a href="?page=menu" class="btn-back">← Volver al Menú</a>
        </div>
      </body>
      </html>
    `;
    
    return HtmlService.createHtmlOutput(errorHtml)
      .setTitle('Error')
      .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
  }
}

/**
 * Obtiene el título de la página según el parámetro
 */
function getTituloPagina(page) {
  var titulos = {
    'menu': 'Menú Principal - ZEUS SAFETY',
    'importacion': 'Importación - ZEUS SAFETY',
    'logistica': 'Logística - ZEUS SAFETY',
    'logistica_simple': 'Logística Simple - ZEUS SAFETY',
    'importaciones': 'Formulario Importaciones - ZEUS SAFETY',
    'listado_import': 'Listado Importaciones - ZEUS SAFETY',
    'incidencia_listado_logistica': 'Listado Incidencias Logística - ZEUS SAFETY',
    'incidencia_logistica_formulario': 'Formulario Incidencia Logística - ZEUS SAFETY',
    'test': 'Página de Prueba - ZEUS SAFETY',
    'test_simple': 'Prueba Simple - ZEUS SAFETY',
    'marketing': 'Marketing - ZEUS SAFETY',
    'listado_marke': 'Listado Marketing - ZEUS SAFETY',
    'listado_import_update': 'Actualizar Importaciones - ZEUS SAFETY'
  };
  
  return titulos[page] || 'ZEUS SAFETY';
}

/**
 * Función de prueba para verificar la navegación
 */
function probarNavegacion() {
  try {
    console.log('=== PRUEBA DE NAVEGACIÓN ===');
    
    // Probar cargar diferentes páginas
    var paginas = ['menu', 'logistica', 'logistica_simple', 'test'];
    
    for (var i = 0; i < paginas.length; i++) {
      var pagina = paginas[i];
      console.log('Probando página: ' + pagina);
      
      try {
        var testPage = HtmlService.createTemplateFromFile(pagina)
          .evaluate()
          .setTitle('Prueba - ' + pagina)
          .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
        
        console.log('✓ Página ' + pagina + ' cargada correctamente');
      } catch (error) {
        console.log('✗ Error al cargar página ' + pagina + ': ' + error.message);
      }
    }
    
    return HtmlService.createHtmlOutput('<h1>Prueba completada</h1><p>Revisa los logs para ver los resultados.</p>');
  } catch (error) {
    console.log('Error en probarNavegacion: ' + error.message);
    return HtmlService.createHtmlOutput('<h1>Error en prueba</h1><p>' + error.message + '</p>');
  }
}

/**
 * Función de diagnóstico para verificar el estado de la aplicación
 */
function diagnosticarAplicacion() {
  try {
    console.log('=== DIAGNÓSTICO DE APLICACIÓN ===');
    
    // Verificar archivos HTML disponibles
    var archivosDisponibles = [
      'menu', 'importacion', 'logistica', 'logistica_simple', 
      'importaciones', 'listado_import', 'incidencia_listado_logistica',
      'incidencia_logistica_formulario', 'test', 'marketing',
      'listado_marke', 'listado_import_update', 'market', 'listado_solicitudes'
    ];
    
    console.log('Archivos HTML disponibles: ' + archivosDisponibles.join(', '));
    
    // Probar función doGet con diferentes parámetros
    var parametrosPrueba = [
      { page: 'menu' },
      { page: 'logistica' },
      { page: 'logistica_simple' },
      { page: 'test' },
      { page: 'pagina_inexistente' }
    ];
    
    for (var i = 0; i < parametrosPrueba.length; i++) {
      var params = parametrosPrueba[i];
      console.log('Probando doGet con parámetros: ' + JSON.stringify(params));
      
      try {
        // Simular llamada a doGet
        var mockEvent = { parameter: params };
        var resultado = doGet(mockEvent);
        console.log('✓ doGet funcionó correctamente para: ' + params.page);
      } catch (error) {
        console.log('✗ Error en doGet para ' + params.page + ': ' + error.message);
      }
    }
    
    return HtmlService.createHtmlOutput(`
      <h1>Diagnóstico Completado</h1>
      <p>Revisa los logs de ejecución para ver los resultados detallados.</p>
      <p>Archivos verificados: ${archivosDisponibles.length}</p>
      <p>Parámetros probados: ${parametrosPrueba.length}</p>
    `);
  } catch (error) {
    console.log('Error en diagnosticarAplicacion: ' + error.message);
    return HtmlService.createHtmlOutput('<h1>Error en diagnóstico</h1><p>' + error.message + '</p>');
  }
}


/* FUNCIONES PARA LISTAR REGISTRO DE IMPORTACIONES */

/**
 * Devuelve todos los registros de la hoja AREA_IMPORTACIONES como array de arrays.
 * Cada subarray representa una fila (sin cabecera).
 * @return {Array[]} Registros de importaciones
 */
function obtenerImportaciones() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = ss.getSheetByName('AREA_IMPORTACIONES');
    if (!hoja) {
      return JSON.stringify([]);
    }
    var datos = hoja.getDataRange().getValues();
    if (datos.length === 0) {
      return JSON.stringify([]);
    }
    // Detectar si la primera fila es cabecera
    var primeraFila = datos[0];
    var esCabecera = false;
    if (
      primeraFila[0] && typeof primeraFila[0] === 'string' &&
      primeraFila[0].toString().toUpperCase().indexOf('ID') !== -1
    ) {
      esCabecera = true;
    }
    // Omitir cabecera si existe
    var registros = esCabecera ? datos.slice(1) : datos;
    // Filtrar filas completamente vacías
    registros = registros.filter(function(fila) {
      return fila.some(function(celda) {
        return String(celda).trim() !== '';
      });
    });
    // Formatear FECHA_REGISTRO y FECHA_LLEGADA_PRODUCTOS para el listado
    registros = registros.map(function(fila) {
      // FECHA_REGISTRO (col 1): mostrar como "dd/MM/yyyy HH:mm:ss"
      if (fila[1]) {
        var fecha = new Date(fila[1]);
        if (!isNaN(fecha.getTime())) {
          var tz = Session.getScriptTimeZone ? Session.getScriptTimeZone() : "America/Lima";
          fila[1] = Utilities.formatDate(fecha, tz, "dd/MM/yyyy HH:mm:ss");
        }
      }
      // FECHA_LLEGADA_PRODUCTOS (col 7): mostrar solo como "dd/MM/yyyy"
      if (fila[6]) {
        var fecha2 = new Date(fila[6]);
        if (!isNaN(fecha2.getTime())) {
          var tz = Session.getScriptTimeZone ? Session.getScriptTimeZone() : "America/Lima";
          fila[6] = Utilities.formatDate(fecha2, tz, "dd/MM/yyyy");
        }
      }
      return fila;
    });
    return JSON.stringify(registros);
  } catch (e) {
    return JSON.stringify([]);
  }
}


/**
 * Registra una nueva importación en la hoja AREA_IMPORTACIONES.
 * @param {Object} datos - Datos del formulario desde importaciones.html
 * @return {string} Mensaje de éxito o error
 */
function registrarImportacionConArchivo(datos) {
  try {
    console.log('=== INICIANDO REGISTRO DE IMPORTACIÓN ===');
    console.log('Datos recibidos:', JSON.stringify(datos));
    
    // Validar datos requeridos
    if (!datos.num_despacho || !datos.responsable_im || !datos.productos || !datos.fecha_llegada || !datos.tipo_carga || !datos.estado) {
      console.log('❌ Datos faltantes detectados');
      return 'Error: Todos los campos son obligatorios';
    }
    
    if (!datos.archivo_base64 || !datos.nombre_archivo) {
      console.log('❌ Archivo PDF faltante');
      return 'Error: Debe seleccionar un archivo PDF';
    }

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName('AREA_IMPORTACIONES');
    if (!hoja) {
      console.log('❌ No existe la hoja AREA_IMPORTACIONES');
      return 'Error: No existe la hoja AREA_IMPORTACIONES';
    }

    console.log('✅ Hoja AREA_IMPORTACIONES encontrada');

    const ultimaFila = hoja.getLastRow();
    let id = 1;
    if (ultimaFila > 1) {
      const ultimoId = hoja.getRange(ultimaFila, 1).getValue();
      id = (ultimoId && !isNaN(ultimoId)) ? Number(ultimoId) + 1 : 1;
    }

    console.log('📝 ID asignado:', id);

    const now = new Date();
    const tz = Session.getScriptTimeZone() || "America/Lima";
    const fechaHoraRegistro = Utilities.formatDate(now, tz, "yyyy-MM-dd HH:mm:ss");

    console.log('📅 Fecha de registro:', fechaHoraRegistro);

    // Subir archivo a Drive
    let enlacePDF; // Declarar fuera del try para que esté disponible en todo el scope
    try {
      console.log('📁 Subiendo archivo a Drive...');
      const folder = DriveApp.getFolderById('1v-VUrwf_H5Ola5s7UojEx6NQ65KkDJDR'); 
      const blob = Utilities.newBlob(Utilities.base64Decode(datos.archivo_base64), MimeType.PDF, datos.nombre_archivo);
      const archivoSubido = folder.createFile(blob);
      enlacePDF = archivoSubido.getUrl();
      
      console.log('✅ Archivo subido exitosamente:', enlacePDF);
    } catch (driveError) {
      console.log('❌ Error al subir archivo a Drive:', driveError.message);
      return 'Error al subir archivo: ' + driveError.message;
    }

    const fila = [
      id,
      fechaHoraRegistro,
      datos.num_despacho,
      datos.responsable_im,
      datos.productos,
      enlacePDF, // ARCHIVO_PDF
      datos.fecha_llegada,
      datos.tipo_carga,
      datos.estado
    ];

    console.log('📊 Guardando en hoja:', fila);
    hoja.appendRow(fila);
    console.log('✅ Datos guardados en hoja exitosamente');

    // Llamada a la API de Python para insertar en base de datos
    try {
      console.log('🌐 Enviando datos a la API...');
      const apiUrl = "https://importacionesvr01crud-2946605267.us-central1.run.app";
      const apiData = {
        "fecha_registro": fechaHoraRegistro,
        "responsable": datos.responsable_im,
        "numero_despacho": datos.num_despacho,
        "productos": datos.productos,
        "archivo_pdf_url": enlacePDF,
        "fecha_llegada_productos": datos.fecha_llegada,
        "tipo_carga": datos.tipo_carga,
        "estado_importacion": datos.estado
      };
      
      const payloadJson = JSON.stringify(apiData);
      console.log('📤 Datos a enviar a API:', JSON.stringify(apiData));
      console.log('📤 Payload JSON string:', payloadJson);
      console.log('📤 Payload length:', payloadJson.length);
      
      // Verificar si el payload es demasiado grande (límite típico de Apps Script es ~50MB)
      if (payloadJson.length > 50000000) { // 50MB en caracteres
        console.log('⚠️ ADVERTENCIA: Payload muy grande (' + payloadJson.length + ' caracteres)');
      }
      
      const options = {
        'method': 'post',
        'contentType': 'application/json',
        'payload': payloadJson,
        'muteHttpExceptions': true
      };
      
      console.log('📤 Options object:', JSON.stringify(options));
      console.log('📤 URL de la API:', apiUrl);
      
      const response = UrlFetchApp.fetch(apiUrl, options);
      const responseCode = response.getResponseCode();
      const responseText = response.getContentText();
      
      console.log('📡 Respuesta de la API - Código:', responseCode);
      console.log('📡 Respuesta de la API - Texto:', responseText);
      
      if (responseCode === 200 || responseCode === 201) {
        console.log('✅ Datos enviados exitosamente a la API');
      } else {
        console.log('⚠️ Error al enviar datos a la API. Código: ' + responseCode + ', Respuesta: ' + responseText);
        // No fallar el registro principal si la API falla, pero registrar el error
      }
    } catch (apiError) {
      console.log('❌ Error en llamada a API: ' + apiError.message);
      console.log('Stack trace:', apiError.stack);
      // No fallar el registro principal si la API falla
    }

    console.log('✅ Registro completado exitosamente');
    return 'Registro exitoso. ID: ' + id;
  } catch (e) {
    console.log('❌ Error general en registrarImportacionConArchivo:', e.message);
    console.log('Stack trace:', e.stack);
    return 'Error al registrar: ' + e.message;
  }
}

/**
 * Registra una nueva solicitud de marketing en la hoja AREA_MARKETING.
 * @param {Object} datos - Datos del formulario desde marketing.html
 * @return {string} Mensaje de éxito o error
 */
function registrarMarketingConArchivo(datos) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName('AREA_MARKETING');
    if (!hoja) return 'No existe la hoja AREA_MARKETING';

    // ID_MARKETING autoincremental
    const ultimaFila = hoja.getLastRow();
    let idMarketing = 1;
    if (ultimaFila > 1) {
      const ultimoId = hoja.getRange(ultimaFila, 1).getValue();
      idMarketing = (ultimoId && !isNaN(ultimoId)) ? Number(ultimoId) + 1 : 1;
    }

    // N° SOLICITUD autoincremental formato MK01, MK02...
    let numSolicitud = 'MK01';
    if (ultimaFila > 1) {
      const ultimoNum = hoja.getRange(ultimaFila, 3).getValue();
      let ultimoNumInt = 1;
      if (typeof ultimoNum === 'string' && /^MK\d+$/.test(ultimoNum)) {
        ultimoNumInt = parseInt(ultimoNum.replace('MK', '')) + 1;
      } else if (!isNaN(ultimoNum)) {
        ultimoNumInt = Number(ultimoNum) + 1;
      }
      numSolicitud = 'MK' + (ultimoNumInt < 10 ? '0' : '') + ultimoNumInt;
    }

    // FECHA_CONSULTA_MK con hora actual
    const now = new Date();
    const tz = Session.getScriptTimeZone() || "America/Lima";
    const fechaHoraConsulta = Utilities.formatDate(now, tz, "dd/MM/yyyy HH:mm:ss");

    // Subir archivo a Drive
    const folder = DriveApp.getFolderById('1x1ftXi1ldAcJV-aHIBO_AEPZczUGJ7wL');
    const blob = Utilities.newBlob(Utilities.base64Decode(datos.informe_base64), MimeType.PDF, datos.nombre_informe);
    const archivoSubido = folder.createFile(blob);
    const enlacePDF = archivoSubido.getUrl();

    // Estado por defecto
    const estadoReque = 'PENDIENTE';

    // Guardar fila en hoja
    const fila = [
      idMarketing, // Col A: ID_MARKETING
      fechaHoraConsulta, // Col B: FECHA_CONSULTA_MK
      numSolicitud, // Col C: N° SOLICITUD
      datos.responsable_mk, // Col D: RESPONSABLE_MK
      datos.requerimientos, // Col E: REQUERIMIENTOS
      enlacePDF, // Col F: INFORME
      estadoReque // Col G: ESTADO_REQUE
    ];
    hoja.appendRow(fila);

    // También registrar en la hoja RESPUESTAS
    var hojaRespuestas = ss.getSheetByName('RESPUESTAS');
    if (hojaRespuestas) {
      // Buscar la última fila para insertar
      var ultimaFilaResp = hojaRespuestas.getLastRow();
      // Columnas: B: ID_MARKETING, C: FECHA_CONSULTA_MK, D: RESPONSABLE_MK, E: REQUERIMIENTOS, F: INFORME
      var filaResp = [
        '', // Columna A vacía
        idMarketing, // Col B
        fechaHoraConsulta, // Col C
        datos.responsable_mk, // Col D
        datos.requerimientos, // Col E
        enlacePDF // Col F
      ];
      hojaRespuestas.appendRow(filaResp);
    }

    return 'Registro exitoso. ID: ' + idMarketing + ', Solicitud: ' + numSolicitud;
  } catch (e) {
    return 'Error al registrar: ' + e.message;
  }
}

/**
 * Devuelve todos los registros de la hoja AREA_MARKETING como array de arrays.
 * Cada subarray representa una fila (sin cabecera).
 * @return {Array[]} Registros de marketing
 */
function obtenerMarketing() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = ss.getSheetByName('AREA_MARKETING');
    if (!hoja) {
      return JSON.stringify([]);
    }
    var datos = hoja.getDataRange().getValues();
    if (datos.length === 0) {
      return JSON.stringify([]);
    }
    // Detectar si la primera fila es cabecera
    var primeraFila = datos[0];
    var esCabecera = false;
    if (
      primeraFila[0] && typeof primeraFila[0] === 'string' &&
      primeraFila[0].toString().toUpperCase().indexOf('ID') !== -1
    ) {
      esCabecera = true;
    }
    // Omitir cabecera si existe
    var registros = esCabecera ? datos.slice(1) : datos;
    // Filtrar filas completamente vacías
    registros = registros.filter(function(fila) {
      return fila.some(function(celda) {
        return String(celda).trim() !== '';
      });
    });
    // Formatear FECHA_CONSULTA_MK (col 1) para mostrar solo dd/MM/yyyy HH:mm:ss
    registros = registros.map(function(fila) {
      if (fila[1]) {
        var fecha = new Date(fila[1]);
        if (!isNaN(fecha.getTime())) {
          var tz = Session.getScriptTimeZone ? Session.getScriptTimeZone() : "America/Lima";
          fila[1] = Utilities.formatDate(fecha, tz, "dd/MM/yyyy HH:mm:ss");
        } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(String(fila[1]))) {
          // Si el formato es ISO y no lo reconoce, extraer solo la fecha y hora
          var partes = String(fila[1]).split('T');
          if (partes.length === 2) {
            var fechaIso = partes[0].split('-').reverse().join('/');
            var horaIso = partes[1].substring(0,8);
            fila[1] = fechaIso + ' ' + horaIso;
          }
        }
      }
      return fila;
    });
    return JSON.stringify(registros);
  } catch (e) {
    return JSON.stringify([]);
  }
}

/**
 * Devuelve todos los registros de la hoja RESPUESTAS como array de arrays.
 * Cada subarray representa una fila (sin cabecera).
 * @return {Array[]} Registros de respuestas
 */
function obtenerRespuestas() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = ss.getSheetByName('RESPUESTAS');
    if (!hoja) {
      return JSON.stringify([]);
    }
    var datos = hoja.getDataRange().getValues();
    if (datos.length === 0) {
      return JSON.stringify([]);
    }
    // Detectar si la primera fila es cabecera
    var primeraFila = datos[0];
    var esCabecera = false;
    if (
      primeraFila[0] && typeof primeraFila[0] === 'string' &&
      primeraFila[0].toString().toUpperCase().indexOf('ID') !== -1
    ) {
      esCabecera = true;
    }
    // Omitir cabecera si existe
    var registros = esCabecera ? datos.slice(1) : datos;
    // Filtrar filas completamente vacías
    registros = registros.filter(function(fila) {
      return fila.some(function(celda) {
        return String(celda).trim() !== '';
      });
    });
    // Formatear FECHA_CONSULTA_MK (col 2) y FECHA_RESPUESTA (col 7) para mostrar solo dd/MM/yyyy HH:mm:ss
    registros = registros.map(function(fila) {
      // FECHA_CONSULTA_MK (col 2)
      if (fila[2]) {
        var fecha = new Date(fila[2]);
        if (!isNaN(fecha.getTime())) {
          var tz = Session.getScriptTimeZone ? Session.getScriptTimeZone() : "America/Lima";
          fila[2] = Utilities.formatDate(fecha, tz, "dd/MM/yyyy HH:mm:ss");
        } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(String(fila[2]))) {
          var partes = String(fila[2]).split('T');
          if (partes.length === 2) {
            var fechaIso = partes[0].split('-').reverse().join('/');
            var horaIso = partes[1].substring(0,8);
            fila[2] = fechaIso + ' ' + horaIso;
          }
        }
      }
      // FECHA_RESPUESTA (col 7)
      if (fila[7]) {
        var fechaR = new Date(fila[7]);
        if (!isNaN(fechaR.getTime())) {
          var tz = Session.getScriptTimeZone ? Session.getScriptTimeZone() : "America/Lima";
          fila[7] = Utilities.formatDate(fechaR, tz, "dd/MM/yyyy HH:mm:ss");
        } else if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(String(fila[7]))) {
          var partesR = String(fila[7]).split('T');
          if (partesR.length === 2) {
            var fechaIsoR = partesR[0].split('-').reverse().join('/');
            var horaIsoR = partesR[1].substring(0,8);
            fila[7] = fechaIsoR + ' ' + horaIsoR;
          }
        }
      }
      return fila;
    });
    return JSON.stringify(registros);
  } catch (e) {
    return JSON.stringify([]);
  }
}

/**
 * Actualiza una respuesta en la hoja RESPUESTAS y el estado en AREA_MARKETING si corresponde.
 * @param {Object} datos - Datos del formulario modal
 * @return {string} Mensaje de éxito o error
 */
function actualizarRespuesta(datos) {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var hoja = ss.getSheetByName('RESPUESTAS');
    if (!hoja) return 'No existe la hoja RESPUESTAS';


    // Buscar la fila a actualizar solo por ID_MARKETING
    var datosHoja = hoja.getDataRange().getValues();
    var esCabecera = false;
    if (datosHoja.length > 0 && typeof datosHoja[0][0] === 'string' && datosHoja[0][0].toUpperCase().indexOf('ID') !== -1) {
      esCabecera = true;
    }
    var filaActualizar = -1;
    for (var i = 0; i < datosHoja.length; i++) {
      var fila = datosHoja[i];
      if (String(fila[1]) === String(datos.id_marketing)) {
        filaActualizar = i;
        break;
      }
    }
    if (filaActualizar === -1) return 'No se encontró la fila a actualizar.';

    var filaIndex = filaActualizar + 1; // 1-based para Apps Script

    // Siempre asignar un ID autoincremental en ID_RESPUESTA
    var maxId = 0;
    for (var j = (esCabecera ? 1 : 0); j < datosHoja.length; j++) {
      var val = datosHoja[j][0];
      if (val && !isNaN(val) && Number(val) > maxId) maxId = Number(val);
    }
    var idRespuesta = maxId + 1;
    hoja.getRange(filaIndex, 1).setValue(idRespuesta);

    // FECHA_RESPUESTA: usar la enviada por el frontend (solo fecha) y agregar hora actual, o la actual completa
    var fechaHoraRespuesta = datos.fecha_respuesta;
    var now = new Date();
    var tz = Session.getScriptTimeZone() || "America/Lima";
    if (fechaHoraRespuesta && /^\d{2}\/\d{2}\/\d{4}$/.test(fechaHoraRespuesta)) {
      // Si solo es fecha, agregar hora actual
      var hora = Utilities.formatDate(now, tz, "HH:mm:ss");
      fechaHoraRespuesta = fechaHoraRespuesta + ' ' + hora;
    } else if (!fechaHoraRespuesta) {
      fechaHoraRespuesta = Utilities.formatDate(now, tz, "dd/MM/yyyy HH:mm:ss");
    }

    // Actualizar los campos editables
    hoja.getRange(filaIndex, 7).setValue(datos.responsable_im); // RESPONSABLE_IM
    hoja.getRange(filaIndex, 8).setValue(fechaHoraRespuesta); // FECHA_RESPUESTA
    hoja.getRange(filaIndex, 9).setValue(datos.observaciones); // OBSERVACIONES
    hoja.getRange(filaIndex, 10).setValue(datos.estado); // ESTADO

    // Si el estado es COMPLETADO, actualizar estado en AREA_MARKETING
    if (datos.estado === 'COMPLETADO') {
      var hojaMarketing = ss.getSheetByName('AREA_MARKETING');
      if (hojaMarketing) {
        var datosMarketing = hojaMarketing.getDataRange().getValues();
        var esCabeceraMk = false;
        if (datosMarketing.length > 0 && typeof datosMarketing[0][0] === 'string' && datosMarketing[0][0].toUpperCase().indexOf('ID') !== -1) {
          esCabeceraMk = true;
        }
        var registrosMarketing = esCabeceraMk ? datosMarketing.slice(1) : datosMarketing;
        for (var i = 0; i < registrosMarketing.length; i++) {
          if (String(registrosMarketing[i][0]) === String(datos.id_marketing)) {
            // Columna 6 (índice 6) es ESTADO_REQUE
            var filaHoja = esCabeceraMk ? i+2 : i+1;
            hojaMarketing.getRange(filaHoja, 7).setValue('COMPLETADO');
            break;
          }
        }
      }
    }

    return 'Respuesta actualizada correctamente.';
  } catch (e) {
    return 'Error al actualizar: ' + e.message;
  }
}

function actualizarImportacionPorId(datos) {
  try {
    var hoja = SpreadsheetApp.getActive().getSheetByName('AREA_IMPORTACIONES');
    if (!hoja) return 'No existe la hoja AREA_IMPORTACIONES';
    
    var data = hoja.getDataRange().getValues();
    var esCabecera = false;
    if (data.length > 0 && typeof data[0][0] === 'string' && data[0][0].toUpperCase().indexOf('ID') !== -1) {
      esCabecera = true;
    }
    
    var filaActualizar = -1;
    for (var i = (esCabecera ? 1 : 0); i < data.length; i++) {
      if (String(data[i][0]) === String(datos.id)) {
        filaActualizar = i;
        break;
      }
    }
    
    if (filaActualizar === -1) return 'No se encontró la importación con ID: ' + datos.id;
    
    var filaIndex = filaActualizar + 1; // 1-based para Apps Script
    
    // Actualizar solo los campos editables (no FECHA_REGISTRO ni ARCHIVO_PDF)
    // Columnas: A=ID, B=FECHA_REGISTRO, C=N_DESPACHO, D=REDACTADO_POR, E=PRODUCTOS, F=ARCHIVO_PDF, G=FECHA_LLEGADA, H=TIPO_CARGA, I=ESTADO
    
    // N° Despacho (columna C, índice 2)
    hoja.getRange(filaIndex, 3).setValue(datos.despacho);
    
    // Redactado por (columna D, índice 3)
    hoja.getRange(filaIndex, 4).setValue(datos.redactado);
    
    // Productos (columna E, índice 4)
    hoja.getRange(filaIndex, 5).setValue(datos.productos);
    
    // Fecha Llegada (columna G, índice 6)
    hoja.getRange(filaIndex, 7).setValue(datos.fecha_llegada);
    
    // Tipo de Carga (columna H, índice 7)
    hoja.getRange(filaIndex, 8).setValue(datos.tipo_carga);
    
    // Estado (columna I, índice 8)
    hoja.getRange(filaIndex, 9).setValue(datos.estado);

    // Estado (columna J, índice 9)
    hoja.getRange(filaIndex, 10).setValue(datos.canal);
    
    return 'Importación actualizada correctamente.';
  } catch (e) {
    return 'Error al actualizar: ' + e.message;
  }
}

/**
 * Devuelve un objeto {nombreProducto: codigoProducto} desde la hoja PRODUCTOS
 */
function obtenerProductosConCodigos_cambio_de_nombre() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const hojaProductos = ss.getSheetByName('PRODUCTOS');
  if (!hojaProductos) {
    return {};
  }
  const productosConCodigos = {};
  const lastRow = hojaProductos.getLastRow();
  const range = hojaProductos.getRange(1, 1, lastRow, 2).getValues();
  range.forEach(function (row) {
    var codigoProducto = row[0];
    var nombreProducto = row[1];
    if (nombreProducto && codigoProducto) {
      productosConCodigos[nombreProducto] = codigoProducto;
    }
  });
  return productosConCodigos;
}

// Función de prueba para diagnosticar problemas de acceso
function probarAccesoHoja() {
  try {
    const SHEET_ID = '1TsKvxpoKG9S9jydhV3laAqSBgGAzck99HAtJHJIMawI';
    const FOLDER_ID = '12ADm3u72vPodkAV10Y0A82JtckVX6pIz';
    
    Logger.log('Intentando acceder a la hoja con ID: ' + SHEET_ID);
    
    // Probar acceso a la hoja
    var ss = SpreadsheetApp.openById(SHEET_ID);
    Logger.log('Acceso a la hoja exitoso');
    
    // Probar acceso a la hoja específica
    var hoja = ss.getSheetByName('FICHA_IMPORTACION');
    if (hoja) {
      Logger.log('Hoja FICHA_IMPORTACION encontrada');
      Logger.log('ID de la hoja: ' + hoja.getSheetId());
    } else {
      Logger.log('ERROR: No se encontró la hoja FICHA_IMPORTACION');
      // Listar todas las hojas disponibles
      var hojas = ss.getSheets();
      Logger.log('Hojas disponibles:');
      for (var i = 0; i < hojas.length; i++) {
        Logger.log('- ' + hojas[i].getName());
      }
    }
    
    // Probar acceso a la carpeta
    try {
      var folder = DriveApp.getFolderById(FOLDER_ID);
      Logger.log('Acceso a la carpeta exitoso: ' + folder.getName());
    } catch (e) {
      Logger.log('Error al acceder a la carpeta: ' + e.message);
    }
    
    return 'Prueba completada. Revisa los logs para más detalles.';
    
  } catch (e) {
    Logger.log('Error en probarAccesoHoja: ' + e.message + ' Stack: ' + e.stack);
    return 'Error: ' + e.message;
  }
}

// Función para verificar permisos del script
function verificarPermisos() {
  try {
    Logger.log('Verificando permisos del script...');
    
    // Verificar permisos básicos
    var user = Session.getActiveUser().getEmail();
    Logger.log('Usuario activo: ' + user);
    
    // Verificar permisos de Drive
    try {
      var rootFolder = DriveApp.getRootFolder();
      Logger.log('Permisos de Drive: OK');
    } catch (e) {
      Logger.log('Error en permisos de Drive: ' + e.message);
    }
    
    // Verificar permisos de Sheets
    try {
      var activeSpreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      if (activeSpreadsheet) {
        Logger.log('Permisos de Sheets: OK (hoja activa disponible)');
      } else {
        Logger.log('Permisos de Sheets: Parcial (no hay hoja activa)');
      }
    } catch (e) {
      Logger.log('Error en permisos de Sheets: ' + e.message);
    }
    
    return 'Verificación completada. Revisa los logs para más detalles.';
    
  } catch (e) {
    Logger.log('Error en verificarPermisos: ' + e.message);
    return 'Error: ' + e.message;
  }
}

/**
 * ****************************************************************************************************
 * ****************************************************************************************************
 * ****************************************************************************************************
 */


/* FUNCIONES PARA GENERAR PDF FICHA-IMPORTACION */

// Generar PDF de ficha importación y guardar en Drive usando exportOptions
function generarFichaImportacionPDF(datos) {
  try {
    const SHEET_ID = '1TsKvxpoKG9S9jydhV3laAqSBgGAzck99HAtJHJIMawI';
    const FOLDER_ID = '12ADm3u72vPodkAV10Y0A82JtckVX6pIz';
    
    Logger.log('Iniciando generación de PDF...');
    Logger.log('ID de la hoja: ' + SHEET_ID);
    Logger.log('ID de la carpeta: ' + FOLDER_ID);
    
    // Verificar acceso a la hoja con mejor manejo de errores
    var ss;
    try {
      ss = SpreadsheetApp.openById(SHEET_ID);
      Logger.log('Acceso a la hoja exitoso');
    } catch (e) {
      Logger.log('Error al abrir la hoja: ' + e.message);
      throw new Error('No se pudo acceder a la hoja de Google Sheets. Verifica que el ID sea correcto y que tengas permisos de acceso.');
    }
    
    // Verificar acceso a la hoja específica
    var hoja = ss.getSheetByName('FICHA_IMPORTACION');
    if (!hoja) {
      Logger.log('No se encontró la hoja FICHA_IMPORTACION');
      // Listar hojas disponibles para diagnóstico
      var hojas = ss.getSheets();
      var nombresHojas = [];
      for (var i = 0; i < hojas.length; i++) {
        nombresHojas.push(hojas[i].getName());
      }
      Logger.log('Hojas disponibles: ' + nombresHojas.join(', '));
      throw new Error('No se encontró la hoja FICHA_IMPORTACION. Hojas disponibles: ' + nombresHojas.join(', '));
    }
    
    Logger.log('Hoja FICHA_IMPORTACION encontrada correctamente');

    Logger.log('Datos recibidos: ' + JSON.stringify(datos));

  // Limpiar rangos antes de rellenar
  hoja.getRange('D11:E11').clearContent();
  hoja.getRange('I11').clearContent();
  hoja.getRange('I14').clearContent();
  hoja.getRange('D14:E14').clearContent();
  hoja.getRange('B19:B44').clearContent();
  hoja.getRange('C19:D44').clearContent();
  hoja.getRange('E19:E44').clearContent();
  hoja.getRange('F19:F44').clearContent();
  hoja.getRange('G19:G44').clearContent();
  hoja.getRange('H19:H44').clearContent();
  hoja.getRange('I19:I44').clearContent();
  hoja.getRange('J19:J44').clearContent();
  hoja.getRange('G47').clearContent();
  hoja.getRange('H47').clearContent();

    // Rellenar datos principales según especificación
    // N° Despacho -> D11:E11 (celda combinada)
    hoja.getRange('D11:E11').setValue(datos.numeroDespacho || '');
    
    // Redactado por -> I11
    hoja.getRange('I11').setValue(datos.redactadoPor || '');
    
    // Fecha -> I14
    hoja.getRange('I14').setValue(datos.fecha || '');
    
    // Tipo de carga -> D14:E14 (celda combinada)
    hoja.getRange('D14:E14').setValue(datos.tipoCarga || '');

    // Rellenar tabla de productos (filas 19-44)
    if (datos.productos && datos.productos.length > 0) {
      for (var i = 0; i < Math.min(datos.productos.length, 26); i++) {
        var fila = datos.productos[i];
        var filaHoja = 19 + i;
        // N° -> B19:B44
        hoja.getRange('B' + filaHoja).setValue(fila.numero || '');
        // Producto -> C19:D44 (celdas combinadas)
        hoja.getRange('C' + filaHoja + ':D' + filaHoja).setValue(fila.producto || '');
        // Código -> E19:E44
        hoja.getRange('E' + filaHoja).setValue(fila.codigo || '');
        // Unidad de medida -> F19:F44
        hoja.getRange('F' + filaHoja).setValue(fila.unidad || '');
        // Cantidad -> G19:G44
        hoja.getRange('G' + filaHoja).setValue(fila.cantidad || '');
        // Cantidad en Caja -> H19:H44
        hoja.getRange('H' + filaHoja).setValue(fila.cantidadEnCaja || '');
        // Verificación -> I19:I44
        hoja.getRange('I' + filaHoja).setValue(fila.verificacion || '');
        // Observaciones -> J19:J44
        hoja.getRange('J' + filaHoja).setValue(fila.observaciones || '');
      }
    }

  // Total -> G47
  hoja.getRange('G47').setValue(datos.totalCantidad || '0');
  // Total cantidad en caja -> H47
  hoja.getRange('H47').setValue(datos.totalCantidadEnCaja || '0');

    SpreadsheetApp.flush();

    // Parámetros de exportación para PDF
    var exportOptions = {
      format: 'pdf',
      portrait: true,
      size: 'A4',
      gid: hoja.getSheetId(),
      top_margin: 0.1,
      bottom_margin: 0.1,
      left_margin: 0.1,
      right_margin: 0.1,
      sheetnames: false,
      printtitle: false,
      pagenumbers: false,
      gridlines: false,
      fzr: false
    };
    
    var url = 'https://docs.google.com/spreadsheets/d/' + SHEET_ID + '/export?';
    var options = [];
    for (var key in exportOptions) {
      options.push(key + '=' + exportOptions[key]);
    }
    
    var token = ScriptApp.getOAuthToken();
    var response = UrlFetchApp.fetch(url + options.join('&'), {
      headers: {
        'Authorization': 'Bearer ' + token
      },
      muteHttpExceptions: true
    });
    
    if (response.getResponseCode() == 200) {
      // Verificar acceso a la carpeta de Drive
      var folder;
      try {
        folder = DriveApp.getFolderById(FOLDER_ID);
        Logger.log('Acceso a la carpeta exitoso: ' + folder.getName());
      } catch (e) {
        Logger.log('Error al acceder a la carpeta: ' + e.message);
        throw new Error('No se pudo acceder a la carpeta de Google Drive. Verifica que el ID sea correcto y que tengas permisos de acceso.');
      }

      var pdfFile = folder.createFile(response.getBlob());

      // Nombre del archivo más descriptivo
      var fechaActual = new Date();
      var fechaFormateada = Utilities.formatDate(fechaActual, Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
      var fileName = 'FichaImportacion_' + (datos.numeroDespacho || 'SinNumero') + '_' + fechaFormateada + '.pdf';
      pdfFile.setName(fileName);

      Logger.log('PDF generado exitosamente: ' + pdfFile.getUrl());

      // Guardar registro en HISTORIAL_FICHA_IMPORTACIONES
      guardarHistorialFichaImportacion(datos, pdfFile.getUrl());

      // ENVIAR DATOS A LA API DE PYTHON
      try {
        Logger.log('Enviando datos a la API de Python...');
        
        // Preparar datos para la API según el formato especificado
        var apiPayload = {
          "numero_despacho": datos.numeroDespacho || "",
          "tipo_carga": datos.tipoCarga || "",
          "generado_por": datos.redactadoPor || "",
          "fecha": datos.fecha || "",
          "archivo_pdf": pdfFile.getUrl() || "",
          "detalles": []
        };
        
        // Agregar detalles de productos
        if (datos.productos && datos.productos.length > 0) {
          for (var i = 0; i < datos.productos.length; i++) {
            var producto = datos.productos[i];
            apiPayload.detalles.push({
              "producto": producto.producto || "",
              "codigo": producto.codigo || "",
              "unidad_medida": producto.unidad || "",
              "cantidad": producto.cantidad || "",
              "item": producto.numero || ""
            });
          }
        }
        
        Logger.log('Payload para API: ' + JSON.stringify(apiPayload));
        
        // Llamar a la API
        var apiUrl = "https://importacionesvr01crud-2946605267.us-central1.run.app?param_post=ficha_importacion";
        var apiOptions = {
          'method': 'post',
          'contentType': 'application/json',
          'payload': JSON.stringify(apiPayload),
          'muteHttpExceptions': true
        };
        
        var apiResponse = UrlFetchApp.fetch(apiUrl, apiOptions);
        var apiResponseCode = apiResponse.getResponseCode();
        var apiResponseText = apiResponse.getContentText();
        
        Logger.log('Respuesta de la API - Código: ' + apiResponseCode);
        Logger.log('Respuesta de la API - Texto: ' + apiResponseText);
        
        if (apiResponseCode === 200 || apiResponseCode === 201) {
          Logger.log('✅ Datos enviados exitosamente a la API de Python');
        } else {
          Logger.log('⚠️ Error al enviar datos a la API. Código: ' + apiResponseCode + ', Respuesta: ' + apiResponseText);
          // No fallar el proceso principal si la API falla
        }
        
      } catch (apiError) {
        Logger.log('❌ Error en llamada a API de Python: ' + apiError.message);
        Logger.log('Stack trace: ' + apiError.stack);
        // No fallar el proceso principal si la API falla
      }

      return pdfFile.getUrl();
    } else {
      Logger.log('Error en respuesta HTTP: ' + response.getResponseCode() + ' - ' + response.getContentText());
      throw new Error('Error al generar el PDF: ' + response.getContentText());
    }
  } catch (e) {
    Logger.log('Error en generarFichaImportacionPDF: ' + e.message + ' Stack: ' + e.stack);
    throw e;
  }
}


/**
 * ****************************************************************************************************
 * ****************************************************************************************************
 * ****************************************************************************************************
 */


/* HISTORIAL DE FICHA-IMPORTACION */

/**
 * Devuelve todos los registros de la hoja HISTORIAL_FICHA_IMPORTACIONES como array de arrays.
 * Cada subarray representa una fila (sin cabecera).
 * @return {string} JSON de registros
 */
function obtenerHistorialFichaImportaciones() {
  try {
    var ss = SpreadsheetApp.openById('1TsKvxpoKG9S9jydhV3laAqSBgGAzck99HAtJHJIMawI');
    var hoja = ss.getSheetByName('HISTORIAL_FICHA_IMPORTACIONES');
    if (!hoja) {
      return JSON.stringify([]);
    }
    var datos = hoja.getDataRange().getValues();
    if (datos.length === 0) {
      return JSON.stringify([]);
    }
    // Detectar si la primera fila es cabecera
    var primeraFila = datos[0];
    var esCabecera = false;
    if (
      primeraFila[0] && typeof primeraFila[0] === 'string' &&
      primeraFila[0].toString().toUpperCase().indexOf('DESPACHO') !== -1
    ) {
      esCabecera = true;
    }
    // Omitir cabecera si existe
    var registros = esCabecera ? datos.slice(1) : datos;
    // Filtrar filas completamente vacías
    registros = registros.filter(function(fila) {
      return fila.some(function(celda) {
        return String(celda).trim() !== '';
      });
    });
    // Formatear la fecha (columna 2) a 'dd/MM/yyyy HH:mm:ss' si es formato ISO
    registros = registros.map(function(fila) {
      if (fila[1]) {
        var fecha = new Date(fila[1]);
        if (!isNaN(fecha.getTime())) {
          var tz = Session.getScriptTimeZone ? Session.getScriptTimeZone() : "America/Lima";
          fila[1] = Utilities.formatDate(fecha, tz, "dd/MM/yyyy HH:mm:ss");
        }
      }
      return fila;
    });
    return JSON.stringify(registros);
  } catch (e) {
    return JSON.stringify([]);
  }
}
/**
 * Guarda el registro de ficha importación en la hoja HISTORIAL_FICHA_IMPORTACIONES
 * @param {Object} datos - Datos de la ficha importación
 * @param {string} urlPDF - URL del PDF generado
 */
function guardarHistorialFichaImportacion(datos, urlPDF) {
  var ss = SpreadsheetApp.openById('1TsKvxpoKG9S9jydhV3laAqSBgGAzck99HAtJHJIMawI');
  var hoja = ss.getSheetByName('HISTORIAL_FICHA_IMPORTACIONES');
  if (!hoja) throw new Error('No se encontró la hoja HISTORIAL_FICHA_IMPORTACIONES');

  var fechaHora = Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyy-MM-dd HH:mm:ss');
  var fila = [
    datos.numeroDespacho,
    fechaHora,
    datos.tipoCarga,
    datos.redactadoPor,
    urlPDF
  ];
  hoja.appendRow(fila);
}

/**
 * ****************************************************************************************************
 * ****************************************************************************************************
 * ****************************************************************************************************
 */

/**
 * FUNCIONES PARA INCIDENCIAS LOGÍSTICAS
 * ****************************************************************************************************
 */

/**
 * Guarda una incidencia logística enviando los datos a la API externa
 * @param {Object} datos - Datos de la incidencia
 * @return {Object} Respuesta con success y mensaje
 */
function guardarIncidenciaLogistica(datos) {
  try {
    console.log('Iniciando guardado de incidencia logística...');
    console.log('Datos recibidos:', JSON.stringify(datos));
    
    // Validar datos requeridos
    if (!datos.id_importaciones) {
      return { success: false, error: 'ID de importaciones es requerido' };
    }
    
    if (!datos.productos || datos.productos.length === 0) {
      return { success: false, error: 'Debe incluir al menos un producto' };
    }
    
    // Preparar datos para la API
    const apiData = {
      id_importaciones: parseInt(datos.id_importaciones),
      observaciones: datos.observaciones || '',
      detalles: datos.productos.map(function(producto) {
        return {
          producto: producto.producto,
          codigo: producto.codigo,
          unidad_medida: producto.unidad_medida,
          cantidad_inicial: producto.cantidad_inicial,
          cantidad_recibida: producto.cantidad_recibida,
          motivo: producto.motivo
        };
      })
    };
    
    // Si hay archivo PDF, subirlo a Drive primero
    if (datos.archivo_base64 && datos.nombre_archivo) {
      try {
        const folder = DriveApp.getFolderById('1v-VUrwf_H5Ola5s7UojEx6NQ65KkDJDR'); // Mismo folder que importaciones
        const blob = Utilities.newBlob(Utilities.base64Decode(datos.archivo_base64), MimeType.PDF, datos.nombre_archivo);
        const archivoSubido = folder.createFile(blob);
        const pdfUrl = archivoSubido.getUrl();
        
        console.log('PDF subido exitosamente:', pdfUrl);
        apiData.pdf_url = pdfUrl;
        
      } catch (driveError) {
        console.log('Error al subir PDF a Drive:', driveError.message);
        return { success: false, error: 'Error al subir el archivo PDF: ' + driveError.message };
      }
    }
    
    const payloadJson = JSON.stringify(apiData);
    console.log('Datos a enviar a la API:', JSON.stringify(apiData));
    console.log('Payload JSON string:', payloadJson);
    console.log('Payload length:', payloadJson.length);
    
    // Verificar si el payload es demasiado grande
    if (payloadJson.length > 50000000) {
      console.log('⚠️ ADVERTENCIA: Payload muy grande (' + payloadJson.length + ' caracteres)');
    }
    
    // Llamar a la API
    const apiUrl = 'https://incidenciaslogisticacrud-2946605267.us-central1.run.app';
    const options = {
      'method': 'post',
      'contentType': 'application/json',
      'payload': payloadJson,
      'muteHttpExceptions': true
    };
    
    console.log('Options object:', JSON.stringify(options));
    console.log('Enviando datos a la API:', apiUrl);
    const response = UrlFetchApp.fetch(apiUrl, options);
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    console.log('Respuesta de la API - Código:', responseCode);
    console.log('Respuesta de la API - Texto:', responseText);
    
    if (responseCode === 200 || responseCode === 201) {
      console.log('Incidencia guardada exitosamente en la API');
      return { success: true, message: 'Incidencia guardada exitosamente' };
    } else {
      console.log('Error en la API - Código:', responseCode, '- Respuesta:', responseText);
      return { success: false, error: 'Error en la API: ' + responseText };
    }
    
  } catch (error) {
    console.log('Error en guardarIncidenciaLogistica:', error.message);
    console.log('Stack trace:', error.stack);
    return { success: false, error: 'Error interno: ' + error.message };
  }
}



/**
 * Prueba específica para el endpoint de incidencias logísticas
 */
function probarAPIIncidenciasLogisticas() {
  try {
    console.log('=== PRUEBA DE API DE INCIDENCIAS LOGÍSTICAS ===');
    
    const apiUrl = 'https://incidenciaslogisticacrud-2946605267.us-central1.run.app';
    
    // Prueba GET
    console.log('🔍 Probando GET request...');
    const getResponse = UrlFetchApp.fetch(apiUrl, {
      'method': 'get',
      'muteHttpExceptions': true
    });
    console.log('GET Response Code:', getResponse.getResponseCode());
    console.log('GET Response Text:', getResponse.getContentText());
    
    // Prueba POST con payload mínimo
    console.log('🔍 Probando POST request...');
    const testPayload = {
      "id_importaciones": 1,
      "observaciones": "Prueba de conectividad",
      "detalles": [
        {
          "producto": "Producto de prueba",
          "codigo": "TEST-001",
          "unidad_medida": "UNIDADES",
          "cantidad_inicial": 10,
          "cantidad_recibida": 8,
          "motivo": "Prueba"
        }
      ]
    };
    
    const postResponse = UrlFetchApp.fetch(apiUrl, {
      'method': 'post',
      'contentType': 'application/json',
      'payload': JSON.stringify(testPayload),
      'muteHttpExceptions': true
    });
    
    console.log('POST Response Code:', postResponse.getResponseCode());
    console.log('POST Response Text:', postResponse.getContentText());
    
    return {
      success: true,
      getCode: getResponse.getResponseCode(),
      getText: getResponse.getContentText(),
      postCode: postResponse.getResponseCode(),
      postText: postResponse.getContentText()
    };
    
  } catch (error) {
    console.log('❌ Error en prueba de API de incidencias:', error.message);
    return { success: false, error: error.message };
  }
}

/**
 * Verifica el estado de la hoja de importaciones
 */
function verificarHojaImportaciones() {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    const hoja = ss.getSheetByName('AREA_IMPORTACIONES');
    
    if (!hoja) {
      return { success: false, error: 'No existe la hoja AREA_IMPORTACIONES' };
    }
    
    const ultimaFila = hoja.getLastRow();
    const ultimaColumna = hoja.getLastColumn();
    
    return {
      success: true,
      existe: true,
      ultimaFila: ultimaFila,
      ultimaColumna: ultimaColumna,
      puedeEscribir: true // Asumiendo que el script tiene permisos
    };
    
  } catch (error) {
    return { success: false, error: error.message };
  }
}

/**
 * Obtiene las incidencias logísticas desde la API
 * @return {string} JSON con las incidencias
 */
function obtenerIncidenciasLogisticas() {
  try {
    const apiUrl = 'https://incidenciaslogisticacrud-2946605267.us-central1.run.app';
    const response = UrlFetchApp.fetch(apiUrl, {
      'method': 'get',
      'muteHttpExceptions': true
    });
    
    const responseCode = response.getResponseCode();
    const responseText = response.getContentText();
    
    console.log('Respuesta de la API de incidencias - Código:', responseCode);
    console.log('Respuesta de la API de incidencias - Texto:', responseText);
    
    if (responseCode === 200) {
      return responseText;
    } else {
      console.log('Error al obtener incidencias:', responseText);
      return JSON.stringify([]);
    }
    
  } catch (error) {
    console.log('Error en obtenerIncidenciasLogisticas:', error.message);
    return JSON.stringify([]);
  }
}

/**
 * Sube un archivo PDF de incidencia a Google Drive y retorna la URL
 * @param {Object} datos - Datos del archivo (archivo_base64, nombre_archivo)
 * @return {Object} Respuesta con success y pdf_url
 */
function subirPDFIncidencia(datos) {
  try {
    console.log('Iniciando subida de PDF de incidencia...');
    console.log('Datos recibidos:', JSON.stringify({
      nombre_archivo: datos.nombre_archivo,
      archivo_base64: datos.archivo_base64 ? 'BASE64_PRESENTE' : 'NO_PRESENTE'
    }));
    
    // Validar datos requeridos
    if (!datos.archivo_base64 || !datos.nombre_archivo) {
      return { success: false, error: 'Archivo base64 y nombre de archivo son requeridos' };
    }
    
    // Subir archivo a Drive
    const folder = DriveApp.getFolderById('1v-VUrwf_H5Ola5s7UojEx6NQ65KkDJDR'); // Mismo folder que importaciones
    const blob = Utilities.newBlob(Utilities.base64Decode(datos.archivo_base64), MimeType.PDF, datos.nombre_archivo);
    const archivoSubido = folder.createFile(blob);
    const pdfUrl = archivoSubido.getUrl();
    
    console.log('PDF subido exitosamente:', pdfUrl);
    
    return { 
      success: true, 
      pdf_url: pdfUrl,
      message: 'PDF subido exitosamente'
    };
    
  } catch (error) {
    console.log('Error en subirPDFIncidencia:', error.message);
    console.log('Stack trace:', error.stack);
    return { success: false, error: 'Error al subir el archivo PDF: ' + error.message };
  }
}



