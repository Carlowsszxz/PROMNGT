// Reservation form behavior and availability checks (demo)
(function(){
  var resources = [
    {id:1,type:'parking',name:'Parking Spot A12',location:'Building A',status:'free'},
    {id:2,type:'parking',name:'Parking Spot A13',location:'Building A',status:'occupied'},
    {id:3,type:'seat',name:'Seat 42',location:'Building A',status:'free'},
    {id:4,type:'seat',name:'Seat 7',location:'Building B',status:'occupied'},
    {id:5,type:'room',name:'Conference Room 3',location:'Building A',status:'pending'},
    {id:6,type:'room',name:'Meeting Room 1',location:'Building B',status:'free'}
  ];

  var resType = document.getElementById('resType');
  var resSelect = document.getElementById('resSelect');
  var resDate = document.getElementById('resDate');
  var resTime = document.getElementById('resTime');
  var checkBtn = document.getElementById('checkAvailability');
  var form = document.getElementById('reservationForm');
  var statusArea = document.getElementById('statusArea');

  function populateResources(){
    var t = resType.value;
    resSelect.innerHTML = '';
    resources.filter(function(r){return r.type===t}).forEach(function(r){
      var opt = document.createElement('option'); opt.value = r.id; opt.textContent = r.name +' — '+ r.location; resSelect.appendChild(opt);
    });
  }

  function getResourceById(id){ return resources.find(function(r){return String(r.id)===String(id);}); }

  function checkAvailability(){
    statusArea.className = 'status-area';
    var id = resSelect.value; var date = resDate.value; var time = resTime.value;
    if(!id || !date || !time){ statusArea.textContent = 'Please select resource, date and time.'; return {ok:false,reason:'incomplete'} }
    var r = getResourceById(id);
    if(!r){ statusArea.textContent = 'Resource not found.'; return {ok:false,reason:'notfound'} }

    // Demo logic: base on resource.status
    if(r.status==='occupied'){
      statusArea.innerHTML = '<div class="status-error">This resource is currently occupied for the selected time.</div>';
      return {ok:false,reason:'occupied'};
    }
    if(r.status==='pending'){
      statusArea.innerHTML = '<div class="status-warning">Status pending — reservation may be tentative. Try another time or confirm.</div>';
      return {ok:true,warning:true};
    }

    statusArea.innerHTML = '<div class="status-success">Available — you can reserve this resource.</div>';
    return {ok:true};
  }

  // live update when user changes date/time or resource
  ['change','input'].forEach(function(ev){
    resSelect.addEventListener(ev, function(){ if(resDate.value && resTime.value) checkAvailability(); });
    resDate.addEventListener(ev, function(){ if(resSelect.value && resTime.value) checkAvailability(); });
    resTime.addEventListener(ev, function(){ if(resSelect.value && resDate.value) checkAvailability(); });
  });

  if(resType) resType.addEventListener('change', populateResources);
  if(checkBtn) checkBtn.addEventListener('click', checkAvailability);

  if(form) form.addEventListener('submit', function(e){
    e.preventDefault();
    var result = checkAvailability();
    if(!result.ok){ return; }

    // create a simple reservation record in localStorage
    var reservations = [];
    try{ reservations = JSON.parse(localStorage.getItem('pm_reservations')||'[]'); }catch(e){ reservations = []; }
    var sel = getResourceById(resSelect.value);
    var rec = {id: Date.now(), resourceId: sel.id, resourceName: sel.name, date: resDate.value, time: resTime.value, status: 'Confirmed'};
    reservations.unshift(rec);
    try{ localStorage.setItem('pm_reservations', JSON.stringify(reservations)); }catch(e){}

    statusArea.innerHTML = '<div class="status-success">Reservation confirmed for '+sel.name+' on '+resDate.value+' at '+resTime.value+'. Redirecting to dashboard…</div>';
    setTimeout(function(){ window.location.href = 'FrameDashboard.html'; }, 900);
  });

  // init
  if(resType) populateResources();
})();
