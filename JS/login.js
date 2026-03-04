// Login (Firebase Auth via ES module)
import { auth, GoogleAuthProvider, signInWithPopup, signInWithEmailAndPassword } from './firebase-init.js';

document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('loginForm');
  const msg = document.getElementById('error-message');
  const googleBtn = document.getElementById('googleSignBtn');

  if (form) {
    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      msg.textContent = '';
      msg.classList.remove('success');

      const username = document.getElementById('username').value.trim();
      const password = document.getElementById('password').value;

      if (!username || !password) {
        msg.textContent = 'Please enter username and password.';
        return;
      }

      try {
        const userCredential = await signInWithEmailAndPassword(auth, username, password);
        const u = userCredential.user;
        msg.textContent = 'Login successful.';
        msg.classList.add('success');
        try { localStorage.setItem('pm_username', u.displayName || u.email || username); } catch (e) {}
        setTimeout(function () { window.location.href = 'FrameDashboard.html'; }, 600);
      } catch (err) {
        // fallback demo credential
        if (username === 'admin' && password === 'password') {
          msg.textContent = 'Login successful (demo).';
          msg.classList.add('success');
          try { localStorage.setItem('pm_username', username); } catch (e) {}
          setTimeout(function () { window.location.href = 'FrameDashboard.html'; }, 600);
        } else {
          msg.textContent = 'Invalid username or password.';
        }
      }
    });
  }

  if (googleBtn) {
    googleBtn.addEventListener('click', async function () {
      try {
        const provider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        try { localStorage.setItem('pm_username', user.displayName || user.email); } catch (e) {}
        window.location.href = 'FrameDashboard.html';
      } catch (err) {
        console.error('Google sign-in error', err);
        if (msg) {
          const origin = window.location.origin || (window.location.protocol + '//' + window.location.host);
          if (err && err.code === 'auth/unauthorized-domain') {
            msg.innerHTML = 'Sign-in blocked: unauthorized domain. Your current origin is <strong>' + origin + '</strong>.<br>Add this origin (or 127.0.0.1) under <em>Authorized domains</em> in the Firebase console (Authentication → Sign-in method → Authorized domains) and add the exact origin in your OAuth client allowed origins.';
          } else {
            msg.textContent = 'Google sign-in failed: ' + (err.message || err.code || 'unknown error');
          }
        }
      }
    });
  }
});

