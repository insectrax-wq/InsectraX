window.addEventListener('load', function() {
    setTimeout(function() {
        const loader = document.getElementById('loader');
        if (loader) {
            loader.classList.add('hidden');
            setTimeout(function() {
                loader.style.display = 'none';
            }, 500);
        }
    }, 1000);
});

document.addEventListener('DOMContentLoaded', function() {
    const loader = document.getElementById('loader');
    if (loader) {
        loader.style.display = 'flex';
    }
});

setTimeout(function() {
    const loader = document.getElementById('loader');
    if (loader && !loader.classList.contains('hidden')) {
        loader.classList.add('hidden');
        setTimeout(() => loader.style.display = 'none', 500);
    }
}, 3000);