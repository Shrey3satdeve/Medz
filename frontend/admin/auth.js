/**
 * LabDash Admin Authentication System
 * This script protects all admin pages
 */

const AUTH = {
    // Session keys
    LOCAL_KEY: 'labdash_admin_session',
    SESSION_KEY: 'labdash_admin_session',

    // Check if user is authenticated
    isAuthenticated() {
        const localSession = localStorage.getItem(this.LOCAL_KEY);
        const sessionSession = sessionStorage.getItem(this.SESSION_KEY);
        
        const session = localSession ? JSON.parse(localSession) : (sessionSession ? JSON.parse(sessionSession) : null);
        
        if (session && session.isLoggedIn && session.expiry > Date.now()) {
            return session;
        }
        
        // Clear expired sessions
        this.clearSession();
        return null;
    },

    // Get current user info
    getUser() {
        const session = this.isAuthenticated();
        if (session) {
            return {
                username: session.username,
                role: session.role,
                loginTime: session.loginTime
            };
        }
        return null;
    },

    // Clear session (logout)
    clearSession() {
        localStorage.removeItem(this.LOCAL_KEY);
        sessionStorage.removeItem(this.SESSION_KEY);
    },

    // Logout and redirect
    logout() {
        this.clearSession();
        window.location.href = 'login.html';
    },

    // Protect page - redirect if not authenticated
    protectPage() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    },

    // Update session activity
    updateActivity() {
        const localSession = localStorage.getItem(this.LOCAL_KEY);
        const sessionSession = sessionStorage.getItem(this.SESSION_KEY);
        
        if (localSession) {
            const session = JSON.parse(localSession);
            session.lastActivity = Date.now();
            localStorage.setItem(this.LOCAL_KEY, JSON.stringify(session));
        } else if (sessionSession) {
            const session = JSON.parse(sessionSession);
            session.lastActivity = Date.now();
            sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(session));
        }
    }
};

// Protect this page on load
document.addEventListener('DOMContentLoaded', () => {
    // Don't protect login page
    if (!window.location.pathname.includes('login.html')) {
        AUTH.protectPage();
    }
    
    // Update activity every minute
    setInterval(() => AUTH.updateActivity(), 60000);
});

// Handle logout buttons
document.addEventListener('click', (e) => {
    if (e.target.matches('.logout-btn, [data-logout]')) {
        e.preventDefault();
        AUTH.logout();
    }
});

// Export for use in other scripts
window.AUTH = AUTH;
