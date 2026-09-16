/**
 * Saba Beauty Salon - Main Interactive Logic
 * Handles accessibility, strictly click-controlled mobile menu (NO SWIPE),
 * form validation, and direct WhatsApp appointment link construction.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initDynamicYear();
  initAppointmentForm();
});

/**
 * Mobile Navigation Menu Handler
 * Strictly click/tap activated.
 * NO swipe listeners or horizontal edge gestures permitted.
 */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  function openMenu() {
    menuToggle.classList.add('is-active');
    navMenu.classList.add('is-active');
    menuToggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  function closeMenu() {
    menuToggle.classList.remove('is-active');
    navMenu.classList.remove('is-active');
    menuToggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function toggleMenu() {
    const expanded = menuToggle.getAttribute('aria-expanded') === 'true';
    if (expanded) {
      closeMenu();
    } else {
      openMenu();
    }
  }

  // Pure click listener for toggle button
  menuToggle.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleMenu();
  });

  // Close menu when clicking navigation links
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('is-active')) {
        closeMenu();
      }
    });
  });

  // Close menu when pressing Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && navMenu.classList.contains('is-active')) {
      closeMenu();
    }
  });

  // Defensive measure: Ensure window resize above 768px cleans up mobile state
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && navMenu.classList.contains('is-active')) {
      closeMenu();
    }
  });
}

/**
 * Dynamically update copyright year across footers
 */
function initDynamicYear() {
  const yearSpan = document.getElementById('copyright-year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }
}

/**
 * Client-Side Appointment Form Handler
 * Validates entries & generates formatted WhatsApp URL fallback
 */
function initAppointmentForm() {
  const form = document.getElementById('appointment-form');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let isValid = true;

    // Elements
    const nameInput = document.getElementById('form-name');
    const phoneInput = document.getElementById('form-phone');
    const serviceSelect = document.getElementById('form-service');
    const dateInput = document.getElementById('form-date');
    const timeInput = document.getElementById('form-time');
    const messageInput = document.getElementById('form-message');

    // Simple Validation Reset
    [nameInput, phoneInput, serviceSelect].forEach(input => {
      if (input && input.parentElement) {
        input.parentElement.classList.remove('has-error');
      }
    });

    // Name Validation
    if (!nameInput.value.trim()) {
      nameInput.parentElement.classList.add('has-error');
      isValid = false;
    }

    // Phone Validation
    if (!phoneInput.value.trim() || phoneInput.value.trim().length < 8) {
      phoneInput.parentElement.classList.add('has-error');
      isValid = false;
    }

    // Service Validation
    if (!serviceSelect.value) {
      serviceSelect.parentElement.classList.add('has-error');
      isValid = false;
    }

    if (!isValid) return;

    // Construct formatted WhatsApp message
    const salonPhone = "923344124458";
    let text = `Hello Saba Beauty Salon,\n\nI would like to request an appointment:\n`;
    text += `• Name: ${nameInput.value.trim()}\n`;
    text += `• Phone: ${phoneInput.value.trim()}\n`;
    text += `• Service: ${serviceSelect.value}\n`;

    if (dateInput && dateInput.value) {
      text += `• Date: ${dateInput.value}\n`;
    }
    if (timeInput && timeInput.value) {
      text += `• Time: ${timeInput.value}\n`;
    }
    if (messageInput && messageInput.value.trim()) {
      text += `• Notes: ${messageInput.value.trim()}\n`;
    }

    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `https://wa.me/${salonPhone}?text=${encodedText}`;

    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
  });
}
