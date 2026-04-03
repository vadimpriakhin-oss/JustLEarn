document.addEventListener('DOMContentLoaded', () => {
    document.body.style.backgroundColor = '#0a0a0a';
    loadLearnChiks();
    registerServiceWorker();

    // Splash screen: click anywhere → fly away → show dashboard
    const splash = document.getElementById('splash-screen');
    splash.addEventListener('click', () => {
        splash.classList.add('fly-away');
        setTimeout(() => {
            splash.style.display = 'none';
            showDashboard();
        }, 1300);
    });
});
