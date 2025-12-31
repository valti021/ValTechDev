document.addEventListener('DOMContentLoaded', function() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinks = document.getElementById('navLinks');
    
    // Função para alternar o menu
    function toggleMenu() {
        hamburgerBtn.classList.toggle('active');
        navLinks.classList.toggle('active');
        
        // Impede o scroll do body quando menu está aberto
        if (navLinks.classList.contains('active')) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }
    }
    
    // Evento de clique no botão hambúrguer
    hamburgerBtn.addEventListener('click', toggleMenu);
    
    // Fechar o menu ao clicar em um link
    const navItems = navLinks.querySelectorAll('a');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleMenu();
            }
        });
    });
    
    // Fechar o menu ao clicar fora dele (no overlay)
    navLinks.addEventListener('click', function(e) {
        if (e.target === this) {
            toggleMenu();
        }
    });
    
    // Fechar menu ao pressionar ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            toggleMenu();
        }
    });
    
    // Fechar menu ao redimensionar a janela para desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburgerBtn.classList.remove('active');
            navLinks.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
});