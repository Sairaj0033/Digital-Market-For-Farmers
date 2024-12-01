class Auth {
    constructor() {
        this.users = JSON.parse(localStorage.getItem('users')) || [];
        this.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
        this.setupAuthForms();
        this.updateNavigation();
    }

    setupAuthForms() {
        // Setup login form
        const loginForm = document.getElementById('login-form');
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                this.login(email, password);
            });
        }

        // Setup signup form
        const signupForm = document.getElementById('signup-form');
        if (signupForm) {
            signupForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const fullname = document.getElementById('fullname').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirm-password').value;
                this.signup(fullname, email, password, confirmPassword);
            });
        }
    }

    signup(fullname, email, password, confirmPassword) {
        // Validate passwords match
        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        // Check if email already exists
        if (this.users.some(user => user.email === email)) {
            alert('Email already registered!');
            return;
        }

        // Check if registering as farmer
        const isFarmer = window.location.pathname.includes('join.html');

        // Create new user
        const newUser = {
            id: Date.now().toString(),
            fullname,
            email,
            password, // In a real app, this should be hashed
            isFarmer: isFarmer
        };

        // Add to users array
        this.users.push(newUser);
        localStorage.setItem('users', JSON.stringify(this.users));

        // Log user in
        this.currentUser = newUser;
        localStorage.setItem('currentUser', JSON.stringify(newUser));

        // Redirect based on user type
        window.location.href = isFarmer ? 'manage-products.html' : 'shop.html';
    }

    login(email, password) {
        const user = this.users.find(u => u.email === email && u.password === password);
        
        if (user) {
            this.currentUser = user;
            localStorage.setItem('currentUser', JSON.stringify(user));
            window.location.href = 'shop.html';
        } else {
            alert('Invalid email or password!');
        }
    }

    logout() {
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }

    isLoggedIn() {
        return this.currentUser !== null;
    }

    updateNavigation() {
        const navLinks = document.querySelector('.nav-links');
        const ctaButtons = document.querySelector('.cta-buttons');
        
        if (!navLinks || !ctaButtons) return;

        if (this.isLoggedIn()) {
            // Add user menu
            if (!document.querySelector('.user-menu')) {
                const userMenu = document.createElement('div');
                userMenu.className = 'user-menu';
                
                // Add manage products link for farmers
                const manageProductsLink = this.currentUser.isFarmer ? 
                    `<a href="manage-products.html" class="btn manage">Manage Products</a>` : '';
                
                userMenu.innerHTML = `
                    <span>Welcome, ${this.currentUser.fullname}</span>
                    ${manageProductsLink}
                    <button onclick="auth.logout()" class="logout-btn">Logout</button>
                `;
                ctaButtons.appendChild(userMenu);
            }
        } else {
            // Add login/signup buttons
            ctaButtons.innerHTML = `
                <a href="login.html" class="btn login">Login</a>
                <a href="join.html" class="btn signup">Join as Farmer</a>
                <a href="signup.html" class="btn signup">Sign Up as Customer</a>
            `;
        }
    }

    requireAuth() {
        if (!this.isLoggedIn()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}

// Initialize authentication
const auth = new Auth();
