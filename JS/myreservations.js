/* Render user's reservations from localStorage (pm_reservations)
   Provide cancel and edit (date/time) actions.
*/
(function(){
  var storageKey = 'pm_reservations';
  function load(){
    try{ return JSON.parse(localStorage.getItem(storageKey) || '[]'); } catch(e){ return []; }
  }
  function save(list){ try{ localStorage.setItem(storageKey, JSON.stringify(list)); } catch(e){} }

  var activeListEl = document.getElementById('activeList');
  var upcomingListEl = document.getElementById('upcomingList');
  var pastListEl = document.getElementById('pastList');
  var countUpcoming = document.getElementById('countUpcoming');
  var countActive = document.getElementById('countActive');
  var countPast = document.getElementById('countPast');
  var noActive = document.getElementById('noActive');
  var noUpcoming = document.getElementById('noUpcoming');
  var noPast = document.getElementById('noPast');

  function toDateTime(r){ return new Date(r.date + 'T' + r.time); }
  function isExpired(r){ return toDateTime(r) < new Date(); }
  function isToday(r){ var d = new Date(r.date); var today = new Date(); return d.getFullYear()===today.getFullYear() && d.getMonth()===today.getMonth() && d.getDate()===today.getDate(); }

  function render(){
    var all = load();
    // sort by date asc
    all.sort(function(a,b){ return new Date(a.date+'T'+a.time) - new Date(b.date+'T'+b.time); });

    var upcoming = all.filter(function(r){ return !isExpired(r) && !isToday(r) && r.status!=='Cancelled'; });
    var active = all.filter(function(r){ return !isExpired(r) && isToday(r) && r.status!=='Cancelled'; });
    var past = all.filter(function(r){ return isExpired(r) || r.status==='Cancelled'; });

    renderList(upcomingListEl, upcoming, 'upcoming');
    renderList(activeListEl, active, 'active');
    renderList(pastListEl, past, 'past');

    if(countUpcoming) countUpcoming.textContent = upcoming.length;
    if(countActive) countActive.textContent = active.length;
    if(countPast) countPast.textContent = past.length;

    if(noActive) noActive.style.display = active.length? 'none':'block';
    if(noUpcoming) noUpcoming.style.display = upcoming.length? 'none':'block';
    if(noPast) noPast.style.display = past.length? 'none':'block';
  }

  function statusBadge(r){
    if(r.status==='Cancelled') return '<span class="badge badge-cancelled">Cancelled</span>';
    if(isExpired(r)) return '<span class="badge badge-expired">Expired</span>';
    if(r.status==='Pending') return '<span class="badge badge-pending">Pending</span>';
    return '<span class="badge badge-confirmed">Confirmed</span>';
  }

  function renderList(container, items, kind){
    if(!container) return;
    container.innerHTML = '';
    items.forEach(function(r){
      var li = document.createElement('li');
      var meta = document.createElement('div'); meta.className = 'res-meta';
      var title = document.createElement('div'); title.className = 'res-title'; title.textContent = r.resourceName || r.resource || 'Resource';
      var sub = document.createElement('div'); sub.className = 'res-sub'; sub.textContent = r.resourceLocation ? (r.resourceLocation+' • ') + r.date + ' ' + r.time : r.date + ' ' + r.time + ' • ' + (r.resourceName||r.resource||'Resource');
      meta.appendChild(title); meta.appendChild(sub);

      var right = document.createElement('div');
      right.innerHTML = statusBadge(r);

      var actions = document.createElement('div'); actions.className='action-group';
      // Edit allowed if not expired and not cancelled
      if(!isExpired(r) && r.status!=='Cancelled'){
        var edit = document.createElement('button'); edit.className='action-btn action-edit'; edit.textContent='Edit';
        edit.addEventListener('click',function(){ editReservation(r.id); });
        actions.appendChild(edit);
        var cancel = document.createElement('button'); cancel.className='action-btn action-cancel'; cancel.textContent='Cancel';
        cancel.addEventListener('click',function(){ cancelReservation(r.id); });
        actions.appendChild(cancel);
      }

      right.appendChild(actions);
      li.appendChild(meta); li.appendChild(right);
      container.appendChild(li);
    });
  }

  function findById(id){ var all = load(); return all.find(function(r){return String(r.id)===String(id);}); }

  function cancelReservation(id){
    var all = load();
    var idx = all.findIndex(function(r){return String(r.id)===String(id);});
    if(idx===-1) return alert('Reservation not found');
    if(confirm('Cancel this reservation?')){
      all[idx].status = 'Cancelled';
      save(all); render();
    }
  }

  function editReservation(id){
    var all = load();
    var idx = all.findIndex(function(r){return String(r.id)===String(id);});
    if(idx===-1) return alert('Reservation not found');
    var r = all[idx];
    var newDate = prompt('New date (YYYY-MM-DD)', r.date);
    if(!newDate) return;
    var newTime = prompt('New time (HH:MM)', r.time);
    if(!newTime) return;
    // basic validation
    var dt = new Date(newDate + 'T' + newTime);
    if(isNaN(dt.getTime())){ alert('Invalid date/time'); return; }
    r.date = newDate; r.time = newTime; r.status = 'Confirmed';
    save(all); render();
  }

  // initialize UI
  render();

  // expose for debugging
  window._pm_reservations_render = render;
  window._pm_reservations_cancel = cancelReservation;
  window._pm_reservations_edit = editReservation;

})();
