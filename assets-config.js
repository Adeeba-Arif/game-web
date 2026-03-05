// ========================================
// ASSETS CONFIGURATION
// ========================================

const AssetsConfig = {
    // Background image settings
    background: {
        main: 'WhatsApp Image 2026-03-05 at 5.22.49 AM (1).jpeg',
    },
    
    // Sword image
    sword: {
        image: 'WhatsApp Image 2026-03-05 at 5.22.49 AM (2).jpeg',
        glowColor: 'rgba(139, 92, 246, 0.8)'
    },
    
    // Author images
    authors: {
        waleed: 'assets/authors/Waleed Manzoor.png',
        adeeba: 'assets/authors/Adeeba Arif.jpeg'
    },
    
    animations: {
        swordFloat: true,
        swordGlow: true
    }
};

// Function to set background image dynamically
function setBackground(imagePath) {
    const bgLayer = document.querySelector('.bg-image-layer');
    if (bgLayer) {
        bgLayer.style.backgroundImage = `
            linear-gradient(to bottom, rgba(10, 10, 15, 0.7), rgba(10, 10, 15, 0.95)),
            url('${imagePath}')
        `;
    }
}

// Function to set background class
function setBackgroundTheme(theme) {
    const bgLayer = document.querySelector('.bg-image-layer');
    if (bgLayer) {
        // Remove all theme classes
        bgLayer.classList.remove('dark-fog', 'forest', 'mystical');
        
        // Add new theme class if valid
        if (AssetsConfig.background.alternatives[theme]) {
            bgLayer.classList.add(theme);
        }
    }
}

// Initialize assets when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Set default background
    console.log('Assets loaded. Background:', AssetsConfig.background.main);
    console.log('Character:', AssetsConfig.character.image);
});

// Export for use
window.AssetsConfig = AssetsConfig;
window.setBackground = setBackground;
window.setBackgroundTheme = setBackgroundTheme;
