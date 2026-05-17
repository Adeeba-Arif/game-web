/**
 * Z-SURVIVAL - Profile Page JavaScript
 */

// ========================================
// PROFILE DATA
// ========================================
let profileData = {
    name: 'Survivor',
    email: '',
    level: 1,
    score: 0,
    kills: 0,
    deaths: 0,
    accuracy: 0,
    waves: 0,
    achievements: 0,
    playTime: 0,
    joinDate: new Date().toISOString(),
    rank: 'PRIVATE',
    rankTitle: 'Rookie Survivor'
};

// ========================================
// INITIALIZATION
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    loadProfile();
    updateProfileUI();
    runPreloader();

    // ── Test Email button ──────────────────────────────────────────────────────
    var btnTestEmail = document.getElementById('btnTestEmail');
    if (btnTestEmail) {
        btnTestEmail.addEventListener('click', function () {
            if (typeof window.EmailService === 'undefined') {
                console.error('[Profile] EmailService is not available.');
                alert('Email service is not loaded. Check the console for details.');
                return;
            }
            btnTestEmail.disabled = true;
            btnTestEmail.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending…';
            window.EmailService.sendTestEmail().then(function (res) {
                btnTestEmail.disabled = false;
                btnTestEmail.innerHTML = '<i class="fas fa-paper-plane"></i> Test Email';
                if (res.success) {
                    alert('✅ Test email sent to ' + (window.EmailService.getStatus().config.adminEmail) + '\n\nCheck the console for full details.');
                } else {
                    alert('❌ Test email FAILED:\n' + res.error + '\n\nCheck the console for full details.');
                }
            });
        });
    }
});

function loadProfile() {
    // Get user data from main.js if available
    if (window.ZSurvival && window.ZSurvival.currentUser) {
        const user = window.ZSurvival.currentUser;
        profileData.email = user.email;
        profileData.name = user.displayName || user.email.split('@')[0];
    }
    
    if (window.ZSurvival && window.ZSurvival.userData) {
        const data = window.ZSurvival.userData;
        profileData.score = data.score || 0;
        profileData.level = data.level || 1;
        profileData.kills = data.kills || 0;
        profileData.playTime = data.playTime || 0;
    }
    
    // Calculate derived stats
    profileData.deaths = Math.floor(Math.random() * 10);
    profileData.accuracy = Math.floor(Math.random() * 30) + 60;
    profileData.waves = Math.floor(profileData.kills / 20);
    profileData.achievements = 3;
    
    // Calculate rank based on level
    calculateRank();
}

function calculateRank() {
    const level = profileData.level;
    
    if (level >= 100) {
        profileData.rank = 'LEGEND';
        profileData.rankTitle = 'Legendary Survivor';
    } else if (level >= 80) {
        profileData.rank = 'ELITE';
        profileData.rankTitle = 'Elite Killer';
    } else if (level >= 60) {
        profileData.rank = 'VETERAN';
        profileData.rankTitle = 'Battle-Hardened';
    } else if (level >= 40) {
        profileData.rank = 'SERGEANT';
        profileData.rankTitle = 'Team Leader';
    } else if (level >= 20) {
        profileData.rank = 'CORPORAL';
        profileData.rankTitle = 'Experienced Fighter';
    } else if (level >= 10) {
        profileData.rank = 'PRIVATE';
        profileData.rankTitle = 'Seasoned Survivor';
    } else {
        profileData.rank = 'PRIVATE';
        profileData.rankTitle = 'Rookie Survivor';
    }
}

// ========================================
// UI UPDATE
// ========================================
function updateProfileUI() {
    // Name
    document.getElementById('profileName').textContent = profileData.name;
    
    // Rank
    document.getElementById('rankBadge').textContent = profileData.rank;
    document.querySelector('.rank-title').textContent = profileData.rankTitle;
    
    // Join date
    const joinDate = new Date(profileData.joinDate);
    document.getElementById('joinDate').textContent = joinDate.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
    }).toUpperCase();
    
    // Play time
    document.getElementById('playTime').textContent = profileData.playTime + ' hours';
    
    // Level
    document.getElementById('profileLevel').textContent = profileData.level;
    
    // Stats
    document.getElementById('statScore').textContent = formatNumber(profileData.score);
    document.getElementById('statKills').textContent = formatNumber(profileData.kills);
    document.getElementById('statDeaths').textContent = profileData.deaths;
    document.getElementById('statAccuracy').textContent = profileData.accuracy + '%';
    document.getElementById('statWaves').textContent = profileData.waves;
    document.getElementById('statAchievements').textContent = profileData.achievements;
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

// ========================================
// PRELOADER
// ========================================
function runPreloader() {
    const preloader = document.getElementById('preloader');
    
    if (!preloader) return;
    
    setTimeout(() => {
        preloader.classList.add('hidden');
    }, 2000);
}
