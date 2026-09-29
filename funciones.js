//AQUI TODA LA LOGICA DE LAS FUNCIONES DEL NEGOCIO

function calcularDisponible(ingresos, egresos){
    let total = 0;
    total = ingresos - egresos;
    if (total < 0) {
        total = 0;
    }
    return total;
}

function calcularCapacidadDePago(montoDisponible){
    let capacidad = 0;
    capacidad = montoDisponible * 0.50;
    return capacidad;   
}

function calcularInteresSimple(monto, tasa, plazoAnios){
    let interes = 0;
    interes =plazoAnios * monto * (tasa/100);
    return interes;
}

function calcularTotalPagar(monto, interes){
    let total = monto + interes + 100;
    return total;
}

function calcularCuotaMensual(total, plazoAnios){
    let cuotaMensual = total / (plazoAnios*12);
    return cuotaMensual;
}

function aprobarCredito(capacidadPago, cuotaMensual){
    if(capacidadPago > cuotaMensual){
        return true;
    }else{
        return false;
    }
}
