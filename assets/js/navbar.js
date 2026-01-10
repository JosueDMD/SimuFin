// ============================================
// NAVBAR
// ============================================

document.addEventListener('DOMContentLoaded', function() {
  
  // Toggle menú móvil
  const navToggle = document.getElementById('navToggle');
  const navMenu = document.getElementById('navMenu');
  
  if (navToggle && navMenu) {
    navToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
  
  // Cerrar menú al hacer click en un link (móvil)
  const navLinks = document.querySelectorAll('.nav-link:not(.dropdown-toggle)');
  navLinks.forEach(function(link) {
    link.addEventListener('click', function() {
      if (window.innerWidth <= 768) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    });
  });
  
  // Toggle dropdown en móvil
  const dropdowns = document.querySelectorAll('.dropdown');
  dropdowns.forEach(function(dropdown) {
    const toggle = dropdown.querySelector('.dropdown-toggle');
    
    if (toggle) {
      toggle.addEventListener('click', function(e) {
        if (window.innerWidth <= 768) {
          e.preventDefault();
          dropdown.classList.toggle('active');
          
          // Cerrar otros dropdowns
          dropdowns.forEach(function(otherDropdown) {
            if (otherDropdown !== dropdown) {
              otherDropdown.classList.remove('active');
            }
          });
        }
      });
    }
  });
  
  // Cerrar menú y dropdowns al cambiar tamaño de ventana
  window.addEventListener('resize', function() {
    if (window.innerWidth > 768) {
      dropdowns.forEach(function(dropdown) {
        dropdown.classList.remove('active');
      });
      
      if (navToggle && navMenu) {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
    }
  });
  
  // Cerrar menú al hacer click fuera
  document.addEventListener('click', function(e) {
    if (window.innerWidth <= 768) {
      if (!e.target.closest('.navbar')) {
        if (navToggle && navMenu) {
          navToggle.classList.remove('active');
          navMenu.classList.remove('active');
        }
        dropdowns.forEach(function(dropdown) {
          dropdown.classList.remove('active');
        });
      }
    }
  });
  
});