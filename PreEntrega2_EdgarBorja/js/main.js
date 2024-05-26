document.getElementById('loanForm').addEventListener('submit', function(evento) {
    evento.preventDefault()
    
    let montoPrestamoEntrada = document.getElementById('montoPrestamo')
    let tasaInteresEntrada = document.getElementById('tasaInteres')
    let plazoPrestamoEntrada = document.getElementById('plazoPrestamo')
    
    let montoPrestamo = parseFloat(montoPrestamoEntrada.value)
    let tasaInteres = parseFloat(tasaInteresEntrada.value) / 100 // Convertir a decimal
    let plazoPrestamo = parseInt(plazoPrestamoEntrada.value)
    
    if (isNaN(montoPrestamo) || isNaN(tasaInteres) || isNaN(plazoPrestamo) || montoPrestamo <= 0 || tasaInteres <= 0 || plazoPrestamo <= 0) {
        alert("Por favor, ingrese valores válidos para el monto del préstamo, la tasa de interés y el plazo del préstamo.")
        return
    }
    
    let tasaInteresMensual = tasaInteres / 12
    let totalPagos = plazoPrestamo * 12
    let pagoMensual = montoPrestamo / totalPagos
    
    let pagosMensuales = []
    let interesesMensuales = []
    let principalesMensuales = []
    let saldosPendientes = []
    
    let saldo = montoPrestamo
    for (let mes = 1; mes <= totalPagos; mes++) {
        let interes = saldo * tasaInteresMensual
        let principal = pagoMensual - interes
        saldo -= principal
        
        pagosMensuales.push(pagoMensual)
        interesesMensuales.push(interes)
        principalesMensuales.push(principal)
        saldosPendientes.push(saldo)
    }
    
    mostrarTablaAmortizacion(pagosMensuales, interesesMensuales, principalesMensuales, saldosPendientes)

    function mostrarTablaAmortizacion(pagos, intereses, principales, saldos) {
        let tablaAmortizacion = "<h2>Tabla de Amortización</h2><table><tr><th>Mes</th><th>Pago Mensual</th><th>Interés</th><th>Principal</th><th>Saldo Pendiente</th></tr>"
    
        for (let mes = 0; mes < totalPagos; mes++) {
            tablaAmortizacion += `<tr>
                <td>${mes + 1}</td>
                <td>$${pagos[mes].toFixed(2)}</td>
                <td>$${intereses[mes].toFixed(2)}</td>
                <td>$${principales[mes].toFixed(2)}</td>
                <td>$${saldos[mes].toFixed(2)}</td>
            </tr>`
        }
        
        tablaAmortizacion += "</table>"
        
        document.getElementById('tablaAmortizacion').innerHTML = tablaAmortizacion
    }

    document.getElementById('buscarPago').addEventListener('click', function() {
        let mesBuscar = parseInt(document.getElementById('mesBuscar').value)
        if (isNaN(mesBuscar) || mesBuscar < 1 || mesBuscar > totalPagos) {
            alert("Por favor, ingrese un número de mes válido.")
            return
        }

        let resultado = {
            mes: mesBuscar,
            pago: pagosMensuales[mesBuscar - 1],
            interes: interesesMensuales[mesBuscar - 1],
            principal: principalesMensuales[mesBuscar - 1],
            saldo: saldosPendientes[mesBuscar - 1]
        }

        alert(`Mes: ${resultado.mes}\nPago Mensual: $${resultado.pago.toFixed(2)}\nInterés: $${resultado.interes.toFixed(2)}\nPrincipal: $${resultado.principal.toFixed(2)}\nSaldo Pendiente: $${resultado.saldo.toFixed(2)}`)
    })

    document.getElementById('filtrarInteres').addEventListener('click', function() {
        let interesMinimo = parseFloat(document.getElementById('interesMinimo').value)
        if (isNaN(interesMinimo) || interesMinimo < 0) {
            alert("Por favor, ingrese un valor de interés válido.")
            return
        }

        let resultados = []
        for (let mes = 0; mes < totalPagos; mes++) {
            if (interesesMensuales[mes] > interesMinimo) {
                resultados.push({
                    mes: mes + 1,
                    pago: pagosMensuales[mes],
                    interes: interesesMensuales[mes],
                    principal: principalesMensuales[mes],
                    saldo: saldosPendientes[mes]
                })
            }
        }

        if (resultados.length > 0) {
            let resultadosHTML = "<h2>Pagos con Interés Mayor a $" + interesMinimo.toFixed(2) + "</h2><table><tr><th>Mes</th><th>Pago Mensual</th><th>Interés</th><th>Principal</th><th>Saldo Pendiente</th></tr>"
            resultados.forEach(resultado => {
                resultadosHTML += `<tr>
                    <td>${resultado.mes}</td>
                    <td>$${resultado.pago.toFixed(2)}</td>
                    <td>$${resultado.interes.toFixed(2)}</td>
                    <td>$${resultado.principal.toFixed(2)}</td>
                    <td>$${resultado.saldo.toFixed(2)}</td>
                </tr>`
            })
            resultadosHTML += "</table>"
            document.getElementById('resultadosFiltrados').innerHTML = resultadosHTML
        } else {
            document.getElementById('resultadosFiltrados').innerHTML = "<p>No se encontraron pagos con interés mayor a $" + interesMinimo.toFixed(2) + ".</p>"
        }
    })
})
