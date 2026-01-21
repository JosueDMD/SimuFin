// =======================
// Elementos del DOM
// =======================
const inputs = {
  salario: document.getElementById('salario'),
  otrosIngresos: document.getElementById('otros-ingresos'),
  renta: document.getElementById('renta'),
  servicios: document.getElementById('servicios'),
  transporte: document.getElementById('transporte'),
  seguros: document.getElementById('seguros'),
  comida: document.getElementById('comida'),
  entretenimiento: document.getElementById('entretenimiento'),
  personal: document.getElementById('personal'),
  otrosGastos: document.getElementById('otros-gastos')
};

const btnCalcular = document.getElementById('calcular');
const seccionResultados = document.getElementById('resultados');
const mensajeAlerta = document.getElementById('mensaje-alerta');

// =======================
// Utilidades
// =======================

// Formatear como moneda
function formatMoney(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

// Obtener valor de input
function getInputValue(input) {
  return parseFloat(input.value) || 0;
}

// Mostrar alerta visual
function mostrarAlerta(texto, tipo = 'error') {
  mensajeAlerta.textContent = texto;
  mensajeAlerta.className = `mensaje-alerta ${tipo}`;
  mensajeAlerta.style.display = 'block';

  setTimeout(() => {
    mensajeAlerta.style.display = 'none';
  }, 4000);
}

// =======================
// Actualizar totales en tiempo real
// =======================
function actualizarTotales() {
  const totalIngresos =
    getInputValue(inputs.salario) +
    getInputValue(inputs.otrosIngresos);

  const totalFijos =
    getInputValue(inputs.renta) +
    getInputValue(inputs.servicios) +
    getInputValue(inputs.transporte) +
    getInputValue(inputs.seguros);

  const totalVariables =
    getInputValue(inputs.comida) +
    getInputValue(inputs.entretenimiento) +
    getInputValue(inputs.personal) +
    getInputValue(inputs.otrosGastos);

  document.getElementById('total-ingresos').textContent = formatMoney(totalIngresos);
  document.getElementById('total-fijos').textContent = formatMoney(totalFijos);
  document.getElementById('total-variables').textContent = formatMoney(totalVariables);
}

// =======================
// Event listeners
// =======================
Object.values(inputs).forEach(input => {
  input.addEventListener('input', actualizarTotales);
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calcularPresupuesto();
  });
});

// =======================
// Calcular presupuesto
// =======================
function calcularPresupuesto() {
  const ingresos =
    getInputValue(inputs.salario) +
    getInputValue(inputs.otrosIngresos);

  const gastosFijos =
    getInputValue(inputs.renta) +
    getInputValue(inputs.servicios) +
    getInputValue(inputs.transporte) +
    getInputValue(inputs.seguros);

  const gastosVariables =
    getInputValue(inputs.comida) +
    getInputValue(inputs.entretenimiento) +
    getInputValue(inputs.personal) +
    getInputValue(inputs.otrosGastos);

  const gastosTotal = gastosFijos + gastosVariables;
  const balance = ingresos - gastosTotal;

  // VALIDACIÓN (antes era alert)
  if (ingresos === 0) {
    mostrarAlerta(
      'Por favor ingresa al menos un ingreso para calcular tu presupuesto.',
      'error'
    );
    return;
  }

  mensajeAlerta.style.display = 'none';

  mostrarResultados(
    ingresos,
    gastosFijos,
    gastosVariables,
    gastosTotal,
    balance
  );

  setTimeout(() => {
    seccionResultados.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }, 100);
}

// =======================
// Mostrar resultados
// =======================
function mostrarResultados(ingresos, gastosFijos, gastosVariables, gastosTotal, balance) {
  document.getElementById('res-ingresos').textContent = formatMoney(ingresos);
  document.getElementById('res-gastos').textContent = formatMoney(gastosTotal);
  document.getElementById('res-balance').textContent = formatMoney(balance);

  const balanceElement = document.getElementById('res-balance');
  balanceElement.className = 'resultado-valor';

  if (balance > 0) balanceElement.classList.add('positivo');
  else if (balance < 0) balanceElement.classList.add('negativo');

  const porcFijos = ingresos > 0 ? (gastosFijos / ingresos * 100) : 0;
  const porcVariables = ingresos > 0 ? (gastosVariables / ingresos * 100) : 0;
  const porcDisponible = ingresos > 0 ? (Math.max(0, balance) / ingresos * 100) : 0;

  document.getElementById('porc-fijos').textContent = `${porcFijos.toFixed(1)}%`;
  document.getElementById('porc-variables').textContent = `${porcVariables.toFixed(1)}%`;
  document.getElementById('porc-disponible').textContent = `${porcDisponible.toFixed(1)}%`;

  document.getElementById('monto-fijos').textContent = formatMoney(gastosFijos);
  document.getElementById('monto-variables').textContent = formatMoney(gastosVariables);
  document.getElementById('monto-disponible').textContent = formatMoney(Math.max(0, balance));

  document.getElementById('bar-fijos').style.width = `${Math.min(100, porcFijos)}%`;
  document.getElementById('bar-variables').style.width = `${Math.min(100, porcVariables)}%`;
  document.getElementById('bar-disponible').style.width = `${Math.min(100, porcDisponible)}%`;

  generarRecomendaciones(
    ingresos,
    gastosFijos,
    gastosVariables,
    balance,
    porcFijos,
    porcVariables,
    porcDisponible
  );

  seccionResultados.style.display = 'block';
}

// =======================
// Generar recomendaciones
// =======================
function generarRecomendaciones(
  ingresos,
  gastosFijos,
  gastosVariables,
  balance,
  porcFijos,
  porcVariables,
  porcDisponible
) {
  const recomendaciones = [];

  if (balance < 0) {
    recomendaciones.push({
      tipo: 'danger',
      icono: '🚨',
      titulo: 'Alerta: Gastas más de lo que ganas',
      texto: `Tienes un déficit de ${formatMoney(Math.abs(balance))} al mes.`
    });
  } else if (balance === 0) {
    recomendaciones.push({
      tipo: 'warning',
      icono: '⚠️',
      titulo: 'No estás ahorrando',
      texto: 'Gastas exactamente lo que ganas.'
    });
  } else if (porcDisponible < 10) {
    recomendaciones.push({
      tipo: 'warning',
      icono: '💡',
      titulo: 'Ahorro bajo',
      texto: `Solo ahorras ${porcDisponible.toFixed(1)}% de tus ingresos.`
    });
  } else if (porcDisponible >= 20) {
    recomendaciones.push({
      tipo: 'success',
      icono: '✅',
      titulo: 'Excelente ahorro',
      texto: `Ahorras ${porcDisponible.toFixed(1)}% (${formatMoney(balance)}).`
    });
  } else {
    recomendaciones.push({
      tipo: 'success',
      icono: '👍',
      titulo: 'Buen trabajo',
      texto: `Ahorras ${porcDisponible.toFixed(1)}% de tus ingresos.`
    });
  }

  if (porcFijos > 50) {
    recomendaciones.push({
      tipo: 'warning',
      icono: '🏠',
      titulo: 'Gastos fijos altos',
      texto: `Representan ${porcFijos.toFixed(1)}% de tus ingresos.`
    });
  }

  if (porcVariables > 30) {
    recomendaciones.push({
      tipo: 'warning',
      icono: '🛒',
      titulo: 'Gastos variables elevados',
      texto: `Son ${porcVariables.toFixed(1)}% de tus ingresos.`
    });
  }

  const fondoEmergencia = gastosFijos + gastosVariables;
  const mesesFondo =
    balance > 0 ? (fondoEmergencia * 6 / balance).toFixed(1) : 0;

  if (balance > 0) {
    recomendaciones.push({
      tipo: 'info',
      icono: '🛡️',
      titulo: 'Fondo de emergencia',
      texto: `Meta: ${formatMoney(fondoEmergencia * 6)} (${mesesFondo} meses).`
    });
  }

  document.getElementById('recomendaciones-content').innerHTML =
    recomendaciones.map(rec => `
      <div class="recomendacion-item ${rec.tipo}">
        <div class="recomendacion-icon">${rec.icono}</div>
        <div class="recomendacion-text">
          <strong>${rec.titulo}</strong>
          <p>${rec.texto}</p>
        </div>
      </div>
    `).join('');
}

btnCalcular.addEventListener('click', calcularPresupuesto);
