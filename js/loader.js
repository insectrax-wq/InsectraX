// Esperar a que todo el contenido de la página esté cargado
window.addEventListener('load', function() {
    // Ocultar el loader después de un tiempo mínimo (puedes ajustarlo)
    setTimeout(function() {
        const loader = document.getElementById('loader');
        if (loader) {
            // Agregar clase para fade out
            loader.classList.add('hidden');
            
            // Remover completamente el loader después de la animación
            setTimeout(function() {
                loader.remove();
            }, 500); // Mismo tiempo que la transición CSS
        }
    }, 1000); // Tiempo mínimo que se mostrará el loader (ajusta según necesites)
});

// Opcional: Mostrar el loader inmediatamente si hay demoras en la carga
document.addEventListener('DOMContentLoaded', function() {
    // Asegurar que el loader esté visible al inicio
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'flex';
    }
});
// Versión más robusta
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM cargado - loader debería ocultarse pronto');
});

window.addEventListener('load', function() {
    console.log('Página completamente cargada - ocultando loader');
    
    setTimeout(function() {
        const loader = document.getElementById('loader');
        if (loader) {
            console.log('Ocultando loader...');
            loader.classList.add('hidden');
            
            // Remover después de la animación
            setTimeout(function() {
                loader.style.display = 'none';
                console.log('Loader removido');
            }, 500);
        } else {
            console.log('Loader no encontrado');
        }
    }, 1000); // 1 segundo mínimo
});

// Fallback por si acaso
setTimeout(function() {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('hidden')) {
        console.log('Fallback: Ocultando loader después de 3 segundos');
        loader.classList.add('hidden');
        setTimeout(() => loader.style.display = 'none', 500);
    }
}, 3000);