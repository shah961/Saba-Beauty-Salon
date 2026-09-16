/**
 * Saba Beauty Salon - Animations & Interactive Effects
 * Handles GSAP entrance animations, subtle ScrollTrigger reveals,
 * and lightweight Three.js hero ambient particles.
 */

'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // Check user motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!prefersReducedMotion) {
    initGSAPAnimations();
    initHeroThreeJS();
  }
});

/**
 * GSAP Scroll & Page Entrance Animations
 */
function initGSAPAnimations() {
  if (typeof gsap === 'undefined') return;

  // Animate Hero Elements sequentially
  const heroTimeline = gsap.timeline({ defaults: { ease: 'power3.out', duration: 1 } });

  if (document.querySelector('.hero-title')) {
    heroTimeline
      .from('.hero-badge', { opacity: 0, y: -20, duration: 0.6 })
      .from('.hero-title', { opacity: 0, y: 30, duration: 0.8 }, '-=0.3')
      .from('.hero-description', { opacity: 0, y: 20, duration: 0.8 }, '-=0.5')
      .from('.hero-buttons', { opacity: 0, y: 20, duration: 0.6 }, '-=0.5')
      .from('.hero-image-wrapper', { opacity: 0, scale: 0.95, duration: 1 }, '-=0.8');
  }

  // ScrollTrigger reveals for sections if ScrollTrigger available
  if (typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    const cards = document.querySelectorAll('.service-card, .feature-box, .product-card');
    cards.forEach((card) => {
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none none'
        },
        opacity: 0,
        y: 40,
        duration: 0.8,
        ease: 'power2.out'
      });
    });
  }
}

/**
 * Three.js Hero Canvas Ambient Background
 * Lightweight particle animation designed to run efficiently without blocking render thread.
 */
function initHeroThreeJS() {
  const container = document.getElementById('hero-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  // Do not initialize heavy WebGL on mobile devices or low bandwidth
  if (window.innerWidth < 768) return;

  let scene, camera, renderer, particles;
  const particleCount = 40;

  try {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 100;

    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // Create subtle gold particle geometry
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 200;
      positions[i + 1] = (Math.random() - 0.5) * 200;
      positions[i + 2] = (Math.random() - 0.5) * 100;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    // Soft Gold Material
    const material = new THREE.PointsMaterial({
      color: 0xC5A059,
      size: 2.5,
      transparent: true,
      opacity: 0.5
    });

    particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Animation Loop
    let animationFrameId;
    function animate() {
      animationFrameId = requestAnimationFrame(animate);
      particles.rotation.y += 0.0008;
      particles.rotation.x += 0.0004;
      renderer.render(scene, camera);
    }

    animate();

    // Pause animation when tab is inactive for performance
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        cancelAnimationFrame(animationFrameId);
      } else {
        animate();
      }
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    });

  } catch (e) {
    // Graceful fallback if WebGL fails or is unsupported
    console.warn('WebGL setup skipped:', e);
  }
}
