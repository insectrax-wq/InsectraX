// js/calculadora.js - Calculadora de ahorro
document.addEventListener('DOMContentLoaded', function() {
    console.log('Inicializando calculadora de ahorro...');
    inicializarCalculadora();
});

function inicializarCalculadora() {
    const calcularBtn = document.getElementById('calcular-btn');
    const hectareasSlider = document.getElementById('hectareas');
    const hectareasValue = document.getElementById('hectareas-value');
    const gastoQuimicosInput = document.getElementById('gasto-quimicos');
    const gastoAguaInput = document.getElementById('gasto-agua');
    const tipoCultivoSelect = document.getElementById('tipo-cultivo');
    
    // Configuración de la calculadora
    const configCalculadora = {
        costoRobot: 50000,
        ahorroQuimicos: 0.4,
        ahorroAgua: 0.5,
        aumentoProductividad: 0.35
    };
    
    if (!hectareasSlider || !calcularBtn) {
        console.log('Calculadora: Elementos no encontrados');
        return;
    }
    
    // Actualizar valor del slider
    function actualizarHectareas() {
        if (hectareasValue) {
            hectareasValue.textContent = `${hectareasSlider.value} ha`;
        }
    }
    
    // Calcular ROI
    function calcularROI() {
        const hectareas = parseInt(hectareasSlider.value) || 0;
        const gastoQuimicos = parseFloat(gastoQuimicosInput.value) || 0;
        const gastoAgua = parseFloat(gastoAguaInput.value) || 0;
        const factorCultivo = parseFloat(tipoCultivoSelect.value) || 1;
        
        if (hectareas === 0) {
            mostrarResultados(0, 0, 0, '-');
            return;
        }
        
        // Cálculos
        const ahorroQuimicosMensual = gastoQuimicos * configCalculadora.ahorroQuimicos;
        const ahorroAguaMensual = gastoAgua * configCalculadora.ahorroAgua;
        const factorAjuste = factorCultivo * (hectareas / 10);
        
        let ahorroMensual = (ahorroQuimicosMensual + ahorroAguaMensual) * factorAjuste;
        const ahorroMinimo = 1000 * factorAjuste;
        ahorroMensual = Math.max(ahorroMensual, ahorroMinimo);
        
        const ahorroAnual = ahorroMensual * 12;
        
        // Calcular ROI
        let mesesROI = 0;
        let tiempoRecuperacion = '-';
        
        if (ahorroMensual > 0) {
            mesesROI = Math.ceil(configCalculadora.costoRobot / ahorroMensual);
            tiempoRecuperacion = formatearTiempoRecuperacion(mesesROI);
        }
        
        mostrarResultados(ahorroMensual, ahorroAnual, mesesROI, tiempoRecuperacion);
    }
    
    function formatearTiempoRecuperacion(meses) {
        if (meses <= 12) {
            return `${meses} mes${meses !== 1 ? 'es' : ''}`;
        } else {
            const años = Math.floor(meses / 12);
            const mesesRestantes = meses % 12;
            let resultado = `${años} año${años !== 1 ? 's' : ''}`;
            if (mesesRestantes > 0) {
                resultado += ` y ${mesesRestantes} mes${mesesRestantes !== 1 ? 'es' : ''}`;
            }
            return resultado;
        }
    }
    
    function mostrarResultados(ahorroMensual, ahorroAnual, mesesROI, tiempoRecuperacion) {
        const ahorroMensualElement = document.getElementById('ahorro-mensual');
        const ahorroAnualElement = document.getElementById('ahorro-anual');
        const roiElement = document.getElementById('roi');
        const tiempoRecuperacionElement = document.getElementById('tiempo-recuperacion');
        const resultCard = document.querySelector('.result-card');
        
        if (ahorroMensualElement) {
            ahorroMensualElement.textContent = `$${ahorroMensual.toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN`;
        }
        if (ahorroAnualElement) {
            ahorroAnualElement.textContent = `$${ahorroAnual.toLocaleString('es-MX', { maximumFractionDigits: 0 })} MXN`;
        }
        if (roiElement) {
            roiElement.textContent = `${mesesROI} mes${mesesROI !== 1 ? 'es' : ''}`;
        }
        if (tiempoRecuperacionElement) {
            tiempoRecuperacionElement.textContent = tiempoRecuperacion;
        }
        
        // Animación
        if (resultCard) {
            resultCard.classList.remove('animated');
            void resultCard.offsetWidth;
            resultCard.classList.add('animated');
        }
    }
    
    // Event listeners
    hectareasSlider.addEventListener('input', actualizarHectareas);
    calcularBtn.addEventListener('click', calcularROI);
    
    const inputsCalculadora = [hectareasSlider, gastoQuimicosInput, gastoAguaInput, tipoCultivoSelect];
    inputsCalculadora.forEach(input => {
        if (input) {
            input.addEventListener('input', calcularROI);
        }
    });
    
    // Inicializar
    actualizarHectareas();
    setTimeout(calcularROI, 500);
    
    console.log('Calculadora inicializada correctamente');
}