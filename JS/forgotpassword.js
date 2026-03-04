// Simple forgot-password demo: generate a reset token and store it in localStorage
(function(){
  var form = document.getElementById('forgotForm');
  var emailEl = document.getElementById('email');
  var msgEl = document.getElementById('fpMessage');

  function genToken(){ return Math.random().toString(36).slice(2,10) + '-' + Date.now().toString(36); }

  function saveReset(email, token){
    var key = 'pm_password_resets';
    var list = [];
    try{ list = JSON.parse(localStorage.getItem(key) || '[]'); }catch(e){ list = []; }
    var expires = Date.now() + (1000 * 60 * 60); // 1 hour
    list.unshift({email:email, token:token, expires:expires});
    try{ localStorage.setItem(key, JSON.stringify(list)); }catch(e){}
  }

  form.addEventListener('submit', function(e){
    e.preventDefault(); msgEl.textContent = '';
    var email = (emailEl.value || '').trim().toLowerCase();
    if(!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)){
      msgEl.textContent = 'Please enter a valid email address.'; return;
    }

    // demo: generate token and store it; in production, send email via server
    var token = genToken();
    saveReset(email, token);

    // show gentle message; display token for demo environments
    msgEl.innerHTML = 'If an account exists, a reset link was sent. <br><strong>Demo token:</strong> '+token;
    emailEl.value = '';
    setTimeout(function(){ msgEl.textContent = 'If you received an email, follow the link to reset your password.'; }, 4000);
  });

})();
