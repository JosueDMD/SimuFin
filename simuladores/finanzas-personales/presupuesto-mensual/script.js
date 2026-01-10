// Obtener valor numérico de un input
function getValue(id) {
  const value = document.getElementById(id).value;
  return value === "" ? 0 : Number(value);
}

// Formato de moneda
function formatoMoneda(valor) {
  return valor.toLocaleString("es-MX", {
    style: "currency",
    currency: "MXN"
  });
}

// Calcular ingresos
function calcularIngresos() {
  return getValue("ingreso") + getValue("extra");
}

// Calcular gastos
function calcularGastos() {
  const gastos = [
    getValue("vivienda"),
    getValue("alimentacion"),
    getValue("transporte"),
    getValue("servicios"),
    getValue("entretenimiento"),
    getValue("otros")
  ];
  return gastos.reduce((total, g) => total + g, 0);
}

// Validaciones
function validarDatos(ingresos, ahorro) {
  if (ingresos <= 0) {
    return "Debes ingresar al menos un ingreso mensual.";
  }
  if (ahorro < 0) {
    return "El ahorro no puede ser negativo.";
  }
  if (ahorro > ingresos) {
    return "El ahorro no puede ser mayor que tus ingresos.";
  }
  return null;
}

// Evaluar presupuesto
function evaluarPresupuesto(ingresos, gastos, ahorro) {
  const saldoDisponible = ingresos - gastos;
  const porcentajeGastos = (gastos / ingresos) * 100;
  const brechaAhorro = Math.max(ahorro - saldoDisponible, 0); // Solo positivo si hay faltante
  
  let estado, mensaje, color, detalleExtra = "";

  if (saldoDisponible < 0) {
    estado = "🔴 Presupuesto no viable";
    mensaje = `Tus gastos superan tus ingresos por $${Math.abs(saldoDisponible).toFixed(2)}. Es necesario reducir gastos.`;
    color = "red";
    detalleExtra = `Déficit total: -$${Math.abs(saldoDisponible).toFixed(2)}`;
  } else if (saldoDisponible < ahorro) {
    estado = "🟡 Presupuesto ajustado";
    mensaje = `Para tu meta de $${ahorro.toFixed(2)}, te faltan $${brechaAhorro.toFixed(2)}.`;
    color = "orange";
    detalleExtra = `Saldo disponible: $${saldoDisponible.toFixed(2)} | Brecha: $${brechaAhorro.toFixed(2)}`;
  } else {
    estado = "🟢 Presupuesto saludable";
    mensaje = `¡Excelente! Superas tu meta de ahorro por $${(saldoDisponible - ahorro).toFixed(2)}.`;
    color = "green";
    detalleExtra = `Saldo disponible: $${saldoDisponible.toFixed(2)} | Excedente: $${(saldoDisponible - ahorro).toFixed(2)}`;
  }

  return { 
    saldoDisponible, 
    porcentajeGastos, 
    brechaAhorro,
    estado, 
    mensaje, 
    color,
    detalleExtra
  };
}

// Mostrar resultados
function mostrarResultados(resultado, ingresos, gastos, ahorro) {
  let mensajeBalanceHTML = "";
  
  if (resultado.saldoDisponible < 0) {
    mensajeBalanceHTML = `
      <div class="balance-item deficit">
        <span class="balance-icon">🔴</span>
        <span class="balance-label">Déficit:</span>
        <span class="balance-value">${formatoMoneda(Math.abs(resultado.saldoDisponible))}</span>
      </div>
    `;
  } else if (resultado.brechaAhorro > 0) {
    mensajeBalanceHTML = `
      <div class="balance-item saldo">
        <span class="balance-icon">💰</span>
        <span class="balance-label">Saldo disponible:</span>
        <span class="balance-value">${formatoMoneda(resultado.saldoDisponible)}</span>
      </div>
      <div class="balance-item faltante">
        <span class="balance-icon">⚠️</span>
        <span class="balance-label">Faltante para tu meta:</span>
        <span class="balance-value">${formatoMoneda(resultado.brechaAhorro)}</span>
      </div>
    `;
  } else {
    const excedente = resultado.saldoDisponible - ahorro;
    mensajeBalanceHTML = `
      <div class="balance-item saldo">
        <span class="balance-icon">💰</span>
        <span class="balance-label">Saldo disponible:</span>
        <span class="balance-value">${formatoMoneda(resultado.saldoDisponible)}</span>
      </div>
      <div class="balance-item excedente">
        <span class="balance-icon">✅</span>
        <span class="balance-label">Excedes tu meta por:</span>
        <span class="balance-value">${formatoMoneda(excedente)}</span>
      </div>
    `;
  }
  
  // Consejo basado en porcentaje de gastos
  let consejoHTML = "";
  if (resultado.porcentajeGastos > 80) {
    consejoHTML = `<div class="consejo-alto">⚠️ Tus gastos representan más del 80% de tus ingresos. Considera reducirlos.</div>`;
  } else if (resultado.porcentajeGastos < 50) {
    consejoHTML = `<div class="consejo-bueno">✅ Buen control de gastos. Menos del 50% en gastos fijos.</div>`;
  } else {
    consejoHTML = `<div class="consejo-moderado">📈 Tu porcentaje de gastos está dentro de un rango moderado.</div>`;
  }
  
  document.getElementById("resultado").innerHTML = `
    <div class="resultado-container ${resultado.color}">
      <h2 class="estado">${resultado.estado}</h2>
      
      <div class="datos-principales">
        <div class="dato">
          <span class="dato-icono">📥</span>
          <span class="dato-label">Ingresos:</span>
          <span class="dato-valor">${formatoMoneda(ingresos)}</span>
        </div>
        <div class="dato">
          <span class="dato-icono">📤</span>
          <span class="dato-label">Gastos:</span>
          <span class="dato-valor">${formatoMoneda(gastos)}</span>
        </div>
        <div class="separador"></div>
        <div class="dato">
          <span class="dato-icono">🎯</span>
          <span class="dato-label">Meta de ahorro:</span>
          <span class="dato-valor">${formatoMoneda(ahorro)}</span>
        </div>
      </div>
      
      <div class="analisis-balance">
        <h3 class="analisis-titulo">Situación actual</h3>
        <div class="balance-detalle">
          ${mensajeBalanceHTML}
        </div>
      </div>
      
      <div class="metricas-adicionales">
        <div class="metrica">
          <span class="metrica-label">Porcentaje de gastos:</span>
          <span class="metrica-valor">${resultado.porcentajeGastos.toFixed(1)}%</span>
        </div>
        ${consejoHTML}
      </div>
      
      <div class="mensaje-final">
        <p>${resultado.mensaje}</p>
      </div>
      
      <button class="btn btn-nueva" onclick="location.reload()">Nueva simulación</button>
    </div>
  `;
}

// Función principal
function simularPresupuesto() {
  const ingresos = calcularIngresos();
  const gastos = calcularGastos();
  const ahorro = getValue("ahorro");

  const error = validarDatos(ingresos, ahorro);
  if (error) {
    document.getElementById("resultado").innerHTML =
      `<p style="color:red">${error}</p>`;
    return;
  }

  const resultado = evaluarPresupuesto(ingresos, gastos, ahorro);
  mostrarResultados(resultado, ingresos, gastos, ahorro);
}
