// =======================
// Elementos del DOM
// =======================
const inputs = {
  meta: document.getElementById('meta'),
  plazo: document.getElementById('plazo'),
  ahorroActual: document.getElementById('ahorro-actual'),
  ingresoMensual: document.getElementById('ingreso-mensual'),
  gastosMensuales: document.getElementById('gastos-mensuales')
};

const btnCalcular = document.getElementById('calcular');
const seccionResultados = document.getElementById('resultados');
const mensajeAlerta = document.getElementById('mensaje-alerta');
const seccionViabilidad = document.getElementById('viabilidad-section');

// =======================
// Utilidades
// =======================

function formatMoney(amount) {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount);
}

function getInputValue(input) {
  return parseFloat(input.value) || 0;
}

function mostrarAlerta(texto, tipo = 'error') {
  mensajeAlerta.textContent = texto;
  mensajeAlerta.className = `mensaje-alerta ${tipo}`;
  mensajeAlerta.style.display = 'block';

  setTimeout(() => {
    mensajeAlerta.style.display = 'none';
  }, 4000);
}

// =======================
// Event listeners
// =======================
Object.values(inputs).forEach(input => {
  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') calcularAhorro();
  });
});

// =======================
// Calcular ahorro mensual
// =======================
function calcularAhorro() {
  const meta = getInputValue(inputs.meta);
  const plazo = getInputValue(inputs.plazo);
  const ahorroActual = getInputValue(inputs.ahorroActual);
  const ingresoMensual = getInputValue(inputs.ingresoMensual);
  const gastosMensuales = getInputValue(inputs.gastosMensuales);

  // VALIDACIONES
  if (meta === 0) {
    mostrarAlerta('Por favor ingresa una meta de ahorro.', 'error');
    return;
  }

  if (plazo === 0) {
    mostrarAlerta('Por favor ingresa el plazo en meses.', 'error');
    return;
  }

  if (plazo < 1) {
    mostrarAlerta('El plazo debe ser de al menos 1 mes.', 'warning');
    return;
  }

  if (ahorroActual >= meta) {
    mostrarAlerta('¡Ya cumpliste tu meta! Tu ahorro actual es mayor o igual a la meta.', 'warning');
    return;
  }

  mensajeAlerta.style.display = 'none';

  const faltaPorAhorrar = meta - ahorroActual;
  const ahorroMensual = faltaPorAhorrar / plazo;
  const ahorroSemanal = ahorroMensual / 4;

  mostrarResultados(
    meta,
    ahorroActual,
    faltaPorAhorrar,
    ahorroMensual,
    ahorroSemanal,
    plazo,
    ingresoMensual,
    gastosMensuales
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
function mostrarResultados(
  meta,
  ahorroActual,
  faltaPorAhorrar,
  ahorroMensual,
  ahorroSemanal,
  plazo,
  ingresoMensual,
  gastosMensuales
) {
  document.getElementById('res-meta').textContent = formatMoney(meta);
  document.getElementById('res-ahorrado').textContent = formatMoney(ahorroActual);
  document.getElementById('res-falta').textContent = formatMoney(faltaPorAhorrar);
  document.getElementById('res-mensual').textContent = formatMoney(ahorroMensual);

  // Timeline
  const hoy = new Date();
  const fechaFin = new Date();
  fechaFin.setMonth(fechaFin.getMonth() + plazo);

  const opciones = { year: 'numeric', month: 'long' };
  document.getElementById('fecha-inicio').textContent = hoy.toLocaleDateString('es-MX', opciones);
  document.getElementById('fecha-fin').textContent = fechaFin.toLocaleDateString('es-MX', opciones);

  document.getElementById('plazo-info').textContent = `${plazo} ${plazo === 1 ? 'mes' : 'meses'}`;
  document.getElementById('ahorro-semanal').textContent = formatMoney(ahorroSemanal);

  // Animación de progreso (arranca en 0, llega a 100%)
  setTimeout(() => {
    document.getElementById('timeline-progress').style.width = '100%';
  }, 100);

  // Análisis de viabilidad
  if (ingresoMensual > 0 && gastosMensuales > 0) {
    analizarViabilidad(ahorroMensual, ingresoMensual, gastosMensuales);
  } else {
    seccionViabilidad.style.display = 'none';
  }

  seccionResultados.style.display = 'block';
}

// =======================
// Analizar viabilidad
// =======================
function analizarViabilidad(ahorroMensual, ingresoMensual, gastosMensuales) {
  const disponible = ingresoMensual - gastosMensuales;
  const porcentajeRequerido = (ahorroMensual / ingresoMensual * 100);
  const porcentajeDisponible = (disponible / ingresoMensual * 100);

  const recomendaciones = [];

  if (disponible <= 0) {
    recomendaciones.push({
      tipo: 'danger',
      icono: '🚨',
      titulo: 'Meta imposible con tus finanzas actuales',
      texto: `Gastas más de lo que ganas (${formatMoney(Math.abs(disponible))} de déficit). Primero balancea tu presupuesto.`
    });
  } else if (ahorroMensual > disponible) {
    const deficit = ahorroMensual - disponible;
    const nuevosPlazo = Math.ceil((ahorroMensual * inputs.plazo.value) / disponible);
    recomendaciones.push({
      tipo: 'warning',
      icono: '⚠️',
      titulo: 'Meta difícil de alcanzar',
      texto: `Necesitas ahorrar ${formatMoney(ahorroMensual)} pero solo tienes ${formatMoney(disponible)} disponible. Faltarían ${formatMoney(deficit)} al mes.`
    });
    recomendaciones.push({
      tipo: 'info',
      icono: '💡',
      titulo: 'Sugerencia',
      texto: `Extiende el plazo a ${nuevosPlazo} meses para ahorrar ${formatMoney(disponible)} mensuales, o reduce gastos/aumenta ingresos.`
    });
  } else if (porcentajeRequerido > 30) {
    recomendaciones.push({
      tipo: 'warning',
      icono: '⚠️',
      titulo: 'Meta ambiciosa',
      texto: `Necesitas ahorrar ${porcentajeRequerido.toFixed(1)}% de tus ingresos. Es alto pero posible si reduces gastos variables.`
    });
  } else if (porcentajeRequerido <= 10) {
    recomendaciones.push({
      tipo: 'success',
      icono: '✅',
      titulo: '¡Meta muy alcanzable!',
      texto: `Solo necesitas ${porcentajeRequerido.toFixed(1)}% de tus ingresos (${formatMoney(ahorroMensual)}). Muy fácil de cumplir.`
    });
  } else {
    recomendaciones.push({
      tipo: 'success',
      icono: '👍',
      titulo: 'Meta alcanzable',
      texto: `Necesitas ahorrar ${porcentajeRequerido.toFixed(1)}% de tus ingresos (${formatMoney(ahorroMensual)}). Es viable.`
    });
  }

  // Mostrar capacidad de ahorro
  recomendaciones.push({
    tipo: 'info',
    icono: '💰',
    titulo: 'Tu capacidad actual',
    texto: `Disponible mensual: ${formatMoney(disponible)} (${porcentajeDisponible.toFixed(1)}% de tus ingresos).`
  });

  document.getElementById('viabilidad-content').innerHTML =
    recomendaciones.map(rec => `
      <div class="recomendacion-item ${rec.tipo}">
        <div class="recomendacion-icon">${rec.icono}</div>
        <div class="recomendacion-text">
          <strong>${rec.titulo}</strong>
          <p>${rec.texto}</p>
        </div>
      </div>
    `).join('');

  seccionViabilidad.style.display = 'block';
}

btnCalcular.addEventListener('click', calcularAhorro);