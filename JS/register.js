// Register (using Firebase Auth via ES modules)
import { auth, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile } from './firebase-init.js';

const form = document.getElementById('registerForm');
const msgEl = document.getElementById('register-message');
const googleBtn = document.getElementById('gSignUpBtn');

if (form) {
    form.addEventListener('submit', async function(event) {
        event.preventDefault();
        const fullname = document.getElementById('fullname').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        msgEl.textContent = '';
        msgEl.classList.remove('success');

        if (!fullname || !username || !email || !password || !confirmPassword) {
            msgEl.textContent = 'Please fill in all fields.';
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            msgEl.textContent = 'Please enter a valid email address.';
            return;
        }

        if (password.length < 6) {
            msgEl.textContent = 'Password must be at least 6 characters.';
            return;
        }

        if (password !== confirmPassword) {
            msgEl.textContent = 'Passwords do not match.';
            return;
        }

        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            // set displayName from form if available
            try { await updateProfile(user, { displayName: fullname }); } catch (e) { /* ignore */ }
            try { localStorage.setItem('pm_username', user.displayName || fullname || email); } catch (e) {}
            msgEl.textContent = 'Registration successful.';
            msgEl.classList.add('success');
            setTimeout(function(){ window.location.href = 'FrameDashboard.html'; }, 600);
        } catch (err) {
            console.error('Registration error', err);
            // Demo fallback: store locally
            try {
                const usersKey = 'pm_users';
                const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
                const newUser = { id: Date.now().toString(), name: fullname, username: username, email: email, provider: 'local' };
                users.push(newUser);
                localStorage.setItem(usersKey, JSON.stringify(users));
                localStorage.setItem('pm_username', fullname || email);
                msgEl.textContent = 'Registration successful (demo).';
                msgEl.classList.add('success');
                setTimeout(function(){ window.location.href = 'FrameDashboard.html'; }, 600);
            } catch (e2) {
                msgEl.textContent = 'Registration failed.';
            }
        }
    });
}

if (googleBtn) {
    googleBtn.addEventListener('click', async function () {
        // prevent double clicks / multiple popups
        if (googleBtn.disabled) return;
        googleBtn.disabled = true;
        try {
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            // ensure local demo record exists
            try {
                const usersKey = 'pm_users';
                const users = JSON.parse(localStorage.getItem(usersKey) || '[]');
                const existing = users.find(u => u.email === user.email);
                if (!existing) {
                    users.push({ id: user.uid, name: user.displayName, email: user.email, provider: 'google' });
                    localStorage.setItem(usersKey, JSON.stringify(users));
                }
            } catch (e) {}
            try { localStorage.setItem('pm_username', user.displayName || user.email); } catch (e) {}
            window.location.href = 'FrameDashboard.html';
        } catch (err) {
            console.error('Google sign-up error', err);
            if (msgEl) {
                if (err && err.code === 'auth/unauthorized-domain') {
                    msgEl.innerHTML = 'Sign-in blocked: unauthorized domain. Serve the app over HTTP(S) (not file://) and add <strong>localhost</strong> (or your host) to <em>Authorized domains</em> in the Firebase console (Authentication → Sign-in method → Authorized domains).';
                } else if (err && err.code === 'auth/popup-blocked') {
                    msgEl.innerHTML = 'Sign-in blocked by your browser (popup blocked). Allow popups for this site or try again. If you see this on Vercel/custom domain, ensure the origin is added to Firebase/Google OAuth.';
                } else if (err && err.code === 'auth/cancelled-popup-request') {
                    msgEl.textContent = 'Sign-in cancelled (popup request was cancelled). Please try again.';
                } else {
                    msgEl.textContent = 'Google sign-up failed: ' + (err.message || err.code || 'unknown error');
                }
            }
        } finally {
            googleBtn.disabled = false;
        }
    });
}