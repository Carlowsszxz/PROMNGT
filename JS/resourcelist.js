/* Resource list script: populate table, filters, search, and view details */
(function(){
  var resources = [
    {id:1,name:'Parking Spot A12',type:'parking',location:'Building A',status:'free'},
    {id:2,name:'Parking Spot A13',type:'parking',location:'Building A',status:'occupied'},
    {id:3,name:'Seat 42',type:'seat',location:'Building A',status:'free'},
    {id:4,name:'Seat 7',type:'seat',location:'Building B',status:'occupied'},
    {id:5,name:'Conference Room 3',type:'room',location:'Building A',status:'pending'},
    {id:6,name:'Meeting Room 1',type:'room',location:'Building B',status:'free'}
  ];

  var tbody = document.getElementById('resourceTbody');
  var filterType = document.getElementById('filterType');
  var filterStatus = document.getElementById('filterStatus');
  var filterLocation = document.getElementById('filterLocation');
  var searchInput = document.getElementById('searchInput');
  var clearBtn = document.getElementById('clearFilters');

  function unique(values){ return values.filter(function(v,i,a){return a.indexOf(v)===i}); }

  function populateFilters(){
    var types = unique(resources.map(function(r){return r.type;}));
    types.unshift('all');
    filterType.innerHTML = types.map(function(t){ return '<option value="'+t+'">'+(t==='all'? 'All types': t.charAt(0).toUpperCase()+t.slice(1))+'</option>'; }).join('');

    var statuses = unique(resources.map(function(r){return r.status;})); statuses.unshift('all');
    filterStatus.innerHTML = statuses.map(function(s){ return '<option value="'+s+'">'+(s==='all'? 'All status': s.charAt(0).toUpperCase()+s.slice(1))+'</option>'; }).join('');

    var locs = unique(resources.map(function(r){return r.location;})); locs.unshift('all');
    filterLocation.innerHTML = locs.map(function(l){ return '<option value="'+l+'">'+(l==='all'? 'All locations': l)+'</option>'; }).join('');
  }

  function statusClass(s){ if(s==='free') return 's-free'; if(s==='occupied') return 's-occupied'; return 's-pending'; }

  function renderTable(){
    var q = (searchInput.value || '').toLowerCase();
    var t = filterType.value || 'all';
    var s = filterStatus.value || 'all';
    var l = filterLocation.value || 'all';

    var filtered = resources.filter(function(r){
      if(t!=='all' && r.type!==t) return false;
      if(s!=='all' && r.status!==s) return false;
      if(l!=='all' && r.location!==l) return false;
      if(q && !(r.name.toLowerCase().indexOf(q) > -1)) return false;
      return true;
    });

    tbody.innerHTML = '';
    filtered.forEach(function(r){
      var tr = document.createElement('tr');
      tr.innerHTML = '<td>'+r.name+'</td><td>'+r.type+'</td><td>'+r.location+'</td><td><span class="status-badge '+statusClass(r.status)+'">'+r.status.charAt(0).toUpperCase()+r.status.slice(1)+'</span></td>';
      var actions = document.createElement('td');
      var view = document.createElement('button'); view.className='action-btn action-view'; view.textContent='View';
      view.addEventListener('click', function(){ viewDetails(r); });
      actions.appendChild(view);
      tr.appendChild(actions);
      tbody.appendChild(tr);
    });
  }

  function viewDetails(r){
    // open map or details; simple behavior: open FrameMap and alert resource (demo)
    try{ window.open('FrameMap.html','_blank'); } catch(e){}
    setTimeout(function(){ alert(r.name + '\n' + r.type + ' • ' + r.location + '\nStatus: ' + r.status); }, 300);
  }

  clearBtn.addEventListener('click', function(){ searchInput.value=''; filterType.value='all'; filterStatus.value='all'; filterLocation.value='all'; renderTable(); });
  [filterType,filterStatus,filterLocation,searchInput].forEach(function(el){ if(el) el.addEventListener('input', renderTable); });

  populateFilters(); renderTable();

})();
