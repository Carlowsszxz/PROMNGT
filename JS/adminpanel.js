/* Admin panel behaviors: manage resources, sensor status, reservations view (demo using localStorage) */
(function(){
  var resourcesKey = 'pm_resources';
  var reservationsKey = 'pm_reservations';

  // sample initial resources if none exist
  function seedResources(){
    var seed = [
      {id:1,name:'Parking Spot A12',type:'parking',location:'Building A',status:'free'},
      {id:2,name:'Parking Spot A13',type:'parking',location:'Building A',status:'occupied'},
      {id:3,name:'Seat 42',type:'seat',location:'Building A',status:'free'},
      {id:4,name:'Conference Room 3',type:'room',location:'Building A',status:'pending'}
    ];
    try{ if(!localStorage.getItem(resourcesKey)) localStorage.setItem(resourcesKey, JSON.stringify(seed)); }catch(e){}
  }

  function loadResources(){ try{ return JSON.parse(localStorage.getItem(resourcesKey) || '[]'); }catch(e){return []} }
  function saveResources(list){ try{ localStorage.setItem(resourcesKey, JSON.stringify(list)); }catch(e){} }

  var tableBody = document.querySelector('#resourceTable tbody');
  var searchInput = document.getElementById('searchResource');
  var addBtn = document.getElementById('addResource');

  var modal = document.getElementById('resourceModal');
  var closeModal = document.getElementById('closeModal');
  var modalTitle = document.getElementById('modalTitle');
  var modalName = document.getElementById('modalName');
  var modalType = document.getElementById('modalType');
  var modalLocation = document.getElementById('modalLocation');
  var modalStatus = document.getElementById('modalStatus');
  var saveResource = document.getElementById('saveResource');

  var sensorList = document.getElementById('sensorList');
  var recentRes = document.getElementById('recentRes');
  var viewAllRes = document.getElementById('viewAllRes');

  var editingId = null;

  function renderResources(){
    var list = loadResources();
    tableBody.innerHTML = '';
    list.forEach(function(r){
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>'+r.name+'</td><td>'+r.type+'</td><td>'+r.location+'</td><td><span class="badge '+(r.status==='free'?'s-free':(r.status==='occupied'?'s-occupied':'s-pending'))+'">'+r.status+'</span></td>';
      var actionsTd = document.createElement('td');
      var edit = document.createElement('button'); edit.className='action-btn'; edit.textContent='Edit';
      edit.addEventListener('click', function(){ openModal(r); });
      var del = document.createElement('button'); del.className='action-btn'; del.textContent='Delete';
      del.addEventListener('click', function(){ if(confirm('Delete resource?')){ deleteResource(r.id); } });
      actionsTd.appendChild(edit); actionsTd.appendChild(del);
      tr.appendChild(actionsTd);
      tableBody.appendChild(tr);
    });
  }

  function deleteResource(id){ var list = loadResources(); var idx = list.findIndex(function(x){return x.id===id}); if(idx>-1){ list.splice(idx,1); saveResources(list); renderResources(); } }

  function openModal(r){
    editingId = r ? r.id : null;
    modalTitle.textContent = r ? 'Edit Resource' : 'Add Resource';
    modalName.value = r ? r.name : '';
    modalType.value = r ? r.type : 'parking';
    modalLocation.value = r ? r.location : '';
    modalStatus.value = r ? r.status : 'free';
    modal.setAttribute('aria-hidden','false');
  }

  function closeModalFn(){ modal.setAttribute('aria-hidden','true'); editingId = null; }

  saveResource.addEventListener('click', function(){
    var name = modalName.value.trim(); var type = modalType.value; var loc = modalLocation.value.trim(); var status = modalStatus.value;
    if(!name || !loc){ alert('Name and location required'); return; }
    var list = loadResources();
    if(editingId){
      var r = list.find(function(x){return x.id===editingId}); if(r){ r.name=name; r.type=type; r.location=loc; r.status=status; }
    } else {
      var id = Date.now(); list.push({id:id,name:name,type:type,location:loc,status:status});
    }
    saveResources(list); renderResources(); closeModalFn();
  });

  closeModal.addEventListener('click', closeModalFn);
  addBtn.addEventListener('click', function(){ openModal(null); });

  searchInput.addEventListener('input', function(){ var q = searchInput.value.toLowerCase(); var rows = tableBody.querySelectorAll('tr'); rows.forEach(function(r){ r.style.display = (r.textContent.toLowerCase().indexOf(q)>-1)? 'table-row':'none'; }); });

  // sensor status (demo) — derive from resources
  function renderSensors(){ var list = loadResources(); sensorList.innerHTML=''; list.forEach(function(r){ var li = document.createElement('li'); li.innerHTML = '<div>'+r.name+' <div class="meta">'+r.location+'</div></div><div class="meta">Sensor: OK</div>'; sensorList.appendChild(li); }); }

  // recent reservations
  function renderRecentReservations(){ var res = []; try{ res = JSON.parse(localStorage.getItem(reservationsKey)||'[]'); }catch(e){}; recentRes.innerHTML=''; res.slice(0,6).forEach(function(r){ var li=document.createElement('li'); li.textContent = r.resourceName + ' • ' + r.date + ' ' + r.time + ' • ' + (r.status||'Confirmed'); recentRes.appendChild(li); }); }

  viewAllRes.addEventListener('click', function(){ window.open('FrameMyReservations.html','_blank'); });

  // init
  seedResources(); renderResources(); renderSensors(); renderRecentReservations();

})();
