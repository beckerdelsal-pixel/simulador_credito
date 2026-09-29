//AQUI EL JAVASCRIPT PARA MANIPULAR EL HTML
// Obtiene correctamente números como:
// 2000       -> 2000
// 2.000      -> 2000
// 2.000,50   -> 2000.50

function obtenerNumero(id) {

    let valor = document.getElementById(id).value.trim();

    // Elimina los puntos utilizados como separadores de miles
    valor = valor.replace(/\./g, "");

    // Convierte la coma decimal en punto
    valor = valor.replace(",", ".");

    return Number(valor);
}
// Coloca automáticamente puntos como separadores de miles.
//
// Ejemplos:
// 2000   -> 2.000
// 80000  -> 80.000
// 2500   -> 2.500
// 80000,50 -> 80.000,50
function formatearInputNumerico(input) {

     // ==========================================
    // TASA DE INTERÉS
    // Máximo 2 caracteres
    // Mínimo 1
    // Solo números
    // ==========================================

    if (input.id === "txtTasaInteres") {

        input.value = input.value
            .replace(/\D/g, "")
            .slice(0, 2);

        return;
    }

    let valor = input.value.replace(/[^\d,.-]/g, "");

    let negativo = valor.startsWith("-");

    valor = valor.replace(/-/g, "");

    let partes = valor.split(",");

    let entero = partes[0].replace(/\./g, "");

    let decimal = partes.length > 1
        ? partes.slice(1).join("").replace(/\D/g, "")
        : "";

    if (entero === "") {
        input.value = negativo ? "-" : "";
        return;
    }

    entero = entero.replace(/\D/g, "");

    entero = entero.replace(
        /\B(?=(\d{3})+(?!\d))/g,
        "."
    );

    input.value =
        (negativo ? "-" : "") +
        entero +
        (partes.length > 1 ? "," + decimal : "");
}
// Formato para mostrar valores monetarios.
//
// Ejemplo:
// 80000 -> $ 80.000,00
function formatearMoneda(valor) {

    return "$ " + Number(valor).toLocaleString("es-EC", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

function mostrarError(id, mensaje) {

    let error = document.getElementById("error-" + id);
    let input = document.getElementById(id);

    error.textContent = mensaje;

    input.classList.add("input-invalido");
    input.classList.remove("input-valido");
}


function limpiarError(id) {

    let error = document.getElementById("error-" + id);
    let input = document.getElementById(id);

    error.textContent = "";

    input.classList.remove("input-invalido");
    input.classList.add("input-valido");
}

function validarCampos() {

    let valido = true;

    let campos = [
        "txtIngresos",
        "txtEgresos",
        "txtMonto",
        "txtPlazo",
        "txtTasaInteres"
    ];

    campos.forEach(function(id) {

        let input = document.getElementById(id);
        let valorOriginal = input.value.trim();

        // Campo vacío
        if (valorOriginal === "") {

            mostrarError(
                id,
                "Este campo es obligatorio."
            );

            valido = false;
            return;
        }

        let numero = obtenerNumero(id);

        // No numérico
        if (!Number.isFinite(numero)) {

            mostrarError(
                id,
                "Ingrese únicamente un valor numérico."
            );

            valido = false;
            return;
        }

        limpiarError(id);
    });


    // ===============================
    // VALIDACIÓN DEL MONTO
    // Mínimo: $2.000
    // Máximo: $80.000
    // ===============================

    if (document.getElementById("txtMonto").value.trim() !== "") {

        let monto = obtenerNumero("txtMonto");

        if (
            Number.isFinite(monto) &&
            (monto < 2000 || monto > 80000)
        ) {

            mostrarError(
                "txtMonto",
                "El monto debe estar entre $ 2.000 y $ 80.000."
            );

            valido = false;
        }
    }


    // ===============================
    // VALIDACIÓN DEL PLAZO
    // ===============================

    if (document.getElementById("txtPlazo").value.trim() !== "") {

        let plazo = obtenerNumero("txtPlazo");

        if (Number.isFinite(plazo) && plazo <= 0) {

            mostrarError(
                "txtPlazo",
                "El plazo debe ser mayor que 0."
            );

            valido = false;
        }
    }


    // ===============================
    // VALIDACIÓN DE TASA DE INTERÉS
    // Mínimo: 1 carácter
    // Máximo: 2 caracteres
    // Solo números enteros
    // Mayor que 0
    // ===============================

    let tasaInput = document.getElementById("txtTasaInteres");

    if (tasaInput.value.trim() !== "") {

        let tasa = tasaInput.value.trim();

        if (tasa.length < 1 || tasa.length > 2) {

            mostrarError(
                "txtTasaInteres",
                "La tasa debe tener entre 1 y 2 caracteres."
            );

            valido = false;

        } else if (!/^\d+$/.test(tasa)) {

            mostrarError(
                "txtTasaInteres",
                "La tasa debe contener únicamente números."
            );

            valido = false;

        } else if (Number(tasa) <= 0) {

            mostrarError(
                "txtTasaInteres",
                "La tasa de interés debe ser mayor que 0%."
            );

            valido = false;

        } else {

            limpiarError("txtTasaInteres");
        }
    }


    return valido;
}

document.addEventListener("DOMContentLoaded", function() {

    let camposNumericos = [
        "txtIngresos",
        "txtEgresos",
        "txtMonto",
        "txtPlazo",
        "txtTasaInteres"
    ];

    camposNumericos.forEach(function(id) {

        let input = document.getElementById(id);

        input.addEventListener("input", function() {

            formatearInputNumerico(input);

        });

    });

});

function calcular() {

    if (!validarCampos()) {
        return;
    }

    // Datos financieros
    let ingresos = obtenerNumero("txtIngresos");
    let egresos = obtenerNumero("txtEgresos");

    let disponible = calcularDisponible(ingresos, egresos);
    mostrarEnSpan("spnDisponible", formatearMoneda(disponible));

    let capacidadPago = calcularCapacidadDePago(disponible);
    mostrarEnSpan("spnCapacidadPago", formatearMoneda(capacidadPago));

    // Datos de la solicitud
    let monto = obtenerNumero("txtMonto");
    let plazo = obtenerNumero("txtPlazo");
    let tasa = obtenerNumero("txtTasaInteres");

    // Primero verificamos si el crédito puede aprobarse
    // usando solamente la capacidad de pago y el monto/plazo solicitado.
    let interesSimple = calcularInteresSimple(monto, tasa, plazo);
    let total = calcularTotalPagar(monto, interesSimple);
    let cuotaMensual = calcularCuotaMensual(total, plazo);

    let resultado = aprobarCredito(capacidadPago, cuotaMensual);

    if (resultado == true) {

        // Crédito aprobado: ahora sí mostramos los cálculos
        mostrarEnSpan("spnInteresPagar", formatearMoneda(interesSimple));
        mostrarEnSpan("spnTotalPrestamo", formatearMoneda(total));
        mostrarEnSpan("spnCuotaMensual", formatearMoneda(cuotaMensual));

        mostrarEnSpan("spnEstadoCredito", "CREDITO APROBADO!!");

    } else {

        // Crédito rechazado: NO se muestran los cálculos
        mostrarEnSpan("spnInteresPagar", "0.00");
        mostrarEnSpan("spnTotalPrestamo", "0.00");
        mostrarEnSpan("spnCuotaMensual", "0.00");

        mostrarEnSpan("spnEstadoCredito", "CREDITO RECHAZADO!!");
    }
}

/*function calcular(){
    let ingresos = recuperarFloat("txtIngresos");
    let egresos = recuperarFloat("txtEgresos");
    let disponible = calcularDisponible(ingresos, egresos);
    mostrarEnSpan("spnDisponible", disponible.toFixed(2));

    let capacidadPago = calcularCapacidadDePago(disponible);
    mostrarEnSpan("spnCapacidadPago", capacidadPago.toFixed(2));

    let monto = recuperarEntero("txtMonto");
    let plazo = recuperarEntero("txtPlazo");
    let tasa = recuperarEntero("txtTasaInteres");
    let interesSimple=calcularInteresSimple(monto, tasa, plazo);
    mostrarEnSpan("spnInteresPagar",interesSimple);

    let total = calcularTotalPagar(monto, interesSimple);
    mostrarEnSpan("spnTotalPrestamo",total);

    let cuotaMensual = calcularCuotaMensual(total, plazo);
    mostrarEnSpan("spnCuotaMensual",cuotaMensual.toFixed(2));

    let resultado = aprobarCredito(capacidadPago,cuotaMensual);
    if(resultado == true){
        mostrarEnSpan("spnEstadoCredito", "CREDITO APROBADO!!");
    }else{
        mostrarEnSpan("spnEstadoCredito", "CREDITO RECHAZADO!!");
    }

}*/

//unicamente creado para probar la funcion completa, aun no lo solicita en el reto
function reiniciar() {

    // Limpiar campos de entrada
    document.getElementById("txtIngresos").value = "";
    document.getElementById("txtEgresos").value = "";
    document.getElementById("txtMonto").value = "";
    document.getElementById("txtPlazo").value = "";
    document.getElementById("txtTasaInteres").value = "";

    // Limpiar mensajes de error
    let errores = [
        "error-txtIngresos",
        "error-txtEgresos",
        "error-txtMonto",
        "error-txtPlazo",
        "error-txtTasaInteres"
    ];

    errores.forEach(function(id) {
        let error = document.getElementById(id);
        if (error !== null) {
            error.textContent = "";
        }
    });

    // Quitar estilos de validación
    let campos = [
        "txtIngresos",
        "txtEgresos",
        "txtMonto",
        "txtPlazo",
        "txtTasaInteres"
    ];

    campos.forEach(function(id) {
        let input = document.getElementById(id);

        if (input !== null) {
            input.classList.remove("input-invalido");
            input.classList.remove("input-valido");
        }
    });

    // Reiniciar resultados
    mostrarEnSpan("spnDisponible", "0.00");
    mostrarEnSpan("spnCapacidadPago", "0.00");
    mostrarEnSpan("spnInteresPagar", "0.00");
    mostrarEnSpan("spnTotalPrestamo", "0.00");
    mostrarEnSpan("spnCuotaMensual", "0.00");

    // Reiniciar estado del crédito
    mostrarEnSpan("spnEstadoCredito", "ANALIZANDO...");
}