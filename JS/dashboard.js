// greet, render stats, upcoming reservations and alerts
(function(){
    var name = 'User';
    try { name = localStorage.getItem('pm_username') || name; } catch(e){}

    // UI elements
    var userEl = document.getElementById('userName');
    var spotsEl = document.getElementById('spotsCount');
    var seatsEl = document.getElementById('seatsCount');
    var roomsEl = document.getElementById('roomsCount');
    var activeResEl = document.getElementById('activeReservations');
    var upcomingList = document.getElementById('upcomingList');
    var alertsList = document.getElementById('alertsList');
    var noUpcoming = document.getElementById('noUpcoming');

    if(userEl) userEl.textContent = name;

    // Demo data (replace with real API calls as needed)
    var demoStats = {
        spots: 12,
        seats: 34,
        rooms: 5,
        activeReservations: 3
    };

    var demoUpcoming = [
        {date:'2026-03-05',time:'09:00',resource:'Parking Spot A12',status:'Confirmed'},
        {date:'2026-03-07',time:'14:30',resource:'Conference Room 3',status:'Pending'},
        {date:'2026-03-10',time:'11:00',resource:'Seat 42',status:'Confirmed'}
    ];

    var demoAlerts = [
        {type:'reminder',text:'You have a reservation tomorrow at 09:00 for Parking Spot A12.'},
        {type:'system',text:'Planned maintenance on 2026-03-08 from 02:00–04:00.'}
    ];

    // Render functions
    function renderStats(s){
        if(spotsEl) spotsEl.textContent = s.spots;
        if(seatsEl) seatsEl.textContent = s.seats;
        if(roomsEl) roomsEl.textContent = s.rooms;
        if(activeResEl) activeResEl.textContent = s.activeReservations;
    }

    function renderUpcoming(list){
        if(!upcomingList) return;
        upcomingList.innerHTML = '';
        if(!list || list.length===0){
            if(noUpcoming) noUpcoming.style.display = 'block';
            return;
        }
        if(noUpcoming) noUpcoming.style.display = 'none';
        list.forEach(function(r){
            var li = document.createElement('li');
            var left = document.createElement('div');
            var right = document.createElement('div');
            left.innerHTML = '<strong>'+r.resource+'</strong><div class="meta">'+r.date+' • '+r.time+'</div>';
            right.innerHTML = '<span class="meta">'+r.status+'</span>';
            li.appendChild(left); li.appendChild(right);
            upcomingList.appendChild(li);
        });
    }

    function renderAlerts(list){
        if(!alertsList) return;
        alertsList.innerHTML = '';
        list.forEach(function(a){
            var li = document.createElement('li');
            li.textContent = a.text;
            alertsList.appendChild(li);
        });
    }

    // wire actions
    var reserveBtn = document.getElementById('reserveBtn');
    if(reserveBtn){
        reserveBtn.addEventListener('click', function(){
            // open register/reserve page - replace with actual reservation flow
            window.open('FrameRegister.html','_blank');
        });
    }

    var viewMapBtn = document.getElementById('viewMapBtn');
    if(viewMapBtn){
        viewMapBtn.addEventListener('click', function(){
            // placeholder - open frames/navigation
            window.open('FrameMap.html','_blank');
        });
    }

    var logout = document.getElementById('logout');
    if(logout){
        logout.addEventListener('click', function(){
            try { localStorage.removeItem('pm_username'); } catch(e){}
            window.location.href = 'FrameLogin.html';
        });
    }

    // initial render
    renderStats(demoStats);
    renderUpcoming(demoUpcoming);
    renderAlerts(demoAlerts);

})();
