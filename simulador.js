//AQUI EL JAVASCRIPT PARA MANIPULAR EL HTML

function calcular(){
    let ingresos = recuperarFloat("txtIngresos");
    let egresos = recuperarFloat("txtEgresos");
    let disponible = calcularDisponible(ingresos, egresos).toFixed(2);
    mostrarEnSpan("spnDisponible", disponible);

    let capacidadPago = calcularCapacidadDePago(disponible).toFixed(2);
    mostrarEnSpan("spnCapacidadPago", capacidadPago);

    let monto = recuperarEntero("txtMonto");
    let plazo = recuperarEntero("txtPlazo");
    let tasa = recuperarEntero("txtTasaInteres");
    let interesSimple=calcularInteresSimple(monto, tasa, plazo);
    mostrarEnSpan("spnInteresPagar",interesSimple);

    let total = calcularTotalPagar(monto, interesSimple);
    mostrarEnSpan("spnTotalPrestamo",total);

}