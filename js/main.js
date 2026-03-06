/**
 * Z-SURVIVAL - Main JavaScript
 * World War Z Style Zombie Survival Game Website
 */

// ========================================
// GLOBAL VARIABLES
// ========================================
let firebaseApp = null;
let firebaseAuth = null;
let firebaseFirestore = null;
let auth = null;
let db = null;
let currentUser = null;
let userData = null;

// Demo mode flag
const DEMO_MODE = true;

// ========================================
// DOM ELEMENTS
// ========================================
const elements = {
    // Preloader
    preloader: document.getElementById('preloader'),
    loadingProgress: document.querySelector('.loading-progress'),
    
    // Navigation
    navbar: document.querySelector('.navbar'),
    hamburger: document.querySelector('.hamburger'),
    mobileMenu: document.querySelector('.mobile-menu'),
    navLinks: document.querySelectorAll('.nav-link'),
    
    // Auth
    loginBtn: document.getElementById('loginBtn'),
    logoutBtn: document.getElementById('logoutBtn'),
    loginModal: document.getElementById('loginModal'),
    registerModal: document.getElementById('registerModal'),
    loginForm: document.getElementById('loginForm'),
    registerForm: document.getElementById('registerForm'),
    googleAuth: document.getElementById('googleAuth'),
    showRegister: document.getElementById('showRegister'),
    modalClose: document.querySelectorAll('.modal-close'),
    
    // Dashboard
    dashboard: document.getElementById('dashboard'),
    closeDashboard: document.getElementById('closeDashboard'),
    userInfoMini: document.getElementById('userInfoMini'),
    userName: document.getElementById('userName'),
    userLevel: document.getElementById('userLevel'),
    userScore: document.getElementById('userScore'),
    dashScore: document.getElementById('dashScore'),
    dashKills: document.getElementById('dashKills'),
    dashTime: document.getElementById('dashTime'),
    
    // Particles
    particlesContainer: document.getElementById('particles'),
    
    // Parallax
    parallaxBg: document.getElementById('parallaxBg'),
    
    // Toast
    toastContainer: document.getElementById('toastContainer'),
    
    // Stats
    statValues: document.querySelectorAll('.stat-value[data-count]')
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Firebase
    initializeFirebase();
    
    // Run preloader
    runPreloader();
    
    // Initialize effects
    initParticles();
    initParallax();
    initScrollEffects();
    initCounters();
    
    // Initialize navigation
    initNavigation();
    
    // Initialize auth
    initAuth();
    
    // Initialize modals
    initModals();
    
    // Initialize sound effects
    initSoundEffects();
    
    // Setup asset backgrounds
    setupBackgrounds();
});

// ========================================
// FIREBASE INITIALIZATION
// ========================================
function initializeFirebase() {
    // Check if Firebase is properly configured
    if (firebaseConfig.apiKey === 'YOUR_API_KEY' || !firebaseConfig.apiKey) {
        console.log('Firebase not configured. Running in demo mode.');
        return;
    }
    
    try {
        // Initialize Firebase
        firebaseApp = firebase.initializeApp(firebaseConfig);
        firebaseAuth = firebase.auth;
        firebaseFirestore = firebase.firestore;
        
        auth = firebaseAuth(firebaseApp);
        db = firebaseFirestore(firebaseApp);
        
        // Listen for auth state changes
        auth.onAuthStateChanged(handleAuthStateChange);
        
        console.log('Firebase initialized successfully');
    } catch (error) {
        console.error('Firebase initialization error:', error);
    }
}

// ========================================
// AUTH STATE HANDLER
// ========================================
function handleAuthStateChange(user) {
    currentUser = user;
    
    if (user) {
        // User is logged in
        elements.loginBtn.classList.add('hidden');
        elements.logoutBtn.classList.remove('hidden');
        elements.userInfoMini.style.display = 'flex';
        
        // Update UI with user info
        const displayName = user.displayName || user.email.split('@')[0];
        elements.userName.textContent = displayName;
        
        // Fetch user data from Firestore
        fetchUserData(user.uid);
        
        showToast('Welcome back, survivor!', 'success');
    } else {
        // User is logged out
        elements.loginBtn.classList.remove('hidden');
        elements.logoutBtn.classList.add('hidden');
        elements.userInfoMini.style.display = 'none';
        elements.dashboard.classList.add('hidden');
    }
}

// ========================================
// FETCH USER DATA
// ========================================
async function fetchUserData(uid) {
    if (DEMO_MODE || !db) {
        // Demo mode - use mock data
        userData = {
            score: Math.floor(Math.random() * 10000),
            level: Math.floor(Math.random() * 10) + 1,
            kills: Math.floor(Math.random() * 500),
            playTime: Math.floor(Math.random() * 50)
        };
        updateUserUI();
        return;
    }
    
    try {
        const userDoc = await db.collection('users').doc(uid).get();
        
        if (userDoc.exists) {
            userData = userDoc.data();
        } else {
            // Create new user document
            userData = {
                score: 0,
                level: 1,
                kills: 0,
                playTime: 0,
                createdAt: new Date().toISOString()
            };
            await db.collection('users').doc(uid).set(userData);
        }
        
        updateUserUI();
    } catch (error) {
        console.error('Error fetching user data:', error);
        // Use default data
        userData = { score: 0, level: 1, kills: 0, playTime: 0 };
        updateUserUI();
    }
}

// ========================================
// UPDATE USER UI
// ========================================
function updateUserUI() {
    if (!userData) return;
    
    const score = userData.score || 0;
    const level = userData.level || 1;
    const kills = userData.kills || 0;
    const playTime = userData.playTime || 0;
    
    // Update header stats
    elements.userScore.textContent = formatNumber(score);
    elements.userLevel.textContent = level;
    
    // Update dashboard
    if (elements.dashboard) {
        elements.dashScore.textContent = formatNumber(score);
        elements.dashKills.textContent = formatNumber(kills);
        elements.dashTime.textContent = playTime + 'h';
    }
}

// ========================================
// PRELOADER
// ========================================
function runPreloader() {
    const duration = 2500;
    
    setTimeout(() => {
        elements.preloader.classList.add('hidden');
        
        // Trigger animations after preloader
        document.body.style.overflow = 'auto';
    }, duration);
}

// ========================================
// PARTICLE EFFECTS
// ========================================
function initParticles() {
    if (!elements.particlesContainer) return;
    
    const particleCount = 30;
    const container = elements.particlesContainer;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(container);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random properties
    const size = Math.random() * 4 + 2;
    const left = Math.random() * 100;
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 10;
    
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    particle.style.left = left + '%';
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';
    
    // Random color from palette
    const colors = ['rgba(230, 57, 70, 0.6)', 'rgba(139, 0, 0, 0.4)', 'rgba(100, 100, 100, 0.3)'];
    particle.style.background = colors[Math.floor(Math.random() * colors.length)];
    
    container.appendChild(particle);
    
    // Recreate particle when animation ends
    particle.addEventListener('animationiteration', () => {
        particle.style.left = Math.random() * 100 + '%';
    });
}

// ========================================
// PARALLAX EFFECT
// ========================================
function initParallax() {
    if (!elements.parallaxBg) return;
    
    const layers = elements.parallaxBg.querySelectorAll('.parallax-layer');
    
    document.addEventListener('mousemove', (e) => {
        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        
        const mouseX = e.clientX - centerX;
        const mouseY = e.clientY - centerY;
        
        layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.1;
            const x = mouseX * speed;
            const y = mouseY * speed;
            
            layer.style.transform = `translate(${x}px, ${y}px)`;
        });
    });
    
    // Scroll-based parallax
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        layers.forEach(layer => {
            const speed = parseFloat(layer.dataset.speed) || 0.1;
            layer.style.transform = `translateY(${scrollY * speed}px)`;
        });
    });
}

// ========================================
// SCROLL EFFECTS
// ========================================
function initScrollEffects() {
    const navbar = elements.navbar;
    
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        
        // Add scrolled class to navbar
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Intersection Observer for sections
    const sections = document.querySelectorAll('section');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });
    
    sections.forEach(section => observer.observe(section));
}

// ========================================
// COUNTER ANIMATION
// ========================================
function initCounters() {
    const counters = document.querySelectorAll('.stat-value[data-count]');
    
    if (!counters.length) return;
    
    const animateCounter = (element) => {
        const target = parseInt(element.dataset.count);
        const duration = 2000;
        const step = target / (duration / 16);
        let current = 0;
        
        const timer = setInterval(() => {
            current += step;
            if (current >= target) {
                element.textContent = formatNumber(target);
                clearInterval(timer);
            } else {
                element.textContent = formatNumber(Math.floor(current));
            }
        }, 16);
    };
    
    // Start animation when visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    counters.forEach(counter => observer.observe(counter));
}

// ========================================
// NAVIGATION
// ========================================
function initNavigation() {
    // Hamburger menu
    if (elements.hamburger && elements.mobileMenu) {
        elements.hamburger.addEventListener('click', () => {
            elements.mobileMenu.classList.toggle('active');
            
            // Animate hamburger
            elements.hamburger.classList.toggle('active');
        });
    }
    
    // Close mobile menu on link click
    const mobileLinks = document.querySelectorAll('.mobile-nav-links a');
    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            elements.mobileMenu.classList.remove('active');
            elements.hamburger.classList.remove('active');
        });
    });
    
    // Active nav link on scroll
    const sections = document.querySelectorAll('section[id]');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        elements.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === '#' + current) {
                link.classList.add('active');
            }
        });
    });
}

// ========================================
// AUTHENTICATION
// ========================================
function initAuth() {
    // Login button
    if (elements.loginBtn) {
        elements.loginBtn.addEventListener('click', () => {
            openModal(elements.loginModal);
        });
    }
    
    // Logout button
    if (elements.logoutBtn) {
        elements.logoutBtn.addEventListener('click', handleLogout);
    }
    
    // Login form
    if (elements.loginForm) {
        elements.loginForm.addEventListener('submit', handleLogin);
    }
    
    // Register form
    if (elements.registerForm) {
        elements.registerForm.addEventListener('submit', handleRegister);
    }
    
    // Google auth
    if (elements.googleAuth) {
        elements.googleAuth.addEventListener('click', handleGoogleAuth);
    }
    
    // Show register modal
    if (elements.showRegister) {
        elements.showRegister.addEventListener('click', () => {
            closeModal(elements.loginModal);
            openModal(elements.registerModal);
        });
    }
    
    // Close dashboard
    if (elements.closeDashboard) {
        elements.closeDashboard.addEventListener('click', () => {
            elements.dashboard.classList.add('hidden');
        });
    }
}

async function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    if (DEMO_MODE) {
        // Demo mode - simulate login
        handleDemoLogin(email);
        return;
    }
    
    if (!auth) {
        showToast('Authentication not configured', 'error');
        return;
    }
    
    try {
        showToast('Logging in...', 'info');
        
        await auth.signInWithEmailAndPassword(email, password);
        
        closeModal(elements.loginModal);
        elements.loginForm.reset();
        
        showToast('Login successful!', 'success');
    } catch (error) {
        console.error('Login error:', error);
        showToast(getAuthErrorMessage(error.code), 'error');
    }
}

async function handleRegister(e) {
    e.preventDefault();
    
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;
    
    // Validate passwords
    if (password !== confirmPassword) {
        showToast('Passwords do not match!', 'error');
        return;
    }
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    if (DEMO_MODE) {
        // Demo mode - simulate registration
        handleDemoRegister(email);
        return;
    }
    
    if (!auth) {
        showToast('Authentication not configured', 'error');
        return;
    }
    
    try {
        showToast('Creating account...', 'info');
        
        const userCredential = await auth.createUserWithEmailAndPassword(email, password);
        
        // Create user document in Firestore
        if (db) {
            await db.collection('users').doc(userCredential.user.uid).set({
                email: email,
                score: 0,
                level: 1,
                kills: 0,
                playTime: 0,
                createdAt: new Date().toISOString()
            });
        }
        
        closeModal(elements.registerModal);
        elements.registerForm.reset();
        
        showToast('Account created successfully!', 'success');
    } catch (error) {
        console.error('Registration error:', error);
        showToast(getAuthErrorMessage(error.code), 'error');
    }
}

async function handleGoogleAuth() {
    if (DEMO_MODE) {
        handleDemoLogin('google');
        return;
    }
    
    if (!auth) {
        showToast('Authentication not configured', 'error');
        return;
    }
    
    const provider = new firebase.auth.GoogleAuthProvider();
    
    try {
        showToast('Signing in with Google...', 'info');
        
        await auth.signInWithPopup(provider);
        
        closeModal(elements.loginModal);
        
        showToast('Google sign-in successful!', 'success');
    } catch (error) {
        console.error('Google auth error:', error);
        showToast(getAuthErrorMessage(error.code), 'error');
    }
}

async function handleLogout() {
    if (DEMO_MODE) {
        currentUser = null;
        userData = null;
        elements.loginBtn.classList.remove('hidden');
        elements.logoutBtn.classList.add('hidden');
        elements.userInfoMini.style.display = 'none';
        elements.dashboard.classList.add('hidden');
        showToast('Logged out successfully', 'info');
        return;
    }
    
    if (!auth) return;
    
    try {
        await auth.signOut();
        showToast('Logged out successfully', 'info');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// ========================================
// DEMO MODE HANDLERS
// ========================================
function handleDemoLogin(email) {
    currentUser = { uid: 'demo-user', email: email || 'demo@survivor.com' };
    
    elements.loginBtn.classList.add('hidden');
    elements.logoutBtn.classList.remove('hidden');
    elements.userInfoMini.style.display = 'flex';
    
    // Set demo user data
    userData = {
        score: Math.floor(Math.random() * 10000) + 1000,
        level: Math.floor(Math.random() * 10) + 1,
        kills: Math.floor(Math.random() * 500) + 50,
        playTime: Math.floor(Math.random() * 50) + 10
    };
    
    updateUserUI();
    
    closeModal(elements.loginModal);
    if (elements.loginForm) elements.loginForm.reset();
    
    showToast('Demo login successful!', 'success');
}

function handleDemoRegister(email) {
    currentUser = { uid: 'demo-user-' + Date.now(), email: email };
    
    elements.loginBtn.classList.add('hidden');
    elements.logoutBtn.classList.remove('hidden');
    elements.userInfoMini.style.display = 'flex';
    
    // Set demo user data
    userData = {
        score: 0,
        level: 1,
        kills: 0,
        playTime: 0
    };
    
    updateUserUI();
    
    closeModal(elements.registerModal);
    if (elements.registerForm) elements.registerForm.reset();
    
    showToast('Demo account created!', 'success');
}

// ========================================
// MODALS
// ========================================
function initModals() {
    // Close modal buttons
    elements.modalClose.forEach(btn => {
        btn.addEventListener('click', () => {
            const modal = btn.closest('.modal');
            closeModal(modal);
        });
    });
    
    // Close modal on outside click
    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });
    
    // Close on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeModal(elements.loginModal);
            closeModal(elements.registerModal);
        }
    });
}

function openModal(modal) {
    if (!modal) return;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

// ========================================
// TOAST NOTIFICATIONS
// ========================================
function showToast(message, type = 'info') {
    const container = elements.toastContainer;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    
    let icon = 'info-circle';
    if (type === 'success') icon = 'check-circle';
    if (type === 'error') icon = 'exclamation-circle';
    if (type === 'info') icon = 'info-circle';
    
    toast.innerHTML = `<i class="fas fa-${icon}"></i> <span>${message}</span>`;
    
    container.appendChild(toast);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        toast.classList.add('hide');
        setTimeout(() => toast.remove(), 300);
    }, 5000);
}

// ========================================
// SOUND EFFECTS (Placeholder)
// ========================================
function initSoundEffects() {
    // Placeholder for sound effects
    // In production, add actual audio files
    const soundEnabled = localStorage.getItem('soundEnabled') !== 'false';
    
    // Hover sounds
    document.querySelectorAll('a, button').forEach(el => {
        if (soundEnabled) {
            el.addEventListener('mouseenter', () => playHoverSound());
        }
    });
    
    // Click sounds
    document.querySelectorAll('button, .btn-primary, .btn-secondary').forEach(el => {
        if (soundEnabled) {
            el.addEventListener('click', () => playClickSound());
        }
    });
}

function playHoverSound() {
    // Placeholder - add actual sound
    // const audio = new Audio('assets/sounds/hover.mp3');
    // audio.volume = 0.1;
    // audio.play().catch(() => {});
}

function playClickSound() {
    // Placeholder - add actual sound
    // const audio = new Audio('assets/sounds/click.mp3');
    // audio.volume = 0.2;
    // audio.play().catch(() => {});
}

// ========================================
// BACKGROUND SETUP
// ========================================
function setupBackgrounds() {
    // Check if background image exists
    const bgLayer = document.querySelector('.bg-image-layer');
    if (bgLayer && AssetsConfig) {
        const bgImage = AssetsConfig.background?.main;
        if (bgImage) {
            bgLayer.style.backgroundImage = `
                linear-gradient(to bottom, rgba(10, 10, 15, 0.7), rgba(10, 10, 15, 0.95)),
                url('assets/${bgImage}')
            `;
        }
    }
}

// ========================================
// UTILITY FUNCTIONS
// ========================================
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + 'M';
    }
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'K';
    }
    return num.toString();
}

function getAuthErrorMessage(errorCode) {
    const messages = {
        'auth/email-already-in-use': 'This email is already registered',
        'auth/invalid-email': 'Invalid email address',
        'auth/operation-not-allowed': 'Operation not allowed',
        'auth/weak-password': 'Password is too weak',
        'auth/user-disabled': 'This account has been disabled',
        'auth/user-not-found': 'No account found with this email',
        'auth/wrong-password': 'Incorrect password',
        'auth/invalid-credential': 'Invalid credentials',
        'auth/invalid-api-key': 'Invalid API key',
        'auth/network-request-failed': 'Network error. Please try again'
    };
    
    return messages[errorCode] || 'An error occurred. Please try again.';
}

// ========================================
// EXPORT FOR USE
// ========================================
window.ZSurvival = {
    showToast,
    auth,
    db,
    currentUser,
    userData,
    DEMO_MODE
};
