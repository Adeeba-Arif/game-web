// ========================================
// THE DARK WORLD - Main JavaScript
// ========================================

// Firebase Configuration
// Replace these values with your actual Firebase project configuration
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "your-project.firebaseapp.com",
    projectId: "your-project",
    storageBucket: "your-project.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abc123"
};

// Initialize Firebase
let auth, db;

document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    if (typeof firebase !== 'undefined') {
        firebase.initializeApp(firebaseConfig);
        auth = firebase.auth();
        db = firebase.firestore();
        
        console.log('Firebase initialized successfully');
    } else {
        console.warn('Firebase SDK not loaded. Using demo mode.');
    }
    
    // Initialize all components
    initBackgroundCanvas();
    initNavigation();
    initModals();
    initForms();
    initAnimations();
    checkAuthState();
});

// ========================================
// 3D BACKGROUND CANVAS
// ========================================
function initBackgroundCanvas() {
    const canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId;
    
    // Set canvas size
    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Particle class
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.opacity = Math.random() * 0.5 + 0.2;
            this.color = this.getRandomColor();
        }
        
        getRandomColor() {
            const colors = [
                '139, 92, 246',  // Purple
                '59, 130, 246',  // Blue
                '6, 182, 212',   // Cyan
                '236, 72, 153',  // Pink
            ];
            return colors[Math.floor(Math.random() * colors.length)];
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(${this.color}, ${this.opacity})`;
            ctx.fill();
        }
    }
    
    // Create particles
    function initParticles() {
        particles = [];
        const particleCount = Math.floor((canvas.width * canvas.height) / 15000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }
    
    // Draw connections
    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.15 * (1 - distance / 150)})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // Animation loop
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw gradient background
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width
        );
        gradient.addColorStop(0, 'rgba(26, 26, 37, 0.3)');
        gradient.addColorStop(1, 'rgba(10, 10, 15, 0.5)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Update and draw particles
        particles.forEach(particle => {
            particle.update();
            particle.draw();
        });
        
        // Draw connections
        drawConnections();
        
        animationId = requestAnimationFrame(animate);
    }
    
    initParticles();
    animate();
    
    // Reinitialize particles on resize
    window.addEventListener('resize', () => {
        resizeCanvas();
        initParticles();
    });
}

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('active');
            
            // Animate hamburger
            hamburger.classList.toggle('toggle');
        });
        
        // Close mobile menu on link click
        mobileLinks.forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('active');
            });
        });
    }
    
    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
    
    // Navbar background on scroll
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.style.background = 'rgba(10, 10, 15, 0.95)';
        } else {
            navbar.style.background = 'rgba(10, 10, 15, 0.8)';
        }
    });
}

// ========================================
// MODALS
// ========================================
function initModals() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const modalClose = document.querySelector('.modal-close');
    
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', () => {
            loginModal.classList.add('active');
        });
    }
    
    if (modalClose && loginModal) {
        modalClose.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });
    }
    
    // Close modal on outside click
    if (loginModal) {
        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }
    
    // Close modal on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && loginModal) {
            loginModal.classList.remove('active');
        }
    });
}

// ========================================
// FORMS
// ========================================
function initForms() {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const googleAuthBtn = document.getElementById('googleAuth');
    
    // Register Form
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const whatsapp = document.getElementById('whatsapp').value;
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;
            
            // Validate passwords match
            if (password !== confirmPassword) {
                showAlert('Passwords do not match!', 'error');
                return;
            }
            
            // Validate password length
            if (password.length < 6) {
                showAlert('Password must be at least 6 characters!', 'error');
                return;
            }
            
            // Show loading state
            const submitBtn = registerForm.querySelector('.btn-register');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Creating Account...';
            submitBtn.disabled = true;
            
            try {
                if (auth) {
                    // Create user with Firebase
                    const userCredential = await auth.createUserWithEmailAndPassword(email, password);
                    const user = userCredential.user;
                    
                    // Save additional user data to Firestore
                    await db.collection('users').doc(user.uid).set({
                        email: email,
                        whatsapp: whatsapp,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    });
                    
                    showAlert('Account created successfully!', 'success');
                    registerForm.reset();
                    showDashboard(user, whatsapp);
                } else {
                    // Demo mode
                    console.log('Demo registration:', { email, whatsapp });
                    showAlert('Demo mode: Account created!', 'success');
                    registerForm.reset();
                    showDashboard({ email: email }, whatsapp);
                }
            } catch (error) {
                console.error('Registration error:', error);
                showAlert(getErrorMessage(error.code), 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Login Form
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            // Show loading state
            const submitBtn = loginForm.querySelector('.btn-login');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitBtn.disabled = true;
            
            try {
                if (auth) {
                    const userCredential = await auth.signInWithEmailAndPassword(email, password);
                    const user = userCredential.user;
                    
                    showAlert('Login successful!', 'success');
                    loginForm.reset();
                    document.getElementById('loginModal').classList.remove('active');
                    showDashboard(user);
                } else {
                    // Demo mode
                    console.log('Demo login:', { email });
                    showAlert('Demo mode: Logged in!', 'success');
                    loginForm.reset();
                    document.getElementById('loginModal').classList.remove('active');
                    showDashboard({ email: email });
                }
            } catch (error) {
                console.error('Login error:', error);
                showAlert(getErrorMessage(error.code), 'error');
            } finally {
                submitBtn.innerHTML = originalText;
                submitBtn.disabled = false;
            }
        });
    }
    
    // Google Authentication
    if (googleAuthBtn) {
        googleAuthBtn.addEventListener('click', async () => {
            const provider = new firebase.auth.GoogleAuthProvider();
            
            try {
                if (auth) {
                    const result = await auth.signInWithPopup(provider);
                    const user = result.user;
                    
                    // Save user data
                    await db.collection('users').doc(user.uid).set({
                        email: user.email,
                        displayName: user.displayName,
                        photoURL: user.photoURL,
                        createdAt: firebase.firestore.FieldValue.serverTimestamp()
                    }, { merge: true });
                    
                    showAlert('Google sign-in successful!', 'success');
                    showDashboard(user);
                } else {
                    showAlert('Demo mode: Google auth not available!', 'error');
                }
            } catch (error) {
                console.error('Google auth error:', error);
                showAlert(getErrorMessage(error.code), 'error');
            }
        });
    }
}

// ========================================
// AUTH STATE
// ========================================
function checkAuthState() {
    if (!auth) return;
    
    auth.onAuthStateChanged((user) => {
        if (user) {
            updateUIForLoggedIn(user);
        } else {
            updateUIForLoggedOut();
        }
    });
}

function updateUIForLoggedIn(user) {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) loginBtn.classList.add('hidden');
    if (logoutBtn) logoutBtn.classList.remove('hidden');
    
    // Add logout functionality
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            try {
                await auth.signOut();
                showAlert('Logged out successfully!', 'success');
                hideDashboard();
            } catch (error) {
                console.error('Logout error:', error);
            }
        });
    }
}

function updateUIForLoggedOut() {
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    
    if (loginBtn) loginBtn.classList.remove('hidden');
    if (logoutBtn) logoutBtn.classList.add('hidden');
}

// ========================================
// DASHBOARD
// ========================================
function showDashboard(user, whatsapp = null) {
    const dashboard = document.getElementById('dashboard');
    const userName = document.getElementById('userName');
    const userEmail = document.getElementById('userEmail');
    const userWhatsapp = document.getElementById('userWhatsapp');
    
    if (dashboard) {
        dashboard.classList.remove('hidden');
        
        if (userName) {
            userName.textContent = user.displayName || user.email.split('@')[0];
        }
        
        if (userEmail) {
            userEmail.textContent = user.email;
        }
        
        if (userWhatsapp) {
            userWhatsapp.textContent = whatsapp || 'Not provided';
        }
        
        // Scroll to dashboard
        setTimeout(() => {
            dashboard.scrollIntoView({ behavior: 'smooth' });
        }, 500);
    }
}

function hideDashboard() {
    const dashboard = document.getElementById('dashboard');
    if (dashboard) {
        dashboard.classList.add('hidden');
    }
}

// ========================================
// ANIMATIONS
// ========================================
function initAnimations() {
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);
    
    // Observe elements
    document.querySelectorAll('.about-card, .author-card').forEach(el => {
        observer.observe(el);
    });
    
    // Add staggered animation to cards
    document.querySelectorAll('.about-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.2}s`;
    });
    
    document.querySelectorAll('.author-card').forEach((card, index) => {
        card.style.animationDelay = `${index * 0.3}s`;
    });
}

// ========================================
// ALERTS
// ========================================
function showAlert(message, type = 'info') {
    // Remove existing alerts
    const existingAlert = document.querySelector('.custom-alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create alert element
    const alert = document.createElement('div');
    alert.className = `custom-alert alert-${type}`;
    alert.innerHTML = `
        <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
        <span>${message}</span>
    `;
    
    // Add styles
    alert.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        padding: 1rem 2rem;
        background: ${type === 'success' ? 'rgba(16, 185, 129, 0.9)' : type === 'error' ? 'rgba(239, 68, 68, 0.9)' : 'rgba(59, 130, 246, 0.9)'};
        color: white;
        border-radius: 10px;
        display: flex;
        align-items: center;
        gap: 0.5rem;
        z-index: 3000;
        animation: slideIn 0.3s ease-out;
        font-family: 'Rajdhani', sans-serif;
        font-weight: 600;
    `;
    
    document.body.appendChild(alert);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        alert.style.animation = 'slideOut 0.3s ease-out forwards';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

// Add alert animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// ERROR MESSAGES
// ========================================
function getErrorMessage(errorCode) {
    const errorMessages = {
        'auth/email-already-in-use': 'This email is already registered!',
        'auth/invalid-email': 'Invalid email address!',
        'auth/operation-not-allowed': 'Operation not allowed!',
        'auth/weak-password': 'Password is too weak!',
        'auth/user-disabled': 'This account has been disabled!',
        'auth/user-not-found': 'No account found with this email!',
        'auth/wrong-password': 'Incorrect password!',
        'auth/too-many-requests': 'Too many attempts. Please try again later!',
        'auth/network-request-failed': 'Network error. Please check your connection!',
        'auth/popup-closed-by-user': 'Sign-in popup was closed!',
    };
    
    return errorMessages[errorCode] || 'An error occurred. Please try again!';
}

// ========================================
// EXPORT FOR USE
// ========================================
window.TheDarkWorld = {
    showAlert,
    getErrorMessage
};
