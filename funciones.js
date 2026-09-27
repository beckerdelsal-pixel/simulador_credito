//AQUI TODA LA LOGICA DE LAS FUNCIONES DEL NEGOCIO

function calcularDisponible(ingresos, egresos){
    let total = 0;
    total = ingresos - egresos;
    if (total < 0) {
        total = 0;
    }
    return total;
}