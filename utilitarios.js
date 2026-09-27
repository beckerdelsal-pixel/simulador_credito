function recuperarTexto(idComponente) {
    let componente = document.getElementById(idComponente);
    let valor = componente.value;
    return valor;
}

function recuperarFloat(idComponente) {
    let valortexto = recuperarTexto(idComponente);
    let valorFloat = parseFloat(valortexto);
    return valorFloat;
}

function recuperarEntero(idComponente) {
    let valortexto = recuperarTexto(idComponente);
    let valorEntero = parseInt(valortexto);
    return valorEntero;
}

function mostrarEnSpan(idComponente, valor) {
    let componente = document.getElementById(idComponente);
    componente.textContent = valor;
}