/**
 * Learning Log — Interactive Progress Engine
 * Reads completed labs from localStorage.
 * Synchronizes Home Cockpit, Syllabus Page, and Daily Lab Completion.
 */

const STORAGE_KEY = 'learning_log_telemetry_state';

function normalizeUrl(url) {
  if (!url) return '';
  try {
    const u = new URL(url, window.location.origin);
    return u.pathname.replace(/\/$/, '') + '/';
  } catch {
    return url.replace(/\/$/, '') + '/';
  }
}

function getAppUrl(path) {
  const base = (window.SITE_BASE_URL || '/').replace(/\/$/, '');
  const cleanPath = (path || '').replace(/^\//, '');
  return cleanPath ? `${base}/${cleanPath}` : `${base}/`;
}

function loadUserState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { completedLabs: [] };
  } catch {
    return { completedLabs: [] };
  }
}

function saveUserState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    // Immediately synchronize all active components on the current page
    renderCockpitProgress(state);
    renderSyllabusCompletions(state);
    renderRoadmapTelemetry(state);
    renderHistoryPage(state);
  } catch (e) {
    console.warn('Could not save to localStorage:', e);
  }
}

// Cross-tab and window synchronization
window.addEventListener('storage', (e) => {
  if (e.key === STORAGE_KEY) {
    const newState = loadUserState();
    renderCockpitProgress(newState);
    renderSyllabusCompletions(newState);
    renderRoadmapTelemetry(newState);
    renderHistoryPage(newState);
  }
});

function pad(n) {
  if (n === undefined || n === null) return '01';
  return String(n).padStart(2, '0');
}

function escapeHtml(str) {
  if (!str && str !== 0) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(str) {
  return escapeHtml(str);
}

function setVal(id, text) {
  if (!text) return;
  const el = document.getElementById(id);
  if (el) el.textContent = text;
}

function setAttr(id, attr, val) {
  if (!val) return;
  const el = document.getElementById(id);
  if (el) el.setAttribute(attr, val);
}

function setBar(id, pct) {
  if (pct === undefined || pct === null) return;
  const el = document.getElementById(id);
  if (el) el.style.width = pct + '%';
}

document.addEventListener('DOMContentLoaded', () => {
  const userState = loadUserState() || {};

  // 1. Home Cockpit live progression
  renderCockpitProgress(userState);

  // 2. Syllabus page card state updates
  renderSyllabusCompletions(userState);

  // 3. Daily lab page completion button
  setupLabCompletionBtn();

  // 4. Lab History dashboard
  renderHistoryPage(userState);

  // 5. Roadmap telemetry sidebar
  renderRoadmapTelemetry(userState);

  // 6. 1-Click Code Copy toolbars
  setupCodeCopyButtons();

  // 7. Interactive Deliverables Checklists
  setupInteractiveChecklists();

  // 8. Interactive Systems HUD Simulators
  setupHudSimulators();

  // 9. Tech Stack Layer Filter Bar
  setupStackFilter();

  // 10. Master Roadmap 10-Month Slide Deck
  setupRoadmapSlideDeck();

  // 11. Spotlight Instant Fuzzy Search
  initSearch();
  setupSearchEventListeners();

  // 12. Reading progress bar on scroll
  setupReadingProgressBar();

  // 13. Global keyboard shortcuts & help modal
  setupGlobalKeyboardShortcuts();

  // 14. Interactive HUD Tabs
  setupHudTabs();

  // 15. GitHub Style Callout Alert Boxes
  setupCalloutBoxes();

  // 16. PWA Offline Service Worker Registration
  registerServiceWorker();
});

function isLabDone(lab, userState) {
  if (!userState) return false;
  const rawList = userState.completedLabs || [];
  const sessions = userState.sessions || [];

  const extractSlug = (str) => {
    if (!str) return '';
    const clean = str.split('?')[0].split('#')[0];
    const parts = clean.split('/').filter(Boolean);
    return parts[parts.length - 1] || '';
  };

  const labSlug = extractSlug(lab.url || lab.path || '');
  const labDayNum = parseInt(lab.day, 10);
  const labTitleStr = (lab.title || '').trim().toLowerCase();

  // 1. Direct path / slug matching in completedLabs
  for (const raw of rawList) {
    if (!raw) continue;
    const rawSlug = extractSlug(raw);
    if (labSlug && rawSlug && labSlug === rawSlug) return true;
    if (normalizeUrl(raw) === normalizeUrl(lab.url) || normalizeUrl(raw) === normalizeUrl(lab.path)) return true;
    if (labSlug && raw.includes(labSlug)) return true;
  }

  // 2. Matching in sessions
  for (const s of sessions) {
    if (!s) continue;
    const sSlug = extractSlug(s.url || '');
    if (labSlug && sSlug && labSlug === sSlug) return true;
    if (normalizeUrl(s.url) === normalizeUrl(lab.url) || normalizeUrl(s.url) === normalizeUrl(lab.path)) return true;

    // Numeric Day matching ("01" === 1, "02" === 2)
    const sDayNum = parseInt(s.day, 10);
    if (!isNaN(labDayNum) && !isNaN(sDayNum) && labDayNum === sDayNum) return true;

    // Title matching
    if (s.title && s.title.trim().toLowerCase() === labTitleStr) return true;
  }

  return false;
}

function renderCockpitProgress(userState) {
  const stage = document.getElementById('workbenchStage');
  if (!stage) return;

  const totalDays = parseInt(stage.dataset.totalDays || '3', 10);
  const rawList = userState.completedLabs || [];

  // 1. Read embedded sprint labs catalog
  let sprintLabs = [];
  const scriptEl = document.getElementById('sprintLabsData');
  if (scriptEl) {
    try {
      sprintLabs = JSON.parse(scriptEl.textContent);
    } catch (e) {
      console.warn('Could not parse sprintLabsData:', e);
    }
  }

  // Count how many sprint labs are completed
  let sprintCompletedCount = 0;
  let nextLab = null;

  sprintLabs.forEach(lab => {
    const isDone = isLabDone(lab, userState);
    if (isDone) {
      sprintCompletedCount++;
    } else if (!nextLab) {
      nextLab = lab;
    }
  });

  let totalHoursSum = 0;
  (userState.sessions || []).forEach(s => {
    totalHoursSum += parseFloat(s.hours || 2.5);
  });
  if (totalHoursSum === 0 && rawList.length > 0) {
    totalHoursSum = rawList.length * 2.5;
  }

  const totalCompleted = Math.max(rawList.length, (userState.sessions || []).length, sprintCompletedCount);
  const totalHours = totalHoursSum.toFixed(1);
  const sprintPct = totalDays > 0 ? ((sprintCompletedCount / totalDays) * 100).toFixed(1) : '0.0';
  const completedMonths = totalDays > 0 && sprintCompletedCount >= totalDays ? 1 : 0;
  const roadmapPct = ((completedMonths / 24) * 100).toFixed(1);

  // 2. Update Box 1 (Roadmap Progress: 24 Months Overall Program)
  setVal('curric-pct', `${roadmapPct}%`);
  setBar('curric-bar', parseFloat(roadmapPct));

  // 3. Update Box 2 (Active Mission Progression)
  if (nextLab) {
    // There is an upcoming uncompleted lab
    setVal('sprint-badge', `TODAY'S LAB`);
    setVal('sprint-phase', `EST. ${nextLab.hours || 2.5} HOURS`);
    setVal('sprint-title', nextLab.title);
    setAttr('sprint-title', 'title', nextLab.title);
    setVal('sprint-desc', nextLab.desc);
    setAttr('sprint-desc', 'title', nextLab.desc);
    setVal('sprint-pct-text', `${sprintCompletedCount} OF ${pad(totalDays)} LABS COMPLETED (${sprintPct}%)`);
    setBar('sprint-bar', parseFloat(sprintPct));

    const btnTextEl = document.getElementById('sprint-btn-text');
    if (btnTextEl) btnTextEl.textContent = `START LAB ${pad(nextLab.day)}`;

    setAttr('sprint-btn-link', 'href', nextLab.url);
    setVal('sprint-status', sprintCompletedCount > 0 ? 'STATUS: IN PROGRESS' : 'STATUS: NOT STARTED');
  } else if (sprintLabs.length > 0 && sprintCompletedCount === sprintLabs.length) {
    // All labs in the sprint completed!
    setVal('sprint-badge', `SPRINT COMPLETED`);
    setVal('sprint-phase', `COMPLETED`);
    setVal('sprint-title', `August 2026: Linux Networking Completed`);
    setVal('sprint-desc', `All ${totalDays} labs completed (+${totalHours} Hours). Ready to proceed to September 2026 (Linux & eBPF).`);
    setVal('sprint-pct-text', `${pad(totalDays)} OF ${pad(totalDays)} LABS COMPLETED (100%)`);
    setBar('sprint-bar', 100);

    const btnTextEl = document.getElementById('sprint-btn-text');
    if (btnTextEl) btnTextEl.textContent = `ADVANCE TO SEPTEMBER →`;
    setAttr('sprint-btn-link', 'href', getAppUrl('2026/september/'));
    setVal('sprint-status', 'STATUS: COMPLETED');
  }

  // 4. Update Box 4 (Lifetime Totals)
  const totalHoursEl = document.getElementById('cockpitTotalHours');
  if (totalHoursEl) {
    totalHoursEl.textContent = `${totalHours} HOURS`;
    if (totalCompleted > 0) totalHoursEl.classList.remove('text-dim');
  }

  const totalLabsEl = document.getElementById('cockpitTotalLabs');
  if (totalLabsEl) {
    totalLabsEl.textContent = `${totalCompleted} LAB${totalCompleted === 1 ? '' : 'S'}`;
    if (totalCompleted > 0) totalLabsEl.classList.remove('text-dim');
  }

  const totalMonthsEl = document.getElementById('cockpitTotalMonths');
  if (totalMonthsEl) {
    const completedMonths = totalCompleted >= totalDays ? 1 : 0;
    totalMonthsEl.textContent = `${completedMonths} / 24 MONTHS`;
    if (completedMonths > 0) totalMonthsEl.classList.remove('text-dim');
  }

  // 5. Update Box 3 Home: LABS COMPLETED this sprint
  const labsDoneEl = document.getElementById('month-labs-done');
  if (labsDoneEl) {
    labsDoneEl.textContent = `${sprintCompletedCount} / ${totalDays}`;
    if (sprintCompletedCount > 0) labsDoneEl.classList.remove('text-dim');
  }

  // 6. Update Syllabus Box 4: LABS REMAINING & GATEWAY STATUS
  const labsLeftEl = document.getElementById('sylLabsLeft');
  if (labsLeftEl) {
    const remaining = Math.max(0, totalDays - sprintCompletedCount);
    labsLeftEl.textContent = `${remaining} LABS`;
    if (remaining < totalDays) labsLeftEl.classList.remove('text-dim');
  }

  const gatewayStatusEl = document.getElementById('gateway-status');
  if (gatewayStatusEl) {
    if (sprintCompletedCount >= totalDays && totalDays > 0) {
      gatewayStatusEl.textContent = 'READY TO BUILD';
      gatewayStatusEl.classList.remove('text-dim');
    } else if (sprintCompletedCount > 0) {
      gatewayStatusEl.textContent = 'IN PROGRESS';
      gatewayStatusEl.classList.remove('text-dim');
    } else {
      gatewayStatusEl.textContent = 'NOT STARTED';
      gatewayStatusEl.classList.add('text-dim');
    }
  }
}

function renderSyllabusCompletions(userState) {
  const rows = Array.from(document.querySelectorAll('.minimal-rows-list .minimal-row'));
  if (!rows.length) return;

  let firstIncompleteLab = null;
  let doneCount = 0;

  rows.forEach((row, idx) => {
    const href = row.getAttribute('href') || '';
    const titleEl = row.querySelector('.mr-title');
    const rowTitle = titleEl ? titleEl.textContent.trim() : '';
    const dayIndex = row.dataset.dayIndex || String(idx + 1);

    const mockLab = {
      url: href,
      path: href,
      day: dayIndex,
      title: rowTitle
    };

    const isDone = isLabDone(mockLab, userState);
    const statusEl = row.querySelector('.mr-status');

    row.classList.remove('minimal-row-active', 'minimal-row-queued', 'minimal-row-done');

    if (isDone) {
      doneCount++;
      row.classList.add('minimal-row-done');
      if (statusEl) {
        statusEl.textContent = 'DONE';
        statusEl.classList.remove('mr-status-active');
      }
    } else if (!firstIncompleteLab) {
      row.classList.add('minimal-row-active');
      if (statusEl) {
        statusEl.textContent = 'START';
        statusEl.classList.add('mr-status-active');
      }
      firstIncompleteLab = {
        url: href,
        day: dayIndex,
        title: rowTitle,
        desc: row.getAttribute('title') || ''
      };
    } else {
      row.classList.add('minimal-row-queued');
      if (statusEl) {
        statusEl.textContent = 'OPEN';
        statusEl.classList.remove('mr-status-active');
      }
    }
  });

  const progressPill = document.getElementById('sprint-progress-pill');
  if (progressPill) {
    const pct = ((doneCount / rows.length) * 100).toFixed(1);
    progressPill.textContent = `${pct}% COMPLETED`;
  }

  const fillBar = document.getElementById('curric-bar');
  if (fillBar) {
    const pct = ((doneCount / rows.length) * 100).toFixed(1);
    fillBar.style.width = `${pct}%`;
  }

  // Update Box 2 (Center Slide Footer) Status Tag & Action CTA Button
  const sprintStatusEl = document.getElementById('sprint-status');
  if (sprintStatusEl) {
    if (doneCount >= rows.length && rows.length > 0) {
      sprintStatusEl.textContent = 'STATUS: COMPLETED';
    } else if (doneCount > 0) {
      sprintStatusEl.textContent = 'STATUS: IN PROGRESS';
    } else {
      sprintStatusEl.textContent = 'STATUS: NOT STARTED';
    }
  }

  const btnTextEl = document.getElementById('sprint-btn-text');
  const btnLinkEl = document.getElementById('sprint-btn-link');
  const sylBtnLinkEl = document.getElementById('syl-btn-link');
  const sylPreviewTitleEl = document.getElementById('syl-preview-title');
  const sylPreviewDescEl = document.getElementById('syl-preview-desc');
  const sylPreviewDurationEl = document.getElementById('syl-preview-duration');

  if (firstIncompleteLab) {
    if (btnTextEl) btnTextEl.textContent = `START LAB ${pad(firstIncompleteLab.day)}`;
    if (btnLinkEl) btnLinkEl.setAttribute('href', firstIncompleteLab.url);
    if (sylBtnLinkEl) sylBtnLinkEl.setAttribute('href', firstIncompleteLab.url);
    if (sylPreviewTitleEl) sylPreviewTitleEl.textContent = firstIncompleteLab.title.split(': ').pop();
    if (sylPreviewDescEl) sylPreviewDescEl.textContent = firstIncompleteLab.desc.split(' — ').pop() || firstIncompleteLab.desc;
  } else if (doneCount >= rows.length && rows.length > 0) {
    if (btnTextEl) btnTextEl.textContent = `MONTH COMPLETED [✓]`;
    if (btnLinkEl) btnLinkEl.setAttribute('href', rows[0].getAttribute('href') || '#');
    if (sylBtnLinkEl) sylBtnLinkEl.setAttribute('href', rows[0].getAttribute('href') || '#');
    if (sylPreviewTitleEl) sylPreviewTitleEl.textContent = `ALL LABS COMPLETED`;
    if (sylPreviewDurationEl) sylPreviewDurationEl.textContent = `VERIFIED`;
    if (sylPreviewDescEl) sylPreviewDescEl.textContent = `All August 2026 labs completed. Production artifact ready.`;
  }

  // Update Syllabus Box 4 (HISTORY) directly from verified row count
  const gatewayStatusEl = document.getElementById('gateway-status');
  if (gatewayStatusEl) {
    if (doneCount >= rows.length && rows.length > 0) {
      gatewayStatusEl.textContent = 'READY TO BUILD';
      gatewayStatusEl.classList.remove('text-dim');
    } else if (doneCount > 0) {
      gatewayStatusEl.textContent = 'IN PROGRESS';
      gatewayStatusEl.classList.remove('text-dim');
    } else {
      gatewayStatusEl.textContent = 'NOT STARTED';
      gatewayStatusEl.classList.add('text-dim');
    }
  }

  const labsLeftEl = document.getElementById('sylLabsLeft');
  if (labsLeftEl) {
    const remaining = Math.max(0, rows.length - doneCount);
    labsLeftEl.textContent = `${remaining} LABS`;
    if (remaining < rows.length) labsLeftEl.classList.remove('text-dim');
  }

  // Update Syllabus Box 4 (HOURS LOGGED) from userState
  const totalHoursEl = document.getElementById('cockpitTotalHours');
  if (totalHoursEl) {
    let totalHoursSum = 0;
    (userState.sessions || []).forEach(s => {
      totalHoursSum += parseFloat(s.hours || 2.5);
    });
    if (totalHoursSum === 0 && (userState.completedLabs || []).length > 0) {
      totalHoursSum = (userState.completedLabs || []).length * 2.5;
    }
    totalHoursEl.textContent = `${totalHoursSum.toFixed(1)} HOURS`;
    if (totalHoursSum > 0) totalHoursEl.classList.remove('text-dim');
  }
}

function setupLabCompletionBtn() {
  const btn = document.getElementById('btnMarkComplete');
  if (!btn) return;

  const labTitle = btn.dataset.title || document.title.split('·')[0].trim();
  const labDay = btn.dataset.day || '1';
  const labHours = btn.dataset.hours || '2.5';
  const currentPath = normalizeUrl(window.location.pathname);

  const currentMockLab = {
    url: window.location.pathname,
    path: window.location.pathname,
    day: labDay,
    title: labTitle
  };

  function refreshButtonState() {
    const userState = loadUserState() || {};
    const isCompleted = isLabDone(currentMockLab, userState);
    if (isCompleted) {
      markBtnAsDone(btn);
    } else {
      resetBtn(btn);
    }
  }

  refreshButtonState();

  btn.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();

    const userState = loadUserState() || {};
    let rawList = Array.isArray(userState.completedLabs) ? [...userState.completedLabs] : [];
    let sessions = Array.isArray(userState.sessions) ? [...userState.sessions] : [];

    const isCurrentlyDone = isLabDone(currentMockLab, userState) || btn.classList.contains('completed');

    if (!isCurrentlyDone) {
      // Mark as completed
      if (!rawList.some(p => normalizeUrl(p) === currentPath || p.includes(`day-${pad(labDay)}`))) {
        rawList.push(window.location.pathname);
      }
      if (!sessions.some(s => normalizeUrl(s.url) === currentPath || String(s.day) === String(labDay))) {
        sessions.push({
          url: window.location.pathname,
          title: labTitle,
          day: labDay,
          hours: labHours,
          completedAt: new Date().toISOString()
        });
      }
      markBtnAsDone(btn);
    } else {
      // Toggle off / reset
      rawList = rawList.filter(p => normalizeUrl(p) !== currentPath && !p.includes(`day-${pad(labDay)}`));
      sessions = sessions.filter(s => normalizeUrl(s.url) !== currentPath && String(s.day) !== String(labDay));
      resetBtn(btn);
    }

    let totalHoursSum = 0;
    sessions.forEach(s => {
      totalHoursSum += parseFloat(s.hours || 2.5);
    });
    if (totalHoursSum === 0 && rawList.length > 0) {
      totalHoursSum = rawList.length * 2.5;
    }

    const newState = {
      completedLabs: rawList,
      sessions: sessions,
      totalHours: totalHoursSum.toFixed(1)
    };

    saveUserState(newState);
  });
}

function renderHistoryPage(userState) {
  const listEl = document.getElementById('historyLogList');
  if (!listEl) return;

  const rawList = userState.completedLabs || [];
  const sessions = userState.sessions || [];
  const count = Math.max(rawList.length, sessions.length);

  let totalHoursSum = 0;
  sessions.forEach(s => { totalHoursSum += parseFloat(s.hours || 2.5); });
  if (totalHoursSum === 0 && count > 0) {
    totalHoursSum = count * 2.5;
  }
  const totalHours = totalHoursSum.toFixed(1);
  const avgHours = count > 0 ? (totalHoursSum / count).toFixed(1) : '0.0';

  const totalDays = parseInt(document.querySelector('[data-total-days]')?.dataset?.totalDays || '3', 10);
  const sprintPct = totalDays > 0 ? ((count / totalDays) * 100).toFixed(1) : '0.0';
  const labsLeft = Math.max(0, totalDays - count);

  // Box 1 (Left panel) stat units
  const hoursEl = document.getElementById('histTotalHours');
  const sessionsEl = document.getElementById('histTotalSessions');
  if (hoursEl) { hoursEl.textContent = `${totalHours} HOURS`; if (count > 0) hoursEl.classList.remove('text-dim'); }
  if (sessionsEl) { sessionsEl.textContent = `${count} LABS`; if (count > 0) sessionsEl.classList.remove('text-dim'); }

  // Box 2 (Center) footer progress label
  setVal('histSprintProgress', `${sprintPct}% MONTH PROGRESS`);

  // Box 3 (Right-1) sprint stats
  setVal('histSprintPct', `${sprintPct}%`);
  const gwBar = document.getElementById('curric-bar');
  if (gwBar) gwBar.style.width = `${sprintPct}%`;

  const gw = document.getElementById('histGateway');
  const gwFooter = document.getElementById('histGatewayFooter');
  if (gw) {
    if (count >= totalDays && totalDays > 0) {
      gw.textContent = 'READY TO BUILD';
      gw.classList.remove('text-dim');
      if (gwFooter) gwFooter.textContent = 'READY TO BUILD';
    } else if (count > 0) {
      gw.textContent = `IN PROGRESS (${count}/${totalDays})`;
      gw.classList.remove('text-dim');
      if (gwFooter) gwFooter.textContent = `${labsLeft} LABS REMAINING`;
    } else {
      gw.textContent = 'NOT STARTED';
      gw.classList.add('text-dim');
      if (gwFooter) gwFooter.textContent = `${totalDays} LABS REMAINING`;
    }
  }

  // Center panel: session list
  if (count === 0) {
    listEl.innerHTML = `
      <div class="history-empty-state">
        <span class="empty-state-label">NO COMPLETED LABS RECORDED</span>
        <span class="empty-state-desc">Mark your daily labs complete to log hours and save your progress here.</span>
      </div>
    `;
    return;
  }

  listEl.innerHTML = '';
  const entries = sessions.length > 0 ? sessions : rawList.map((url, idx) => ({ url, day: idx + 1, hours: 2.5 }));

  entries.forEach((session, idx) => {
    const url = session.url || rawList[idx] || '#';
    const title = session.title || deriveTitleFromUrl(url);
    const day = session.day || (idx + 1);
    const hours = session.hours || '2.5';

    const safeUrl = escapeAttr(url);
    const safeTitle = escapeHtml(title);
    const safeDay = escapeHtml(pad(day));
    const safeHours = escapeHtml(hours);

    const row = document.createElement('a');
    row.href = url;
    row.className = 'minimal-row minimal-row-done';
    row.title = `${title} — Lab ${pad(day)} (+${hours}h)`;
    row.innerHTML = `
      <div class="mr-left">
        <span class="mr-day">LAB ${safeDay}</span>
        <span class="mr-title" title="${safeTitle}">${safeTitle}</span>
      </div>
      <div class="mr-right">
        <span class="mr-hours">+${safeHours}h</span>
        <span class="mr-status">COMPLETED</span>
      </div>
    `;
    listEl.appendChild(row);
  });
}

function deriveTitleFromUrl(url) {
  const parts = url.split('/').filter(Boolean);
  const slug = parts[parts.length - 1] || 'daily-lab';
  return slug.replace(/^day-\d+-/, '').replace(/-/g, ' ').toUpperCase();
}

function renderRoadmapTelemetry(userState) {
  // Only runs when the roadmap page elements are present
  if (!document.getElementById('rmTotalHours') && !document.getElementById('rmModulesDone') && !document.getElementById('rmLabsDone')) return;

  const sessions = userState.sessions || [];
  const rawList = userState.completedLabs || [];
  const count = Math.max(rawList.length, sessions.length);

  let totalHours = 0;
  sessions.forEach(s => { totalHours += parseFloat(s.hours || 2.5); });
  if (totalHours === 0 && count > 0) {
    totalHours = count * 2.5;
  }

  const completedMonthsCount = Math.floor(count / 3);

  // Automatically update all month rows in Roadmap view and Master Modal
  const monthRows = Array.from(document.querySelectorAll('.minimal-rows-list .minimal-row[href*="/2026/"], .cm-year-section .minimal-row'));
  monthRows.forEach((row, idx) => {
    const statusEl = row.querySelector('.mr-status');
    row.classList.remove('minimal-row-active', 'minimal-row-done', 'minimal-row-queued');
    if (statusEl) statusEl.classList.remove('mr-status-active');

    if (idx < completedMonthsCount) {
      row.classList.add('minimal-row-done');
      if (statusEl) statusEl.textContent = 'DONE';
    } else if (idx === completedMonthsCount) {
      row.classList.add('minimal-row-active');
      if (statusEl) {
        statusEl.textContent = 'ACTIVE';
        statusEl.classList.add('mr-status-active');
      }
    } else {
      row.classList.add('minimal-row-queued');
      if (statusEl) statusEl.textContent = 'QUEUED';
    }
  });

  const hoursEl = document.getElementById('rmTotalHours');
  const sessionsEl = document.getElementById('rmTotalSessions');
  const doneEl = document.getElementById('rmModulesDone');

  if (hoursEl) { hoursEl.textContent = `${totalHours.toFixed(1)} HOURS`; if (count > 0) hoursEl.classList.remove('text-dim'); }
  if (sessionsEl) { sessionsEl.textContent = `${count} LABS`; if (count > 0) sessionsEl.classList.remove('text-dim'); }
  if (doneEl) { doneEl.textContent = `${completedMonthsCount} / 24`; if (completedMonthsCount > 0) doneEl.classList.remove('text-dim'); }
}

function markBtnAsDone(btn) {
  btn.classList.add('completed');
  const textEl = btn.querySelector('.btn-complete-text');
  if (textEl) textEl.textContent = `LAB COMPLETED [✓]`;
}

function resetBtn(btn) {
  btn.classList.remove('completed');
  const textEl = btn.querySelector('.btn-complete-text');
  if (textEl) textEl.textContent = `MARK LAB COMPLETE`;
}

/* ── 1-CLICK CODE COPY ENGINE (UNIVERSAL CLIPBOARD HELPER) ────────────────── */
async function copyToClipboard(text) {
  if (!text) return false;

  // 1. Try modern Async Clipboard API (for HTTPS & localhost)
  if (navigator.clipboard && (window.isSecureContext || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch (e) {
      console.warn('[Clipboard] Async API blocked, trying fallback textarea:', e);
    }
  }

  // 2. Fallback for non-HTTPS / LAN IP addresses (e.g. 192.168.1.8)
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.top = '-9999px';
    textArea.style.left = '-9999px';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('[Clipboard] Fallback execCommand copy failed:', err);
    return false;
  }
}

function setupCodeCopyButtons() {
  const codeBlocks = document.querySelectorAll('pre');
  codeBlocks.forEach(pre => {
    if (pre.querySelector('.code-toolbar') || pre.classList.contains('mech-cmd-code')) return;

    const code = pre.querySelector('code');
    const langMatch = (code ? code.className : '').match(/language-([a-zA-Z0-9_\-]+)/);
    let lang = langMatch ? langMatch[1].toUpperCase() : 'CODE';

    const rawText = code ? code.innerText : pre.innerText;
    const isUntypedOrText = lang === 'CODE' || lang === 'ASCII' || lang === 'DIAGRAM' || lang === 'TEXT';
    const isAsciiDiagram = (isUntypedOrText && /[┌└┐┘├┤┬┴┼═║╔╗╚╝╠╣╦╩╬]/.test(rawText)) || lang === 'ASCII' || lang === 'DIAGRAM';

    if (isAsciiDiagram) {
      lang = 'ARCHITECTURE DIAGRAM';
      pre.classList.add('ascii-art-block');
    }

    const toolbar = document.createElement('div');
    toolbar.className = 'code-toolbar';

    const badge = document.createElement('span');
    badge.className = 'code-lang-badge' + (isAsciiDiagram ? ' is-diagram' : '');
    badge.textContent = lang;

    const copyBtn = document.createElement('button');
    copyBtn.className = 'code-copy-btn';
    copyBtn.innerHTML = `<span>COPY</span>`;

    copyBtn.addEventListener('click', async () => {
      const text = code ? code.innerText : pre.innerText;
      const ok = await copyToClipboard(text);
      if (ok) {
        copyBtn.innerHTML = `<span>COPIED</span>`;
        copyBtn.classList.add('copied');
        setTimeout(() => {
          copyBtn.innerHTML = `<span>COPY</span>`;
          copyBtn.classList.remove('copied');
        }, 1500);
      }
    });

    toolbar.appendChild(badge);
    toolbar.appendChild(copyBtn);
    pre.prepend(toolbar);
  });
}

/* ── INTERACTIVE DELIVERABLES CHECKLIST ENGINE ──────────────────────────── */
function setupInteractiveChecklists() {
  const listItems = Array.from(document.querySelectorAll('.lab-body li'));
  const checklistItems = listItems.filter(li => {
    // Only target actual checklist leaf items, not parent list containers
    const directInput = li.querySelector(':scope > input[type="checkbox"]');
    if (directInput) return true;
    if (!li.querySelector('ul, ol')) {
      const txt = li.textContent.trim();
      return txt.startsWith('[ ]') || txt.startsWith('[x]') || txt.startsWith('[X]');
    }
    return false;
  });

  if (!checklistItems.length) return;

  const currentPath = normalizeUrl(window.location.pathname);
  const storageKey = `deliverables_${currentPath}`;
  let savedState = {};
  try {
    savedState = JSON.parse(localStorage.getItem(storageKey) || '{}');
  } catch (e) {
    savedState = {};
  }

  // Remove default bullet indentations from parent <ul>
  checklistItems.forEach(li => {
    const parentUl = li.closest('ul');
    if (parentUl) {
      parentUl.classList.add('deliverable-list');
      parentUl.style.listStyle = 'none';
      parentUl.style.paddingLeft = '0';
      parentUl.style.marginLeft = '0';
    }
  });

  checklistItems.forEach((li, idx) => {
    li.classList.add('deliverable-item');

    // Find and remove existing input
    const oldInput = li.querySelector(':scope > input[type="checkbox"]') || li.querySelector('input[type="checkbox"]');
    const isInitiallyChecked = oldInput ? (oldInput.hasAttribute('checked') || oldInput.checked) : false;
    if (oldInput) oldInput.remove();

    // Clean text and build custom elements
    const innerHtml = li.innerHTML.trim().replace(/^\[[ xX]\]\s*/, '');
    li.innerHTML = `
      <span class="deliverable-box" aria-hidden="true"></span>
      <div class="deliverable-text">${innerHtml}</div>
    `;

    // Restore state
    const isChecked = savedState[idx] !== undefined ? !!savedState[idx] : isInitiallyChecked;
    if (isChecked) {
      li.classList.add('checked');
    }

    // Click handler on entire row
    li.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const nowChecked = li.classList.toggle('checked');
      savedState[idx] = nowChecked;
      try {
        localStorage.setItem(storageKey, JSON.stringify(savedState));
      } catch (err) {}
      updateCompletionGate();
    });
  });

  function updateCompletionGate() {
    const allChecked = checklistItems.length > 0 && checklistItems.every(li => li.classList.contains('checked'));
    const completeBtn = document.getElementById('btnMarkComplete');
    if (completeBtn) {
      completeBtn.classList.toggle('ready-glow', allChecked && !completeBtn.classList.contains('completed'));
    }
  }

  updateCompletionGate();
}

/* ── HUD TECHNICAL SYSTEMS SIMULATOR ENGINE ──────────────────────────────── */
function setupHudSimulators() {
  const simBlocks = document.querySelectorAll('.hud-simulator, .hud-simulator-data');
  if (!simBlocks.length) return;

  simBlocks.forEach((sim, simIndex) => {
    const title = sim.dataset.title || 'Technical Systems Architecture Simulator';
    const rawText = sim.textContent.trim();
    const steps = parseHudSteps(rawText);
    if (!steps.length) return;

    sim.style.display = 'none';

    // Create inline interactive HUD card
    const card = document.createElement('div');
    card.className = 'hud-inline-card';
    const cardId = `hudInline_${simIndex}`;
    card.id = cardId;
    card.innerHTML = `
      <div class="hud-inline-header">
        <div class="hud-inline-title-wrap">
          <span class="hud-inline-badge">INTERACTIVE SYSTEMS SIMULATOR</span>
          <h3 class="hud-inline-title">${title}</h3>
        </div>
      </div>

      <div class="mech-progress-track">
        <div class="mech-progress-fill" id="${cardId}_fill" style="width: ${(1 / steps.length) * 100}%"></div>
      </div>

      <div class="hud-inline-body" id="${cardId}_body"></div>

      <div class="hud-inline-footer">
        <span class="mech-step-counter" id="${cardId}_counter">PHASE 1 OF ${steps.length}</span>
        <div class="mech-nav-actions">
          <button class="mech-nav-btn" id="${cardId}_prev" disabled>◄ PREV</button>
          <button class="mech-nav-btn mech-nav-btn-primary" id="${cardId}_next">NEXT ►</button>
        </div>
      </div>
    `;

    sim.parentNode.insertBefore(card, sim);

    let activeStep = 0;

    function renderInlineStep(idx) {
      activeStep = idx;
      const step = steps[idx];
      const bodyEl = document.getElementById(`${cardId}_body`);

      // Build Nodes Grid
      let nodesHtml = '';
      if (step.nodes && step.nodes.length) {
        nodesHtml = `
          <div class="hud-nodes-grid">
            ${step.nodes.map(n => {
              const s = n.state;
              const isRogue = /conflict|severed|damaged|shortage|stress|rogue|faulted|red/i.test(s);
              const isFlap = /flap|unwound|tightened|warning|resilver|yellow|amber/i.test(s);
              const isOff = /offline|sub-critical|inert|off/i.test(s);

              let ledClass = 'hud-led-online';
              let ledText = n.state.toUpperCase();
              if (isRogue) { ledClass = 'hud-led-rogue'; }
              else if (isFlap) { ledClass = 'hud-led-flap'; }
              else if (isOff) { ledClass = 'hud-led-off'; }

              return `
                <div class="hud-node-card ${isRogue ? 'hud-node-conflict' : ''} ${isFlap ? 'hud-node-flapping' : ''}">
                  <div class="hud-node-header">
                    <span class="hud-node-name">${n.name}</span>
                    <span class="hud-node-led ${ledClass}">${ledText}</span>
                  </div>
                  <div class="hud-node-specs">
                    ${n.specs.map(sp => `
                      <div class="hud-spec-row">
                        <span class="hud-spec-key">${sp.key}:</span>
                        <span class="hud-spec-val ${isRogue ? 'text-warn' : ''}">${sp.val}</span>
                      </div>
                    `).join('')}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        `;
      }

      // Build Conduit & Target Switch/Engine
      let targetHtml = '';
      if (step.target) {
        const isConflict = /conflict|flap|damaged|stress|thrashing|unavail/i.test(step.target.state);
        const rawConduit = step.conduit ? step.conduit.label : '';
        const conduitLabel = rawConduit.replace(/(──►|-->|->|=>|⟶|→|──>)/g, '<span class="hud-conduit-arrow">➔</span>');

        targetHtml = `
          <div class="hud-conduit-wrap">
            <div class="hud-signal-line ${isConflict ? 'hud-signal-conflict' : ''}">
              <span class="hud-signal-pulse"></span>
            </div>
            ${conduitLabel ? `<div class="hud-conduit-badge">${conduitLabel}</div>` : ''}
          </div>

          <div class="hud-target-card ${isConflict ? 'hud-target-warning' : ''}">
            <div class="hud-target-header">
              <div class="hud-target-title-wrap">
                <span class="hud-target-name">${step.target.name}</span>
              </div>
              <span class="hud-target-status ${isConflict ? 'text-warn' : ''}">
                STATE: ${step.target.state.toUpperCase()}
              </span>
            </div>
            ${step.target.table ? `
              <div class="hud-target-table">
                <span class="hud-table-label">MATRIX STATE / LEDGER:</span>
                <span class="hud-table-val">${step.target.table}</span>
              </div>
            ` : ''}
          </div>
        `;
      }

      // Verification Blocks (cmd, verify, or formula)
      let actionBlock = '';
      if (step.cmd) {
        actionBlock = `
          <div class="mech-cmd-box">
            <div class="mech-cmd-label">VERIFY IN YOUR TERMINAL</div>
            <div class="mech-cmd-row">
              <pre class="mech-cmd-code"><code>${step.cmd}</code></pre>
              <button class="mech-cmd-copy" id="${cardId}_copy">COPY</button>
            </div>
          </div>
        `;
      } else if (step.verify) {
        actionBlock = `
          <div class="mech-cmd-box mech-verify-box">
            <div class="mech-cmd-label">SCIENTIFIC OBSERVATION & LAB ASSAY</div>
            <div class="mech-verify-row">
              <span class="mech-verify-text">${step.verify}</span>
            </div>
          </div>
        `;
      } else if (step.formula) {
        actionBlock = `
          <div class="mech-cmd-box mech-formula-box">
            <div class="mech-cmd-label">GOVERNING MATHEMATICAL EQUATION</div>
            <div class="mech-cmd-row">
              <pre class="mech-cmd-code"><code>${step.formula}</code></pre>
              <button class="mech-cmd-copy" id="${cardId}_copy">COPY</button>
            </div>
          </div>
        `;
      }

      bodyEl.innerHTML = `
        <div class="hud-phase-header">
          <span class="mech-step-num">PHASE ${pad(idx + 1)}</span>
          <h4 class="mech-step-label">${step.label}</h4>
        </div>

        <div class="hud-canvas-stage">
          ${nodesHtml}
          ${targetHtml}
        </div>

        <div class="hud-explanation-box">
          <p class="hud-explanation-text">${step.desc}</p>
        </div>

        ${actionBlock}
      `;

      const copyBtn = document.getElementById(`${cardId}_copy`);
      if (copyBtn && (step.cmd || step.formula)) {
        copyBtn.addEventListener('click', async () => {
          const textToCopy = step.cmd || step.formula;
          const ok = await copyToClipboard(textToCopy.trim());
          if (ok) {
            copyBtn.textContent = 'COPIED';
            copyBtn.classList.add('copied');
            setTimeout(() => {
              copyBtn.textContent = 'COPY';
              copyBtn.classList.remove('copied');
            }, 1500);
          }
        });
      }

      document.getElementById(`${cardId}_counter`).textContent = `PHASE ${idx + 1} OF ${steps.length}`;
      document.getElementById(`${cardId}_fill`).style.width = `${((idx + 1) / steps.length) * 100}%`;
      document.getElementById(`${cardId}_prev`).disabled = idx === 0;

      const nextBtn = document.getElementById(`${cardId}_next`);
      if (idx === steps.length - 1) {
        nextBtn.textContent = 'RESTART ↺';
      } else {
        nextBtn.textContent = 'NEXT ►';
      }
    }

    renderInlineStep(0);

    document.getElementById(`${cardId}_prev`).addEventListener('click', () => {
      if (activeStep > 0) renderInlineStep(activeStep - 1);
    });

    document.getElementById(`${cardId}_next`).addEventListener('click', () => {
      if (activeStep < steps.length - 1) {
        renderInlineStep(activeStep + 1);
      } else {
        renderInlineStep(0);
      }
    });
  });
}

function parseHudSteps(raw) {
  const matches = [...raw.matchAll(/\[step\s+\d+:\s*([^\]]+)\]([\s\S]*?)(?=\[step\s+\d+:|$)/gi)];
  return matches.map(m => {
    const label = m[1].trim();
    const body = m[2].trim();
    const nodes = [];
    let conduit = null;
    let target = null;
    let desc = '';
    let cmd = '';
    let verify = '';
    let formula = '';

    body.split('\n').forEach(line => {
      line = line.trim().replace(/^[-*•]\s*/, '');
      if (line.startsWith('node:')) {
        const parts = line.replace('node:', '').split('|').map(s => s.trim());
        const name = parts[0] || 'Entity';
        const specs = [];
        let state = 'online';

        for (let i = 1; i < parts.length; i++) {
          const seg = parts[i];
          if (seg.toLowerCase().startsWith('state:')) {
            state = seg.replace(/state:/i, '').trim().toLowerCase();
          } else if (seg.includes(':')) {
            const [k, ...v] = seg.split(':');
            specs.push({ key: k.trim().toUpperCase(), val: v.join(':').trim() });
          } else {
            specs.push({ key: 'METRIC', val: seg });
          }
        }
        nodes.push({ name, specs, state });
      } else if (line.startsWith('conduit:')) {
        const parts = line.replace('conduit:', '').split('|').map(s => s.trim());
        conduit = {
          label: parts[0] || 'INTERACTION CONDUIT',
          state: (parts[1] || '').replace('state:', '').trim().toLowerCase()
        };
      } else if (line.startsWith('target:')) {
        const parts = line.replace('target:', '').split('|').map(s => s.trim());
        const name = parts[0] || 'Core Environmental Matrix';
        let table = '';
        let state = 'normal';

        for (let i = 1; i < parts.length; i++) {
          const seg = parts[i];
          if (seg.toLowerCase().startsWith('state:')) {
            state = seg.replace(/state:/i, '').trim().toLowerCase();
          } else {
            table = seg;
          }
        }
        target = { name, table, state };
      } else if (line.startsWith('desc:')) {
        desc = line.replace('desc:', '').trim();
      } else if (line.startsWith('cmd:')) {
        cmd = line.replace('cmd:', '').trim();
      } else if (line.startsWith('verify:')) {
        verify = line.replace('verify:', '').trim();
      } else if (line.startsWith('formula:')) {
        formula = line.replace('formula:', '').trim();
      }
    });

    return { label, nodes, conduit, target, desc, cmd, verify, formula };
  });
}

/* ── 8.5 FULL 24-MONTH ROADMAP MODAL ENGINE ───────────────────────────── */
function openRoadmapModal() {
  const modal = document.getElementById('roadmapModal');
  if (modal) {
    modal.classList.add('cyber-modal-open');
    document.body.classList.add('modal-open');
  }
}

function closeRoadmapModal() {
  const modal = document.getElementById('roadmapModal');
  if (modal) {
    modal.classList.remove('cyber-modal-open');
    document.body.classList.remove('modal-open');
  }
}

function switchModalYear(year) {
  document.querySelectorAll('.cm-year-section').forEach(sec => {
    sec.style.display = 'none';
  });
  document.querySelectorAll('.cm-year-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  const targetSec = document.getElementById('modalYear' + year);
  const targetTab = document.getElementById('tabYear' + year);
  const select = document.getElementById('modalYearSelect');
  if (targetSec) targetSec.style.display = 'block';
  if (targetTab) {
    targetTab.classList.add('active');
    targetTab.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
  }
  if (select && select.value !== year) {
    select.value = year;
  }
}

/* ── 8.6 TECH STACK LAYER FILTER BAR ENGINE ─────────────────────────────── */
function setupStackFilter() {
  const filterBtns = document.querySelectorAll('[data-stack-filter]');
  const rows = document.querySelectorAll('[data-stack-row]');
  if (!filterBtns.length || !rows.length) return;

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.stackFilter;

      rows.forEach(row => {
        const layer = row.dataset.layer;
        if (filter === 'all' || layer === filter) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  });
}

/* ── 8.7 MASTER ROADMAP 10-MONTH SLIDE DECK ENGINE ─────────────────────── */
function setupRoadmapSlideDeck() {
  const slides = Array.from(document.querySelectorAll('.deck-slide'));
  const thumbs = Array.from(document.querySelectorAll('.mindmap-thumb'));
  const prevBtn = document.getElementById('slide-prev-btn');
  const nextBtn = document.getElementById('slide-next-btn');
  const indicator = document.getElementById('slide-indicator');

  if (!slides.length) return;

  let currentSlide = 0;

  function showSlide(index) {
    if (index < 0 || index >= slides.length) return;
    currentSlide = index;

    slides.forEach((slide, i) => {
      slide.style.display = i === currentSlide ? '' : 'none';
    });

    thumbs.forEach((thumb, i) => {
      thumb.classList.toggle('active', i === currentSlide);
    });

    if (indicator) {
      indicator.textContent = `Month ${pad(currentSlide + 1)} of ${pad(slides.length)}`;
    }

    if (prevBtn) prevBtn.disabled = currentSlide === 0;
    if (nextBtn) nextBtn.disabled = currentSlide === slides.length - 1;
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => showSlide(currentSlide - 1));
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => showSlide(currentSlide + 1));
  }

  thumbs.forEach((thumb, idx) => {
    thumb.addEventListener('click', () => showSlide(idx));
  });

  window.addEventListener('keydown', (e) => {
    const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
    if (activeTag === 'input' || activeTag === 'textarea') return;
    const modal = document.getElementById('searchModal');
    if (modal && modal.classList.contains('cyber-modal-open')) return;

    if (e.key === 'ArrowLeft') {
      showSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight') {
      showSlide(currentSlide + 1);
    }
  });

  showSlide(0);
}

/* ── 9. SPOTLIGHT INSTANT FUZZY SEARCH ENGINE ───────────────────────────── */
let searchIndex = [];
let activeResultIndex = -1;

function initSearch() {
  const indexEl = document.getElementById('searchIndexData');
  if (!indexEl) return;
  const rawData = indexEl.textContent.trim();
  parseSearchIndex(rawData);
}

function parseSearchIndex(rawData) {
  searchIndex = [];
  rawData.split('\n').forEach(line => {
    const parts = line.split('|').map(s => s.trim());
    if (parts.length >= 2 && parts[0] && parts[1]) {
      searchIndex.push({
        title: parts[0],
        url: parts[1],
        os: parts[2] || '2026',
        category: parts[3] || 'SYSTEMS',
        summary: parts[4] || '',
        commands: parts[5] || ''
      });
    }
  });
}

function executeSearch(query) {
  query = (query || '').trim();
  if (!query) return [];

  const qLower = query.toLowerCase();
  const terms = qLower.split(/\s+/).filter(Boolean);

  return searchIndex
    .map(item => {
      let score = 0;
      const titleLower = item.title.toLowerCase();
      const sumLower = item.summary.toLowerCase();
      const catLower = item.category.toLowerCase();
      const cmdLower = item.commands.toLowerCase();

      terms.forEach(t => {
        if (titleLower.includes(t)) score += titleLower.startsWith(t) ? 120 : 70;
        if (catLower.includes(t)) score += 50;
        if (cmdLower.includes(t)) score += 40;
        if (sumLower.includes(t)) score += 30;
      });

      return { ...item, score };
    })
    .filter(i => i.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 25);
}

window.openSearchModal = function() {
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('searchInput');
  if (modal) {
    modal.classList.add('cyber-modal-open');
    document.body.classList.add('modal-open');
    if (input) {
      input.value = '';
      setTimeout(() => input.focus(), 50);
      renderSearchResults('');
    }
  }
};

window.closeSearchModal = function() {
  const modal = document.getElementById('searchModal');
  const input = document.getElementById('searchInput');
  if (input) {
    input.blur();
  }
  if (modal) {
    modal.classList.remove('cyber-modal-open');
    document.body.classList.remove('modal-open');
  }
  activeResultIndex = -1;
};

function renderSearchResults(query) {
  const container = document.getElementById('searchResults');
  if (!container) return;

  activeResultIndex = -1;

  if (!query || !query.trim()) {
    container.innerHTML = `
      <div class="search-empty-prompt">
        <span class="search-prompt-text">TYPE TO SEARCH 24 MODULES & DAILY LABS</span>
        <span class="search-prompt-sub">Real-time sub-millisecond fuzzy search across all curriculum modules</span>
      </div>
    `;
    return;
  }

  const results = executeSearch(query);

  if (!results.length) {
    container.innerHTML = `
      <div class="search-empty-prompt">
        <span class="search-prompt-text">NO MATCHING SYSTEMS MODULES FOUND</span>
        <span class="search-prompt-sub">Try searching for keywords like 'sockets', 'eBPF', 'Raft', 'kernel', 'ZFS', 'WASM'</span>
      </div>
    `;
    return;
  }

  container.innerHTML = results.map((r, idx) => {
    const safeUrl = escapeAttr(r.url || '#');
    const safeCategory = escapeHtml(r.category || 'SYSTEMS');
    const safeMeta = escapeHtml(r.commands || r.os || '');
    return `
    <a href="${safeUrl}" class="search-result-item ${idx === 0 ? 'search-result-active' : ''}" data-index="${idx}">
      <div class="search-res-left">
        <div class="search-res-header">
          <span class="search-res-badge">${safeCategory}</span>
          <span class="search-res-title">${highlightMatch(r.title, query)}</span>
        </div>
        ${r.summary ? `<span class="search-res-desc">${highlightMatch(r.summary, query)}</span>` : ''}
      </div>
      <div class="search-res-right">
        <span class="search-res-topic">${safeMeta}</span>
      </div>
    </a>
  `;
  }).join('');

  activeResultIndex = 0;
}

function highlightMatch(text, query) {
  if (!text) return '';
  if (!query) return text;
  const terms = query.trim().split(/\s+/).filter(Boolean);
  let safe = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  terms.forEach(t => {
    const re = new RegExp(`(${t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    safe = safe.replace(re, '<mark style="background: rgba(255,255,255,0.25); color:#ffffff; padding:0 2px;">$1</mark>');
  });
  return safe;
}

function setupSearchEventListeners() {
  const input = document.getElementById('searchInput');
  if (input) {
    input.addEventListener('input', (e) => {
      renderSearchResults(e.target.value);
    });
  }

  // Global Keyboard Shortcuts
  window.addEventListener('keydown', (e) => {
    const modal = document.getElementById('searchModal');
    const isOpen = modal && modal.classList.contains('cyber-modal-open');

    // 1. Open on '/' or 'Ctrl+K' / 'Cmd+K'
    if (!isOpen && (e.key === '/' || ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k'))) {
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag !== 'input' && activeTag !== 'textarea') {
        e.preventDefault();
        openSearchModal();
      }
    }

    // 2. Escape to close
    if (isOpen && e.key === 'Escape') {
      e.preventDefault();
      closeSearchModal();
    }

    // 3. Arrow Up / Down navigation in results
    if (isOpen && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      const items = Array.from(document.querySelectorAll('.search-result-item'));
      if (items.length) {
        e.preventDefault();
        items.forEach(it => it.classList.remove('search-result-active'));

        if (e.key === 'ArrowDown') {
          activeResultIndex = (activeResultIndex + 1) % items.length;
        } else {
          activeResultIndex = (activeResultIndex - 1 + items.length) % items.length;
        }

        const activeItem = items[activeResultIndex];
        if (activeItem) {
          activeItem.classList.add('search-result-active');
          activeItem.scrollIntoView({ block: 'nearest' });
        }
      }
    }

    // 4. Enter to open selected result
    if (isOpen && e.key === 'Enter') {
      const activeItem = document.querySelector('.search-result-item.search-result-active');
      if (activeItem) {
        e.preventDefault();
        window.location.href = activeItem.href;
      }
    }
  });
}

/* ── READING PROGRESS BAR ─────────────────────────────────────────────────── */
function setupReadingProgressBar() {
  const bar = document.getElementById('readingProgressBar');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    if (totalHeight <= 0) {
      bar.style.width = '0%';
      return;
    }
    const progress = Math.min(100, Math.max(0, (window.scrollY / totalHeight) * 100));
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

/* ── KEYBOARD SHORTCUTS MODAL & GLOBAL DISPATCHER ─────────────────────────── */
function openShortcutsModal() {
  const modal = document.getElementById('shortcutsModal');
  if (modal) modal.classList.add('cyber-modal-open');
}

function closeShortcutsModal() {
  const modal = document.getElementById('shortcutsModal');
  if (modal) modal.classList.remove('cyber-modal-open');
}

function setupGlobalKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    const active = document.activeElement;
    if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.tagName === 'SELECT' || active.isContentEditable)) {
      return;
    }

    if (e.ctrlKey || e.metaKey || e.altKey) return;

    const key = e.key;

    // '?' opens shortcuts modal
    if (key === '?' || (e.shiftKey && key === '/')) {
      e.preventDefault();
      openShortcutsModal();
      return;
    }

    // Modal dismissals on ESC
    if (key === 'Escape') {
      closeShortcutsModal();
      closeSearchModal();
      closeRoadmapModal();
      return;
    }

    const searchModal = document.getElementById('searchModal');
    const shortcutsModal = document.getElementById('shortcutsModal');
    const roadmapModal = document.getElementById('roadmapModal');
    if ((searchModal && searchModal.classList.contains('cyber-modal-open')) ||
        (shortcutsModal && shortcutsModal.classList.contains('cyber-modal-open')) ||
        (roadmapModal && roadmapModal.classList.contains('cyber-modal-open'))) {
      return;
    }

    // Global navigation shortcuts
    if (key === 'h' || key === 'H') {
      e.preventDefault();
      window.location.href = getAppUrl('');
    } else if (key === 'r' || key === 'R') {
      e.preventDefault();
      window.location.href = getAppUrl('roadmap/');
    } else if (key === 's' || key === 'S') {
      e.preventDefault();
      window.location.href = getAppUrl('2026/august/');
    } else if (key === 'l' || key === 'L') {
      e.preventDefault();
      window.location.href = getAppUrl('history/');
    }
  });
}

/* ── HISTORY EXPORT / IMPORT BACKUP ENGINE ───────────────────────────────── */
function exportStudyHistory() {
  const userState = loadUserState() || {};
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(userState, null, 2));
  const downloadAnchor = document.createElement('a');
  const dateStr = new Date().toISOString().split('T')[0];
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", `systems_study_history_${dateStr}.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

function importStudyHistory(event) {
  const file = event.target.files && event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result);
      if (!imported || typeof imported !== 'object') throw new Error("Invalid JSON structure");
      
      const existing = loadUserState() || {};
      const mergedLabs = Array.from(new Set([...(existing.completedLabs || []), ...(imported.completedLabs || [])]));
      const mergedHours = Math.max(parseFloat(existing.totalHours || 0), parseFloat(imported.totalHours || 0));
      
      const mergedState = {
        ...existing,
        ...imported,
        completedLabs: mergedLabs,
        totalHours: mergedHours
      };
      
      saveUserState(mergedState);
      renderHistoryPage(mergedState);
      alert("✓ Study History Successfully Imported and Synchronized!");
    } catch (err) {
      alert("Failed to import history file: Invalid JSON format.");
    }
  };
  reader.readAsText(file);
}

/* ── PWA SERVICE WORKER REGISTRATION ──────────────────────────────────────── */
function registerServiceWorker() {
  if ('serviceWorker' in navigator && (window.location.protocol === 'https:' || window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((reg) => {
          console.log('[PWA] Service Worker registered with scope:', reg.scope);
        })
        .catch((err) => {
          console.warn('[PWA] Service Worker registration failed:', err);
        });
    });
  }
}

/* ── INTERACTIVE HUD TABS ENGINE ─────────────────────────────────────────── */
function setupHudTabs() {
  const tabContainers = document.querySelectorAll('.hud-tabs');
  tabContainers.forEach((container) => {
    if (container.querySelector('.hud-tabs-nav')) return;

    const tabs = Array.from(container.querySelectorAll(':scope > .hud-tab'));
    if (!tabs.length) return;

    const nav = document.createElement('div');
    nav.className = 'hud-tabs-nav';

    tabs.forEach((tab, idx) => {
      tab.classList.add('hud-tab-content');
      const title = tab.getAttribute('data-tab') || `Tab ${idx + 1}`;
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'hud-tab-btn' + (idx === 0 ? ' active' : '');
      btn.textContent = title;

      btn.addEventListener('click', () => {
        nav.querySelectorAll('.hud-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        tabs.forEach(t => t.style.display = 'none');
        tab.style.display = 'block';
      });

      nav.appendChild(btn);
      tab.style.display = idx === 0 ? 'block' : 'none';
    });

    container.insertBefore(nav, tabs[0]);
  });
}

/* ── GITHUB STYLE CALLOUT ALERT PARSER ───────────────────────────────────── */
function setupCalloutBoxes() {
  const blockquotes = document.querySelectorAll('.lab-body blockquote');
  blockquotes.forEach((bq) => {
    const text = bq.innerHTML;
    const alertMap = [
      { key: '[!NOTE]', type: 'note', title: 'NOTE' },
      { key: '[!TIP]', type: 'tip', title: 'TIP' },
      { key: '[!IMPORTANT]', type: 'important', title: 'IMPORTANT' },
      { key: '[!WARNING]', type: 'warning', title: 'WARNING' },
      { key: '[!CAUTION]', type: 'caution', title: 'CAUTION' }
    ];

    for (const alert of alertMap) {
      if (text.includes(alert.key)) {
        bq.classList.add('hud-callout', `hud-callout-${alert.type}`);
        bq.innerHTML = text.replace(
          alert.key,
          `<span class="hud-callout-badge hud-callout-badge-${alert.type}">${alert.title}</span>`
        );
        break;
      }
    }
  });
}

