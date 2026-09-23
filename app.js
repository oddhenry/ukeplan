import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import { getFirestore, doc, setDoc, onSnapshot } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';
import { SHARED, WEEKS } from './weeks-data.js';

var firebaseConfig = {
  apiKey: "AIzaSyDuedqXK0ceD0JRoG0kM1elity6vTZlxac",
  authDomain: "ukeplan-46e25.firebaseapp.com",
  projectId: "ukeplan-46e25",
  storageBucket: "ukeplan-46e25.firebasestorage.app",
  messagingSenderId: "949368823637",
  appId: "1:949368823637:web:239009ba53cfd74bfe99dc"
};
var firebaseApp = initializeApp(firebaseConfig);
var db = getFirestore(firebaseApp);

(function() {
  WEEKS.sort(function(a, b) { return (a.year - b.year) || (a.weekNumber - b.weekNumber); });

  function findWeek(id) {
    for (var i = 0; i < WEEKS.length; i++) if (WEEKS[i].id === id) return WEEKS[i];
    return null;
  }
  function findWeekIndex(id) {
    for (var i = 0; i < WEEKS.length; i++) if (WEEKS[i].id === id) return i;
    return -1;
  }

  // ---- ICS calendar-export helpers (unchanged) ----
  function pad(n) { return (n < 10 ? '0' : '') + n; }
  function icsDate(dateStr, timeStr) {
    var d = dateStr.replace(/-/g, '');
    if (!timeStr) return d;
    var t = timeStr.replace(/:/g, '');
    if (t.length === 4) t += '00'; // HH:MM -> HHMMSS
    return d + 'T' + t;
  }
  function escICS(str) {
    return String(str).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
  }
  function buildICS(cal) {
    var uid = 'ukeplan-' + Date.now() + '@teie-skole';
    var now = new Date();
    var stamp = now.getUTCFullYear() + pad(now.getUTCMonth() + 1) + pad(now.getUTCDate()) + 'T' + pad(now.getUTCHours()) + pad(now.getUTCMinutes()) + pad(now.getUTCSeconds()) + 'Z';
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Ukeplan 3. trinn//NO', 'BEGIN:VEVENT', 'UID:' + uid, 'DTSTAMP:' + stamp];
    if (cal.allDay) {
      var start = cal.date.replace(/-/g, '');
      var nextDay = new Date(cal.date + 'T00:00:00');
      nextDay.setDate(nextDay.getDate() + 1);
      var end = nextDay.getFullYear() + pad(nextDay.getMonth() + 1) + pad(nextDay.getDate());
      lines.push('DTSTART;VALUE=DATE:' + start, 'DTEND;VALUE=DATE:' + end);
    } else {
      var sd = cal.start.split('T'), ed = cal.end.split('T');
      lines.push('DTSTART:' + icsDate(sd[0], sd[1]), 'DTEND:' + icsDate(ed[0], ed[1]));
    }
    lines.push('SUMMARY:' + escICS(cal.title), 'LOCATION:' + escICS(cal.location), 'DESCRIPTION:' + escICS(cal.desc || ''), 'END:VEVENT', 'END:VCALENDAR');
    return lines.join('\r\n');
  }

  // ---- DOM refs ----
  var eyebrowSchool = document.getElementById('eyebrowSchool');
  var weekTitle = document.getElementById('weekTitle');
  var heroSub = document.getElementById('heroSub');
  var weekNav = document.getElementById('weekNav');
  var prevWeekBtn = document.getElementById('prevWeekBtn');
  var nextWeekBtn = document.getElementById('nextWeekBtn');
  var pinnedArea = document.getElementById('pinnedArea');
  var infoList = document.getElementById('infoList');
  var focusPanel = document.getElementById('focusPanel');
  var homeworkDeadline = document.getElementById('homeworkDeadline');
  var homeworkPanel = document.getElementById('homeworkPanel');
  var dayTabs = document.getElementById('dayTabs');
  var daySchedule = document.getElementById('daySchedule');
  var footerText = document.getElementById('footerText');

  var currentWeekId = null;
  var currentPinsUnsub = null;

  // ---- Section renderers ----
  function renderFocus(focus) {
    var html = '';
    focus.forEach(function(f) {
      html += '<h3>' + f.subject + '</h3><p>' + f.text + '</p>';
      if (f.example) html += '<p class="en-example">' + f.example + '</p>';
    });
    focusPanel.innerHTML = html;
  }

  function renderHomework(hw) {
    homeworkDeadline.textContent = hw.deadlineLabel;
    var html = '<h3>' + hw.sectionTitle + '</h3>';
    hw.tasks.forEach(function(t) {
      html += '<div class="task"><span class="task-bullet"></span><span class="task-label">' + t.label +
        (t.sub ? '<br><span class="task-sub">' + t.sub + '</span>' : '') + '</span></div>';
    });
    homeworkPanel.innerHTML = html;
  }

  function renderSchedule(schedule) {
    dayTabs.innerHTML = '';
    daySchedule.innerHTML = '';
    schedule.forEach(function(day, i) {
      var tab = document.createElement('button');
      tab.className = 'day-tab' + (i === 0 ? ' active' : '');
      tab.setAttribute('data-day', i);
      tab.textContent = day.day;
      dayTabs.appendChild(tab);

      var panel = document.createElement('div');
      panel.className = 'day-panel' + (i === 0 ? ' active' : '');
      panel.setAttribute('data-day', i);
      var list = document.createElement('div');
      list.className = 'schedule-list';
      day.items.forEach(function(item, idx) {
        var row = document.createElement('div');
        row.className = 'schedule-item';
        row.innerHTML = '<span class="schedule-num">' + (idx + 1) + '</span>' + item;
        list.appendChild(row);
      });
      panel.appendChild(list);
      var end = document.createElement('p');
      end.className = 'schedule-end';
      end.textContent = 'Slutt: ' + day.end;
      panel.appendChild(end);
      daySchedule.appendChild(panel);
    });

    var tabs = dayTabs.querySelectorAll('.day-tab');
    var panels = daySchedule.querySelectorAll('.day-panel');
    tabs.forEach(function(tab) {
      tab.addEventListener('click', function() {
        var day = tab.getAttribute('data-day');
        tabs.forEach(function(t) { t.classList.remove('active'); });
        panels.forEach(function(p) { p.classList.remove('active'); });
        tab.classList.add('active');
        daySchedule.querySelector('.day-panel[data-day="' + day + '"]').classList.add('active');
      });
    });
  }

  function updateFeaturedGroup(name) {
    document.getElementById('physEdGroup').textContent = name;
  }

  function renderContacts() {
    var contactsEl = document.getElementById('contactsSection');
    var html = '';
    SHARED.contacts.forEach(function(c) {
      html += '<a class="contact-row" href="mailto:' + c.email + '">' + c.role + '</a>';
    });
    html += '<p class="absence-note">' + SHARED.absenceNote + '</p>';
    contactsEl.innerHTML = html;
  }

  function renderInfo(week) {
    var pinsDocRef = doc(db, 'pins', week.id);

    function defaultPins() {
      var defaults = {};
      week.infoItems.forEach(function(item) { if (item.defaultPinned) defaults[item.id] = true; });
      return defaults;
    }

    var pins = defaultPins();

    function savePins(newPins) {
      pins = newPins;
      render();
      setDoc(pinsDocRef, pins).catch(function(e) {
        console.error('Kunne ikke lagre feste-status til skyen', e);
      });
    }

    if (currentPinsUnsub) { currentPinsUnsub(); }
    currentPinsUnsub = onSnapshot(pinsDocRef, function(snap) {
      pins = snap.exists() ? snap.data() : defaultPins();
      render();
    }, function(err) {
      console.error('Fikk ikke kontakt med skylagring, bruker lokale standardverdier', err);
      pins = defaultPins();
      render();
    });

    function render() {
      pinnedArea.innerHTML = '';
      infoList.innerHTML = '';
      week.infoItems.forEach(function(item) {
        if (pins[item.id]) {
          var wrap = document.createElement('div');
          wrap.className = 'callout-wrap';
          wrap.innerHTML =
            '<div class="callout-bg">' +
              '<button class="callout-unpin-swipe" aria-label="Løsne fra topp">✕</button>' +
            '</div>' +
            '<div class="callout">' +
              '<span class="callout-icon">📅</span>' +
              '<span class="callout-text">' + item.html + '</span>' +
              '<button class="callout-unpin-hover" aria-label="Løsne fra topp">✕</button>' +
            '</div>';

          var iconEl = wrap.querySelector('.callout-icon');
          if (item.cal) {
            var calLink = document.createElement('a');
            calLink.className = 'callout-icon';
            calLink.setAttribute('aria-label', 'Legg til i kalender');
            calLink.textContent = '📅';
            try {
              var blob = new Blob([buildICS(item.cal)], { type: 'text/calendar;charset=utf-8' });
              calLink.href = URL.createObjectURL(blob);
              calLink.download = item.id + '.ics';
            } catch (e) {}
            iconEl.replaceWith(calLink);
          }

          function unpin() {
            pins[item.id] = false;
            savePins(pins);
          }
          wrap.querySelector('.callout-unpin-hover').addEventListener('click', unpin);
          wrap.querySelector('.callout-unpin-swipe').addEventListener('click', unpin);

          pinnedArea.appendChild(wrap);

          var calloutFg = wrap.querySelector('.callout');
          var cStartX = null, cCurrentX = 0, cDragging = false;
          calloutFg.addEventListener('pointerdown', function(e) {
            if (e.target.closest('.callout-unpin-hover, .callout-icon')) return;
            cStartX = e.clientX;
            cDragging = true;
            try { calloutFg.setPointerCapture(e.pointerId); } catch (err) {}
            wrap.classList.add('dragging');
          });
          calloutFg.addEventListener('pointermove', function(e) {
            if (!cDragging) return;
            var delta = e.clientX - cStartX;
            if (delta > 0) delta = 0;
            if (delta < -120) delta = -120;
            cCurrentX = delta;
            calloutFg.style.transform = 'translateX(' + delta + 'px)';
          });
          function cOnUp() {
            if (!cDragging) return;
            cDragging = false;
            wrap.classList.remove('dragging');
            if (cCurrentX < -70) {
              unpin();
            } else {
              calloutFg.style.transform = 'translateX(0)';
            }
            cCurrentX = 0;
          }
          calloutFg.addEventListener('pointerup', cOnUp);
          calloutFg.addEventListener('pointercancel', cOnUp);
        } else {
          var li = document.createElement('li');
          li.innerHTML =
            '<div class="swipe-bg">📌 Fester øverst…</div>' +
            '<div class="swipe-fg">' + item.html +
              '<button class="pin-btn" aria-label="Fest øverst">📌</button>' +
            '</div>';
          infoList.appendChild(li);

          var fg = li.querySelector('.swipe-fg');
          var pinBtn = li.querySelector('.pin-btn');

          pinBtn.addEventListener('click', function() {
            pins[item.id] = true;
            savePins(pins);
          });

          var startX = null, currentX = 0, dragging = false;
          fg.addEventListener('pointerdown', function(e) {
            if (e.target.closest('.pin-btn')) return;
            startX = e.clientX;
            dragging = true;
            try { fg.setPointerCapture(e.pointerId); } catch (err) {}
            li.classList.add('dragging');
          });
          fg.addEventListener('pointermove', function(e) {
            if (!dragging) return;
            var delta = e.clientX - startX;
            if (delta < 0) delta = 0;
            if (delta > 120) delta = 120;
            currentX = delta;
            fg.style.transform = 'translateX(' + delta + 'px)';
          });
          function onUp() {
            if (!dragging) return;
            dragging = false;
            li.classList.remove('dragging');
            if (currentX > 70) {
              pins[item.id] = true;
              savePins(pins);
            } else {
              fg.style.transform = 'translateX(0)';
            }
            currentX = 0;
          }
          fg.addEventListener('pointerup', onUp);
          fg.addEventListener('pointercancel', onUp);
        }
      });
    }
    render();
  }

  // ---- Master week renderer ----
  function renderWeek(weekId) {
    var week = findWeek(weekId);
    if (!week) return;
    currentWeekId = weekId;

    eyebrowSchool.textContent = SHARED.school + ' · ' + SHARED.grade;
    weekTitle.textContent = 'Ukeplan – ' + week.weekNumber;
    heroSub.textContent = week.dateRange;
    document.title = 'Ukeplan uke ' + week.weekNumber + ' · ' + SHARED.grade;
    footerText.textContent = 'Ukeplan ' + SHARED.grade + ' · ' + SHARED.school + ' · uke ' + week.weekNumber;

    renderFocus(week.focus);
    renderHomework(week.homework);
    renderSchedule(week.schedule);
    updateFeaturedGroup(week.featuredGroup);
    renderInfo(week);

    var idx = findWeekIndex(weekId);
    prevWeekBtn.disabled = idx <= 0;
    nextWeekBtn.disabled = idx >= WEEKS.length - 1;
  }

  // ---- Init ----
  renderContacts();

  if (WEEKS.length <= 1) {
    weekNav.querySelectorAll('.week-nav-btn').forEach(function(b) { b.style.visibility = 'hidden'; });
  }

  prevWeekBtn.addEventListener('click', function() {
    var idx = findWeekIndex(currentWeekId);
    if (idx > 0) renderWeek(WEEKS[idx - 1].id);
  });
  nextWeekBtn.addEventListener('click', function() {
    var idx = findWeekIndex(currentWeekId);
    if (idx < WEEKS.length - 1) renderWeek(WEEKS[idx + 1].id);
  });

  renderWeek(WEEKS[WEEKS.length - 1].id);
})();
