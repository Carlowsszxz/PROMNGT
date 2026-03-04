/* Demo interactive map/grid for resources */
(function(){
  // demo resource data
  var resources = [
    {id:1,type:'parking',name:'Parking Spot A12',location:'Building A',status:'free'},
    {id:2,type:'parking',name:'Parking Spot A13',location:'Building A',status:'occupied'},
    {id:3,type:'seat',name:'Seat 42',location:'Building A',status:'free'},
    {id:4,type:'seat',name:'Seat 7',location:'Building B',status:'occupied'},
    {id:5,type:'room',name:'Conference Room 3',location:'Building A',status:'pending'},
    {id:6,type:'room',name:'Meeting Room 1',location:'Building B',status:'free'}
  ];

  var grid = document.getElementById('mapGrid');
  var filterType = document.getElementById('filterType');
  var filterLocation = document.getElementById('filterLocation');
  var detailPanel = document.getElementById('detailPanel');
  var detailName = document.getElementById('detailName');
  var detailType = document.getElementById('detailType');
  var detailLocation = document.getElementById('detailLocation');
  var detailStatus = document.getElementById('detailStatus');
  var reserveBtn = document.getElementById('reserveResource');
  var closeBtn = document.getElementById('closeDetail');

  function statusClass(s){
    if(s==='free') return 'status-free';
    if(s==='occupied') return 'status-occupied';
    return 'status-pending';
  }

  function renderGrid(){
    if(!grid) return;
    grid.innerHTML = '';
    var t = filterType ? filterType.value : 'all';
    var l = filterLocation ? filterLocation.value : 'all';

    var filtered = resources.filter(function(r){
      if(t!=='all' && r.type!==t) return false;
      if(l!=='all' && r.location!==l) return false;
      return true;
    });

    filtered.forEach(function(r){
      var card = document.createElement('div');
      card.className = 'resource-card';
      card.tabIndex = 0;
      card.setAttribute('data-id', r.id);

      var dot = document.createElement('div');
      dot.className = 'dot ' + (r.status==='free' ? 'free' : (r.status==='occupied'?'occupied':'pending'));

      var meta = document.createElement('div');
      meta.className = 'resource-meta';
      meta.innerHTML = '<div class="resource-name">'+r.name+'</div><div class="resource-sub">'+r.location+' • '+r.type+'</div>';

      var status = document.createElement('div');
      status.className = 'resource-status '+statusClass(r.status);
      status.textContent = r.status.charAt(0).toUpperCase()+r.status.slice(1);

      card.appendChild(dot);
      card.appendChild(meta);
      card.appendChild(status);

      card.addEventListener('click', function(){ showDetail(r); });
      card.addEventListener('keypress', function(e){ if(e.key==='Enter') showDetail(r); });

      grid.appendChild(card);
    });
  }

  function showDetail(r){
    if(!detailPanel) return;
    detailName.textContent = r.name;
    detailType.textContent = 'Type: '+r.type;
    detailLocation.textContent = 'Location: '+r.location;
    detailStatus.textContent = 'Status: '+r.status;
    detailPanel.setAttribute('aria-hidden','false');
    detailPanel.style.display = 'block';

    // attach reserve handler
    if(reserveBtn){
      reserveBtn.onclick = function(){
        // simple demo: open registration/reservation form
        window.open('FrameRegister.html','_blank');
      };
    }
  }

  if(closeBtn){ closeBtn.addEventListener('click', function(){ detailPanel.setAttribute('aria-hidden','true'); detailPanel.style.display='none'; }); }

  if(filterType) filterType.addEventListener('change', renderGrid);
  if(filterLocation) filterLocation.addEventListener('change', renderGrid);

  // initial render
  renderGrid();

})();
