//AQUI EL JAVASCRIPT PARA MANIPULAR EL HTML

function calcular(){
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

}