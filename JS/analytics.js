/* Simple analytics: read reservations from localStorage (pm_reservations), draw basic charts, export CSV, and generate insights. */
(function(){
  var key = 'pm_reservations';
  function loadReservations(){ try{ return JSON.parse(localStorage.getItem(key) || '[]'); }catch(e){ return []; } }

  function groupByDate(res){
    var map = {};
    res.forEach(function(r){ map[r.date] = (map[r.date]||0)+1; });
    return map;
  }

  function countByHour(res){
    var hours = new Array(24).fill(0);
    res.forEach(function(r){ if(r.time){ var h = parseInt(r.time.split(':')[0],10); if(!isNaN(h)) hours[h]++; } });
    return hours;
  }

  function drawLineChart(canvas, labels, values){
    if(!canvas) return; var ctx = canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height);
    var w = canvas.width, h = canvas.height; var max = Math.max.apply(null, values.concat([1]));
    // draw axes
    ctx.strokeStyle = '#e6e9ef'; ctx.lineWidth=1; ctx.beginPath(); ctx.moveTo(40,h-30); ctx.lineTo(w-10,h-30); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(40,10); ctx.lineTo(40,h-30); ctx.stroke();
    // draw line
    ctx.strokeStyle = '#2563eb'; ctx.lineWidth=2; ctx.beginPath();
    values.forEach(function(v,i){ var x = 40 + (i*(w-60)/(values.length-1 || 1)); var y = (h-40) - ( (v/max)*(h-60) ); if(i===0) ctx.moveTo(x,y); else ctx.lineTo(x,y); });
    ctx.stroke();
    // draw points and labels
    ctx.fillStyle='#2563eb'; values.forEach(function(v,i){ var x = 40 + (i*(w-60)/(values.length-1 || 1)); var y = (h-40) - ( (v/max)*(h-60) ); ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2); ctx.fill(); if(i%Math.ceil(values.length/10)===0){ ctx.fillStyle='#334155'; ctx.font='11px sans-serif'; ctx.fillText(labels[i], x-10, h-8); ctx.fillStyle='#2563eb'; } });
  }

  function drawBarChart(canvas, labels, values){
    if(!canvas) return; var ctx = canvas.getContext('2d'); ctx.clearRect(0,0,canvas.width,canvas.height);
    var w = canvas.width, h = canvas.height; var max = Math.max.apply(null, values.concat([1]));
    var barW = (w-60)/labels.length;
    values.forEach(function(v,i){ var x = 40 + i*barW; var bw = barW*0.8; var y = (h-40) - (v/max)*(h-60); ctx.fillStyle='#2563eb'; ctx.fillRect(x, y, bw, (h-40)-y); if(i%2===0){ ctx.fillStyle='#334155'; ctx.font='11px sans-serif'; ctx.fillText(labels[i], x, h-8); } });
  }

  function generateInsights(res){
    var insights = [];
    if(res.length===0) { insights.push('No reservations available to analyze.'); return insights; }
    // occupancy per hour
    var byHour = countByHour(res);
    var total = byHour.reduce(function(a,b){return a+b},0);
    var avg = total / 24;
    // find underutilized hours: hours with < 30% of avg
    var under = [];
    byHour.forEach(function(c,h){ if(c < avg*0.3) under.push(h); });
    if(under.length){ insights.push('Underutilized hours: '+ under.join(', ') +'. Consider targeted promotions or reduced staffing.'); }

    // busiest hour
    var maxCount = Math.max.apply(null, byHour); var busy = byHour.indexOf(maxCount);
    insights.push('Busiest hour: '+busy+':00 with '+maxCount+' reservations.');

    // day trends
    var byDate = groupByDate(res); var days = Object.keys(byDate); if(days.length){ var peakDay = days.sort(function(a,b){return byDate[b]-byDate[a]})[0]; insights.push('Peak day: '+peakDay+' with '+byDate[peakDay]+' reservations.'); }
    return insights;
  }

  function exportCSV(res){
    var rows = [['id','resourceName','date','time','status']];
    res.forEach(function(r){ rows.push([r.id, (r.resourceName||r.resource||''), r.date||'', r.time||'', r.status||'']); });
    var csv = rows.map(function(r){return r.map(function(c){ return '"'+String(c).replace(/"/g,'""')+'"'; }).join(','); }).join('\n');
    var blob = new Blob([csv], {type:'text/csv'}); var url = URL.createObjectURL(blob);
    var a = document.createElement('a'); a.href = url; a.download = 'reservations.csv'; document.body.appendChild(a); a.click(); a.remove(); URL.revokeObjectURL(url);
  }

  // main
  var res = loadReservations();
  // usage over time: last 14 days
  var dates = [];
  for(var i=13;i>=0;i--){ var d = new Date(); d.setDate(d.getDate()-i); dates.push(d.toISOString().slice(0,10)); }
  var counts = dates.map(function(dt){ return res.filter(function(r){ return r.date===dt }).length; });

  var usageCanvas = document.getElementById('usageChart');
  drawLineChart(usageCanvas, dates, counts);

  var hours = countByHour(res); var hourLabels = hours.map(function(_,i){ return String(i); });
  var peakCanvas = document.getElementById('peakChart');
  drawBarChart(peakCanvas, hourLabels, hours);

  var insights = generateInsights(res);
  var list = document.getElementById('insightsList'); if(list){ list.innerHTML = ''; insights.forEach(function(s){ var div = document.createElement('div'); div.className='insight'; div.textContent = s; list.appendChild(div); }); }

  var exportBtn = document.getElementById('exportCsv'); if(exportBtn){ exportBtn.addEventListener('click', function(){ exportCSV(res); }); }

})();
