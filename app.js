/* Dependency-free, browser-local prototype. No live AI or network services. */
(() => {
  'use strict';
  const DATA = globalThis.OX_DATA;
  const D = globalThis.OX_DOMAIN;
  const STORAGE = 'oceanx-review-demo-v1';
  const root = document.getElementById('app');
  const modalRoot = document.getElementById('modal-root');
  if (!DATA || !D) {
    root.innerHTML = '<main class="empty-state"><h1>Some prototype files are missing</h1><p>Keep index.html, data.js, domain.js, app.js and styles.css in the same folder, then reopen index.html.</p></main>';
    return;
  }
  const esc = value => String(value ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const icon = (name, size = 20) => {
    const paths = {
      grid: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
      file: '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 13h8M8 17h5"/>',
      panel: '<path d="M4 20V10m8 10V4m8 16v-7M2 20h20"/>',
      arrow: '<path d="M5 12h14m-6-6 6 6-6 6"/>',
      back: '<path d="M19 12H5m6-6-6 6 6 6"/>',
      search: '<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
      check: '<path d="m5 12 4 4L19 6"/>',
      close: '<path d="m6 6 12 12M18 6 6 18"/>',
      info: '<circle cx="12" cy="12" r="9"/><path d="M12 11v6m0-10v.5"/>',
      book: '<path d="M12 5C8 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-6-2-10 1Zm0 0v15"/>',
      spark: '<path d="m12 3 2.4 6.6L21 12l-6.6 2.4L12 21l-2.4-6.6L3 12l6.6-2.4ZM20 2v4m-2-2h4"/>',
      reset: '<path d="M3 10a9 9 0 1 1 2 9M3 3v7h7"/>',
      clock: '<circle cx="12" cy="12" r="9"/><path d="M12 6v6l4 2"/>',
      download: '<path d="M12 3v12m-5-5 5 5 5-5M4 16v5h16v-5"/>',
      link: '<path d="m10 13 4-4m-6 7-2 2a4 4 0 0 1-6-6l5-5a4 4 0 0 1 6 0m2 2 2-2a4 4 0 0 1 6 6l-5 5a4 4 0 0 1-6 0" transform="translate(2 -1)"/>',
      flag: '<path d="M4 22V3c6-4 10 4 16 0v11c-6 4-10-4-16 0"/>',
      users: '<circle cx="9" cy="8" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3m1-17a3 3 0 0 1 0 6m3 11v-3a6 6 0 0 0-2-4"/>',
      route: '<circle cx="5" cy="5" r="2"/><circle cx="19" cy="19" r="2"/><path d="M7 5h8a4 4 0 0 1 0 8H9a4 4 0 0 0 0 8h8"/>',
      lock: '<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V6a4 4 0 0 1 8 0v4"/>'
    };
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.file}</svg>`;
  };
  let storageWarning = false;
  let state = loadState();
  let ui = { filter: 'all', search: '', sourceId: null, evidenceTab: 'summary', disclosures: {}, modal: null, modalData: null, lastFocus: null };
  function loadState() {
    try {
      const stored = JSON.parse(localStorage.getItem(STORAGE) || 'null');
      if (stored?.version === 1 && Array.isArray(stored.entries) && stored.entries.length === DATA.entries.length && DATA.entries.every(e => stored.entries.some(s => s.id === e.id)) && stored.decisions && Array.isArray(stored.audit)) {
        for (const entry of stored.entries) {
          entry.claimEdits ||= {}; entry.gapResolutions ||= {}; entry.acceptedQuestions ||= []; entry.drafts ||= {};
        }
        stored.decisionDrafts ||= {};
        if (![...DATA.judges.map(j => j.id), 'lead'].includes(stored.currentUser)) stored.currentUser = 'j1';
        if (!['queue', 'review', 'panel'].includes(stored.view)) stored.view = 'queue';
        if (!stored.entries.some(e => e.id === stored.selectedId)) stored.selectedId = DATA.entries[0].id;
        return stored;
      }
    } catch { /* An incompatible or unavailable local store starts a clean demo. */ }
    const fresh = D.createState(DATA); fresh.decisionDrafts = {}; return fresh;
  }
  function persist() {
    try { localStorage.setItem(STORAGE, JSON.stringify(state)); }
    catch { if (!storageWarning) { storageWarning = true; toast('This browser cannot retain changes. The current session still works.', 'warning'); } }
  }
  function selected() { return state.entries.find(e => e.id === state.selectedId) || state.entries[0]; }
  function judge(id) { return DATA.judges.find(j => j.id === id); }
  function isLead() { return state.currentUser === 'lead'; }
  function final(entry) { return state.decisions[entry.id]; }
  function addAudit(type, entryId, detail) { D.addAudit(state, type, entryId, detail); }
  function nameOf(id) { return judge(id)?.name || (id === 'lead' ? 'Taylor Brooks · Panel lead' : id); }
  function canReview(entry) { return !final(entry) && entry.assigned.includes(state.currentUser) && !entry.conflicts.includes(state.currentUser); }
  function canAnnotate(entry) { return !final(entry) && (isLead() || canReview(entry)); }
  function reviewStatus(entry) { return D.getReviewStatus(entry, DATA.criteria); }
  function attention(entry) { return D.blockers(entry, DATA.criteria).some(b => !b.startsWith('Review coverage is incomplete')); }
  function draftFor(entry) {
    const existing = entry.reviews[state.currentUser];
    entry.drafts ||= {};
    if (!entry.drafts[state.currentUser]) entry.drafts[state.currentUser] = {
      scores: Object.fromEntries(DATA.criteria.map(c => [c.id, existing?.scores?.[c.id] ?? null])), rationale: existing?.rationale || ''
    };
    return entry.drafts[state.currentUser];
  }
  function decisionDraft(entry) {
    state.decisionDrafts ||= {};
    return state.decisionDrafts[entry.id] ||= { outcome: 'shortlist', rationale: '', owner: '', nextAction: '', checkpoint: '' };
  }
  function badge(text, style = 'gray') { return `<span class="badge ${style}">${esc(text)}</span>`; }
  function statusBadge(entry) {
    if (final(entry)) return badge({shortlist:'Shortlisted',clarify:'Clarification requested',hold:'On hold',decline:'Not selected'}[final(entry).outcome] || 'Decision recorded', final(entry).outcome === 'shortlist' ? 'teal' : 'gray');
    if (entry.assigned.some(id => entry.conflicts.includes(id))) return badge('Assignment conflict', 'red');
    if (reviewStatus(entry).complete) return attention(entry) ? badge('Panel attention', 'amber') : badge('Ready for panel', 'teal');
    return badge('Review in progress', 'blue');
  }
  function shell(content) {
    const viewTitle = {queue:'Entries',review:'Review',panel:'Panel decision'}[state.view];
    return `<div class="app-shell">
      <aside class="sidebar" aria-label="Main navigation">
        <a href="#" class="brand" data-action="nav" data-view="queue" aria-label="OceanX Challenge Review home"><span class="brand-symbol"><img src="icon.svg" width="40" height="40" alt=""></span><span><span class="brand-word">OCEAN<span class="brand-x">X</span></span><span class="brand-subtitle">CHALLENGE REVIEW</span></span></a>
        <nav>${[['queue','grid','Entries'],['review','file','Review'],['panel','panel','Decide']].map(([v,i,t])=>`<button class="nav-item ${state.view===v?'active':''}" data-action="nav" data-view="${v}" ${state.view===v?'aria-current="page"':''}>${icon(i)}<span>${t}</span></button>`).join('')}</nav>
        <div class="sidebar-secondary"><button class="nav-item" data-action="brief">${icon('book')}<span>Challenge brief</span></button><button class="nav-item" data-action="about">${icon('info')}<span>Help & demo settings</span></button></div>
        <div class="sidebar-footer"><strong>Living Light</strong><p>Concept screening</p></div>
      </aside>
      <div class="workspace"><header class="topbar"><div class="breadcrumb"><span>Living Light</span><span aria-hidden="true">/</span><strong>${viewTitle}</strong></div><div class="topbar-actions"><button class="prototype-label" data-action="about">Demo &middot; Fictional data</button><label class="identity"><span class="sr-only">Demo role</span><span class="avatar">${isLead()?'TB':esc(judge(state.currentUser)?.initials || 'AM')}</span><select id="current-user" aria-label="Demo role">${DATA.judges.map(j=>`<option value="${j.id}" ${state.currentUser===j.id?'selected':''}>${esc(j.name)} &middot; Reviewer</option>`).join('')}<option value="lead" ${isLead()?'selected':''}>Taylor Brooks &middot; Panel lead</option></select></label></div></header>
      <main class="main" id="main-content" tabindex="-1">${content}</main></div>
    </div>`;
  }
  function queueView() {
    const needs=state.entries.filter(e=>attention(e)&&!final(e)).length;
    return `<section class="page-head"><div><div class="eyebrow">CONCEPT SCREENING</div><h1 class="page-title">${isLead()?'Review the round':'Choose a concept'}</h1><p class="page-description">${isLead()?'Open an entry to review the evidence and decide its next step.':'Check the evidence, then record your assessment.'}</p></div></section>
      <div class="queue-progress"><span>${state.entries.length} entries</span><span>${needs} need attention</span><span>${Object.keys(state.decisions).length} decisions saved</span></div>
      <div class="toolbar"><div class="filter-tabs" role="group" aria-label="Filter entries">${[['all','All entries'],['mine','To review'],['attention','Needs attention'],['decided','Decided']].filter(([v])=>v!=='mine'||!isLead()).map(([v,t])=>`<button class="filter-tab ${ui.filter===v?'active':''}" data-action="filter" data-filter="${v}" aria-pressed="${ui.filter===v}">${t}</button>`).join('')}</div><label class="search">${icon('search',18)}<input id="entry-search" type="search" value="${esc(ui.search)}" placeholder="Search entries" aria-label="Search entries or teams"></label></div>
      <div id="entry-results">${entryResults()}</div>`;
  }
  function entryResults() {
    const entries=state.entries.filter(e=>{
      if(!(e.title+' '+e.team+' '+e.format).toLowerCase().includes(ui.search.toLowerCase()))return false;
      if(ui.filter==='mine')return canReview(e)&&!e.reviews[state.currentUser]?.submitted;
      if(ui.filter==='attention')return attention(e)&&!final(e);
      if(ui.filter==='decided')return !!final(e);
      return true;
    });
    return `<div class="section-heading"><span class="count-label">${entries.length} ${entries.length===1?'entry':'entries'}</span><span class="muted">Submission order</span></div><section class="entry-grid">${entries.length?entries.map(e=>{
      const status=reviewStatus(e),pending=canReview(e)&&!e.reviews[state.currentUser]?.submitted;
      return `<article class="entry-card"><div class="entry-card-body"><div class="entry-card-header"><span class="entry-number">${esc(e.number || e.id.toUpperCase())} &middot; ${esc(e.team)}</span>${statusBadge(e)}</div><h2 class="entry-title">${esc(e.title)}</h2><p class="entry-description">${esc(e.tagline || e.description)}</p><div class="tag-list"><span class="tag">${esc(e.format)}</span></div><div class="entry-card-footer"><span class="coverage">${status.completed} of ${status.required} reviews</span><button class="button ${pending?'primary':'secondary'} small" data-action="${isLead()?'open-panel-entry':'open-entry'}" data-entry="${e.id}">${isLead()?'Review decision':pending?'Review concept':'Open concept'} ${icon('arrow',16)}</button></div></div></article>`;
    }).join(''):`<div class="empty-state"><h2>${ui.filter==='mine'?'Your reviews are up to date':'No matching entries'}</h2><p>${ui.filter==='mine'?'You have no eligible reviews waiting.':'Try another search or filter.'}</p><button class="button secondary" data-action="clear-filter">Show all entries</button></div>`}</section>`;
  }
  function sourceCards(entry) {
    return entry.sources.map((s,i)=>`<article class="source-card ${ui.sourceId===s.id?'highlighted':''}" id="source-${esc(s.id)}" tabindex="-1"><div class="source-label"><span>${esc(s.label)}</span><span class="source-time">${esc(s.time || String(i+1).padStart(2,'0'))}</span></div><p class="source-text">${esc(s.text)}</p><div class="source-footer">${esc(s.kind || 'Submission excerpt')}</div></article>`).join('');
  }
  function issueCards(entry, panel=false) {
    return entry.gaps.map(g=>{
      const resolution=entry.gapResolutions[g.id],resolved=resolution?.status==='resolved';
      return `<details class="issue-disclosure ${g.critical&&!resolved?'critical':''}" ${g.critical&&!resolved?'open':''}><summary><span>${esc(g.title)}</span>${badge(resolved?'Resolved':g.critical?'Needs resolution':'Follow-up',resolved?'teal':g.critical?'amber':'gray')}</summary><div class="disclosure-body"><p>${esc(g.detail)}</p>${resolved?`<p class="form-note">${esc(resolution.rationale)}</p>`:''}<div class="inline-actions">${!panel?`<button class="source-link" data-action="source" data-source="${esc(g.sourceId)}">View source</button>`:''}${isLead()&&!final(entry)?`<button class="link-button" data-action="resolve-gap" data-gap="${esc(g.id)}">${resolved?'Review resolution':'Resolve issue'}</button>`:''}</div></div></details>`;
    }).join('');
  }
  function reviewForm(entry) {
    const draft=draftFor(entry),own=entry.reviews[state.currentUser];
    return `<form data-form="review" novalidate><p class="form-note">Rate the concept. A finished build is not required.</p>
      ${DATA.criteria.map(c=>`<fieldset class="criterion"><legend class="criterion-label">${esc(c.label)}</legend><div class="rating-scale" role="group" aria-label="${esc(c.label)} rating">${[1,2,3,4,5].map(n=>`<button type="button" data-action="rate" data-criterion="${c.id}" data-rating="${n}" aria-label="${esc(c.label)}: ${n} out of 5" aria-pressed="${draft.scores[c.id]===n}">${n}</button>`).join('')}</div><div class="criterion-tools"><button type="button" class="rating-na" data-action="rate" data-criterion="${c.id}" data-rating="none" aria-pressed="${draft.scores[c.id]==null}">Not enough evidence</button><details class="rating-guide"><summary>Rating guide</summary><p>${esc(c.question)}</p><p>1: ${esc(c.anchors?.[1] || 'Weak support')}<br>3: ${esc(c.anchors?.[3] || 'Credible concept, some gaps')}<br>5: ${esc(c.anchors?.[5] || 'Strong support for this stage')}</p></details></div></fieldset>`).join('')}
      <div class="field"><label class="field-label" for="review-rationale">Reason for your scores <span aria-hidden="true">*</span></label><textarea id="review-rationale" name="rationale" class="text-area" rows="3" placeholder="What supports your scores? What remains uncertain?">${esc(draft.rationale)}</textarea></div>
      <p class="form-note" id="review-progress">${DATA.criteria.filter(c=>draft.scores[c.id]!=null).length} of 6 criteria rated.</p><div id="review-error" class="error-text" role="alert" tabindex="-1"></div><div class="sticky-actions"><span class="save-status" id="draft-status">Saved in this browser</span><button type="submit" class="button primary">${icon('check',16)} ${own?.submitted?'Update review':'Save review'}</button></div></form>`;
  }
  function reviewView() {
    const entry=selected(),writable=canReview(entry),own=entry.reviews[state.currentUser],tab=state.mode==='manual'?'sources':(ui.evidenceTab || 'summary');
    const next=state.entries.find(e=>e.id!==entry.id&&canReview(e)&&!e.reviews[state.currentUser]?.submitted);
    return `<button class="back-link" data-action="nav" data-view="queue">${icon('back',16)} All entries</button>
      <section class="page-head review-heading"><div><div class="eyebrow">${esc(entry.number || entry.id.toUpperCase())} &middot; ${esc(entry.team)}</div><h1 class="page-title">${esc(entry.title)}</h1><p class="page-description">${esc(entry.tagline || entry.description)}</p></div><div class="head-actions">${statusBadge(entry)}</div></section>
      ${final(entry)?`<div class="notice success review-complete">${icon('lock',18)}<div><strong>The decision is saved.</strong><p>This review is now read-only.</p></div><button class="button secondary small" data-action="${isLead()?'nav':'switch-lead'}" data-view="panel">${isLead()?'View decision':'View decision as lead'} ${icon('arrow',16)}</button></div>`:own?.submitted?`<div class="notice success review-complete">${icon('check',18)}<div><strong>Your review is saved.</strong><p>${reviewStatus(entry).complete?'Both reviews are ready for the panel.':'The panel is waiting for another review.'}</p></div><div class="inline-actions">${next?`<button class="button secondary small" data-action="open-entry" data-entry="${next.id}">Review next entry ${icon('arrow',16)}</button>`:''}<button class="button primary small" data-action="switch-lead">Open panel as lead ${icon('arrow',16)}</button></div></div>`:''}
      <div class="review-workspace"><section class="panel evidence-panel"><div class="panel-head"><h2 class="panel-title">The concept</h2><label class="mode-toggle"><input type="checkbox" id="assistance-toggle" ${state.mode==='assisted'?'checked':''}><span class="switch"></span><span>Show summary</span></label></div>
        <div class="evidence-tabs" role="group" aria-label="Evidence view">${state.mode==='assisted'?`<button class="${tab==='summary'?'active':''}" data-action="evidence-tab" data-tab="summary" aria-pressed="${tab==='summary'}">Summary</button>`:''}<button class="${tab==='sources'?'active':''}" data-action="evidence-tab" data-tab="sources" aria-pressed="${tab==='sources'}">Original sources</button></div>
        <div class="panel-body evidence-content">${tab==='summary'?`<p class="evidence-intro">Prepared summary. No live AI. Check each claim against its source.</p>${entry.claims.map((c,i)=>{const edit=entry.claimEdits[c.id];return `<article class="claim-card ${edit?'corrected':''}">${edit?badge('Corrected','teal'):''}<p class="claim-text">${esc(edit?.text || c.text)}</p><div class="claim-actions"><button class="source-link" data-action="source" data-source="${esc(c.sourceId)}">${icon('link',14)} View source</button><button class="link-button" data-action="edit-claim" data-claim="${esc(c.id)}" ${!canAnnotate(entry)?'disabled':''}>${edit?'Edit correction':'Correct'}</button></div>${edit?`<p class="form-note">${esc(edit.reason)}</p>`:''}</article>`}).join('')}`:`<p class="evidence-intro">These excerpts represent the submission. No video is included.</p>${sourceCards(entry)}`}
          ${issueCards(entry)}
          <details class="review-extras" data-disclosure="${entry.id}-questions"><summary>Questions for the next stage${entry.acceptedQuestions.length?` &middot; ${entry.acceptedQuestions.length} selected`:''}</summary><div class="disclosure-body">${state.mode==='assisted'?entry.questions.map(q=>`<article class="question-card"><p>${esc(q.text)}</p><div class="inline-actions"><button class="source-link" data-action="source" data-source="${esc(q.sourceId)}">View source</button><button class="button ghost small" data-action="question" data-question="${esc(q.id)}" aria-pressed="${entry.acceptedQuestions.includes(q.id)}" ${!canAnnotate(entry)?'disabled':''}>${entry.acceptedQuestions.includes(q.id)?icon('check',14)+' Added':'Add to handover'}</button></div></article>`).join(''):''}<div class="field"><label class="field-label" for="manual-question">Your question</label><textarea class="text-area" id="manual-question" rows="3" placeholder="What should the team test next?" ${!canAnnotate(entry)?'disabled':''}>${esc(entry.manualQuestion || '')}</textarea></div></div></details>
          <div class="evidence-footer"><button class="link-button" data-action="brief">Challenge brief</button><button class="link-button" data-action="history" data-entry="${entry.id}">Review history</button></div>
        </div></section>
        <section class="panel rubric-panel"><div class="panel-head"><h2 class="panel-title">Your assessment</h2>${own?.submitted?badge('Saved','teal'):''}</div><div class="panel-body">${writable?(own?.submitted?`<details class="review-extras" data-disclosure="${entry.id}-${state.currentUser}-edit"><summary>Edit your review</summary><div class="disclosure-body">${reviewForm(entry)}</div></details>`:reviewForm(entry)):`<div class="empty-state"><h3>${final(entry)?'Review complete':isLead()?'Continue with the panel':entry.conflicts.includes(state.currentUser)?'This review needs reassignment':'You are not assigned'}</h3><p>${final(entry)?'The panel has recorded its decision.':isLead()?'Read the independent assessments before deciding the next step.':entry.conflicts.includes(state.currentUser)?'Your declared conflict prevents you from reviewing this concept.':'An assigned reviewer can assess this concept.'}</p><button class="button secondary" data-action="${isLead()?'nav':'switch-lead'}" data-view="panel">${isLead()?'Open panel':'Open panel as lead'} ${icon('arrow',16)}</button></div>`}</div></section>
      </div>`;
  }
  function panelView() {
    if(!isLead())return `<section class="page-head"><div><h1 class="page-title">Panel decision</h1><p class="page-description">The panel brings the independent reviews together.</p></div></section><section class="panel"><div class="empty-state">${icon('users',36)}<h2>Continue as panel lead</h2><p>Switch demo roles to compare the reviews and decide the next step.</p><button class="button primary" data-action="switch-lead">Open panel as lead ${icon('arrow',16)}</button></div></section>`;
    const ranks=D.rankEntries(state.entries,DATA.criteria),rankMap=Object.fromEntries(ranks.map(r=>[r.id,r]));
    const entries=[...state.entries].sort((a,b)=>(rankMap[b.id]?.score ?? -1)-(rankMap[a.id]?.score ?? -1));
    const entry=selected(),score=D.scoreEntry(entry,DATA.criteria),blockers=D.blockers(entry,DATA.criteria),discrepancies=D.disagreement(entry,DATA.criteria),decision=final(entry),draft=decisionDraft(entry);
    return `<button class="back-link" data-action="nav" data-view="queue">${icon('back',16)} All entries</button><section class="page-head"><div><div class="eyebrow">PANEL DECISION</div><h1 class="page-title">${esc(entry.title)}</h1><p class="page-description">Review the assessments and record the next step.</p></div><div class="head-actions">${statusBadge(entry)}</div></section>
      <details class="comparison-disclosure" data-disclosure="comparison"><summary>Compare all ${state.entries.length} entries <span class="muted">${ranks.length} ready to compare</span></summary><div class="table-wrap"><table class="comparison-table"><thead><tr><th scope="col">Rank</th><th scope="col">Entry</th><th scope="col">Reviews</th><th scope="col">Score / 5</th><th scope="col">Status</th></tr></thead><tbody>${entries.map(e=>`<tr class="${e.id===entry.id?'selected':''}"><td>${rankMap[e.id]?.rank || 'Pending'}</td><td><button class="table-entry-button" data-action="select-panel" data-entry="${e.id}" aria-pressed="${e.id===entry.id}"><strong>${esc(e.title)}</strong></button></td><td>${reviewStatus(e).completed}/2</td><td>${rankMap[e.id]?rankMap[e.id].score.toFixed(2):'Pending'}</td><td>${statusBadge(e)}</td></tr>`).join('')}</tbody></table></div></details>
      <div class="decision-layout"><div class="decision-main"><section class="panel selected-entry-panel"><div class="panel-head"><h2 class="panel-title">Independent reviews</h2><button class="button ghost small" data-action="open-entry" data-entry="${entry.id}">View evidence ${icon('arrow',16)}</button></div><div class="panel-body"><div class="review-summary"><div><span class="muted">Average score</span><strong class="summary-score">${score==null?'Pending':score.toFixed(2)}${score==null?'':'<small> / 5</small>'}</strong></div><div><span class="muted">Reviews</span><strong>${reviewStatus(entry).completed} of 2</strong></div><button class="link-button" data-action="method">Scoring rules</button></div>
      ${blockers.length&&!decision?`<div class="notice warning blocking-summary"><div><strong>Resolve these items before shortlisting.</strong><ul>${blockers.map(b=>`<li>${esc(b)}</li>`).join('')}</ul></div></div>`:''}
      ${entry.assigned.map(id=>{const r=entry.reviews[id],valid=r?.submitted&&!entry.conflicts.includes(id)&&r.sourceVersion===entry.sourceVersion;return `<details class="reviewer-disclosure" data-disclosure="${entry.id}-${id}-assessment"><summary><span class="avatar">${esc(judge(id)?.initials || id)}</span><span>${esc(nameOf(id))}</span>${badge(valid?'Reviewed':entry.conflicts.includes(id)?'Conflict':'Pending',valid?'teal':entry.conflicts.includes(id)?'red':'gray')}</summary><div class="disclosure-body"><p class="form-note">${esc(judge(id)?.role || '')}</p><p>${valid?esc(r.rationale):entry.conflicts.includes(id)?'This reviewer has a declared conflict. Assign someone else.':'This reviewer has not submitted an assessment.'}</p>${valid?`<div class="criterion-mini-grid">${DATA.criteria.map(c=>`<span>${esc(c.label)} <strong>${r.scores[c.id] ?? 'Pending'}</strong></span>`).join('')}</div>`:''}</div></details>`}).join('')}
      <button class="button ghost small" data-action="assignment" data-entry="${entry.id}" ${decision?'disabled':''}>${icon('users',16)} Change reviewers</button>
      ${discrepancies.length?`<details class="issue-disclosure ${entry.moderation?.resolved?'':'critical'}" ${entry.moderation?.resolved?'':'open'}><summary><span>Reviewers disagree</span>${badge(entry.moderation?.resolved?'Discussed':'Needs discussion',entry.moderation?.resolved?'teal':'amber')}</summary><div class="disclosure-body"><p>${discrepancies.map(x=>`${esc(DATA.criteria.find(c=>c.id===x.criterion)?.label || x.criterion)}: ${x.min} to ${x.max}`).join(' / ')}</p>${entry.moderation?.resolved?`<p>${esc(entry.moderation.rationale)}</p>`:`<button class="button secondary small" data-action="moderate" ${decision?'disabled':''}>Record panel discussion</button>`}</div></details>`:''}
      ${issueCards(entry,true)}</div></section></div>
      <aside class="decision-card panel"><div class="panel-head"><h2 class="panel-title">${decision?'Decision saved':'Decision and next step'}</h2>${icon(decision?'check':'file',20)}</div><div class="panel-body">${decision?decisionPreview(entry,decision):`<form data-form="decision" novalidate><div class="decision-options" role="group" aria-label="Decision outcome">${[['shortlist','Shortlist'],['clarify','Clarify'],['hold','Hold'],['decline','Not selected']].map(([v,t])=>`<button class="decision-option ${draft.outcome===v?'selected':''}" type="button" data-action="outcome" data-outcome="${v}" aria-pressed="${draft.outcome===v}">${t}</button>`).join('')}</div><div class="field"><label class="field-label" for="decision-rationale">Reason for the decision *</label><textarea id="decision-rationale" name="rationale" data-decision-field="rationale" class="text-area" rows="3" placeholder="What evidence supports this decision?">${esc(draft.rationale)}</textarea></div>
      <div class="next-step-fields"><h3>What happens next?</h3>${entry.acceptedQuestions.length||entry.manualQuestion?`<details class="review-extras" data-disclosure="${entry.id}-panel-questions"><summary>Questions from the review</summary><div class="disclosure-body">${entry.questions.filter(q=>entry.acceptedQuestions.includes(q.id)).map(q=>`<p>${esc(q.text)}</p>`).join('')}${entry.manualQuestion?`<p>${esc(entry.manualQuestion)}</p>`:''}<button class="link-button" type="button" data-action="use-questions">Add questions to next action</button></div></details>`:''}<div class="field"><label class="field-label" for="decision-owner">Owner</label><input class="text-input" id="decision-owner" name="owner" data-decision-field="owner" list="mentor-owners" value="${esc(draft.owner)}" placeholder="Who will take this forward?"><datalist id="mentor-owners">${DATA.judges.map(j=>`<option value="${esc(j.name)}">${esc(j.role)}</option>`).join('')}</datalist></div><div class="field"><label class="field-label" for="decision-action">Next action</label><textarea class="text-area" id="decision-action" name="nextAction" data-decision-field="nextAction" rows="3" placeholder="What should they test or clarify?">${esc(draft.nextAction)}</textarea></div><div class="field"><label class="field-label" for="decision-date">Checkpoint</label><input class="text-input" type="date" id="decision-date" name="checkpoint" data-decision-field="checkpoint" value="${esc(draft.checkpoint)}"></div><p class="form-note">Shortlist and Clarify require all three fields.</p></div>
      <div id="decision-error" class="error-text" role="alert" tabindex="-1"></div><button class="button primary full-width" type="submit">${icon('check',17)} Save decision</button><p class="form-note">Saving locks this decision.</p></form>`}</div></aside></div>`;
  }
  function decisionPreview(entry,decision) {
    return `<div class="handover-preview">${statusBadge(entry)}<p>${esc(decision.rationale)}</p><dl class="detail-list"><dt>Owner</dt><dd>${esc(decision.owner || 'Not assigned')}</dd><dt>Checkpoint</dt><dd>${esc(decision.checkpoint || 'Not set')}</dd><dt>Next action</dt><dd>${esc(decision.nextAction || 'No further action recorded')}</dd></dl><button class="button primary full-width" data-action="export" data-format="text" data-entry="${entry.id}">${icon('download',17)} Download handover</button><details class="review-extras" data-disclosure="${entry.id}-record"><summary>Full record</summary><div class="disclosure-body"><button class="link-button" data-action="export" data-format="json" data-entry="${entry.id}">Download JSON record</button><button class="link-button" data-action="history" data-entry="${entry.id}">View history</button></div></details><button class="button secondary full-width" data-action="nav" data-view="queue">Return to entries ${icon('arrow',16)}</button></div>`;
  }
  function render() {
    root.querySelectorAll('[data-disclosure]').forEach(el=>ui.disclosures[el.dataset.disclosure]=el.open);
    root.innerHTML=shell(state.view==='review'?reviewView():state.view==='panel'?panelView():queueView());
    root.querySelectorAll('[data-disclosure]').forEach(el=>{if(Object.hasOwn(ui.disclosures,el.dataset.disclosure))el.open=ui.disclosures[el.dataset.disclosure];});
    persist();
  }
  function navigate(view, id) {
    if(id) state.selectedId=id;
    state.view=view; ui.sourceId=null; ui.evidenceTab='summary'; render(); window.scrollTo({top:0});
    document.querySelector('h1')?.setAttribute('tabindex','-1'); document.querySelector('h1')?.focus({preventScroll:true});
  }
  function toast(message, type='success') {
    const el=document.createElement('div'); el.className=`toast ${type}`; el.textContent=message;
    document.getElementById('toast-container').append(el); setTimeout(()=>el.remove(),6500);
  }
  function showSource(id) {
    ui.sourceId=id; ui.evidenceTab='sources'; render();
    const el=document.getElementById('source-'+id);
    if(el){el.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'nearest'});el.focus({preventScroll:true});}
    else toast('This source is missing. Treat the claim as unverified.','warning');
  }
  function openModal(type,data={}) {
    ui.modal=type;ui.modalData=data;ui.lastFocus=document.activeElement;
    renderModal(); document.body.style.overflow='hidden';
    modalRoot.querySelector('[data-autofocus], .close-button, button, input')?.focus();
  }
  function closeModal() {
    modalRoot.innerHTML='';ui.modal=null;ui.modalData=null;document.body.style.overflow='';
    if(ui.lastFocus?.isConnected)ui.lastFocus.focus(); else document.querySelector('h1')?.focus();
  }
  function renderModal() {
    const entry=selected(), type=ui.modal, data=ui.modalData;let title='',body='',wide=false,drawer=false;
    if(type==='brief') {title='Challenge brief';drawer=true;body=`<div class="eyebrow">APPROVED DEMO CONTEXT · ${esc(DATA.round.briefVersion)}</div><h3>${esc(DATA.round.track)}</h3><p>${esc(DATA.round.description)}</p><div class="notice info"><div><strong>Learning outcome</strong><p>${esc(DATA.round.learningOutcome)}</p></div></div><h3>Before reviewing</h3><ul class="detail-list">${DATA.round.constraints.map(t=>`<li>${esc(t)}</li>`).join('')}</ul><h3>Brief completeness checklist</h3>${DATA.round.questions.map((t,i)=>`<label class="check-row"><input type="checkbox" data-brief-check="${i}" ${state.briefChecks?.[i]?'checked':''}>${esc(t)}</label>`).join('')}<h3>Resources and past examples</h3>${DATA.round.resources.map(r=>`<article class="resource-card"><span class="muted">${esc(r.type)}</span><h4>${esc(r.title)}</h4><p>${esc(r.note)}</p>${r.url&&/^https:\/\//.test(r.url)?`<a class="source-link" href="${esc(r.url)}" target="_blank" rel="noopener noreferrer">Open original source ↗</a>`:''}</article>`).join('')}<p class="form-note">The checklist and archive examples are demonstration material. They do not change OceanX’s official published requirements.</p>`;}
    if(type==='about'||type==='method'){
      title=type==='method'?'Scoring rules':'Help and demo settings';
      const rules=`<p>OceanX provides the six criterion names. Team 7 proposes the rating anchors and decision rules used here.</p><ol><li>Each entry needs two assigned reviewers without conflicts.</li><li>Each reviewer rates all six criteria and explains their scores.</li><li>The comparison averages these ratings with equal weight. Missing ratings do not count as zero. Equal scores share a rank.</li><li>The panel must discuss a difference of three or more points on any criterion.</li><li>Shortlisting requires complete reviews and resolved critical issues.</li><li>Shortlist and Clarify need an owner, next action and checkpoint.</li></ol><p>The panel makes the decision. A high score does not resolve missing evidence.</p>`;
      body=type==='method'?rules:`<p>This student prototype uses fictional entries and reviewers. Its summaries are prepared examples. No live AI is connected.</p>
        <details class="about-options" open><summary>Try one complete review</summary><div class="disclosure-body"><p>Start with Luma. Check its sources and save your assessment. Then open the panel to record a decision and next step.</p><p>Reef Resonance contains a deliberately misleading summary. Compare its pilot claim with the original source.</p></div></details>
        <details class="about-options"><summary>What works here?</summary><div class="disclosure-body"><p>You can review sources, correct summaries and save independent assessments. The panel can change assignments, resolve issues and record a decision.</p><p>The handover download includes the next action. It does not send anything to another person.</p></div></details>
        <details class="about-options"><summary>Scoring rules</summary><div class="disclosure-body">${rules}</div></details>
        <details class="about-options"><summary>Demo limits and storage</summary><div class="disclosure-body"><p>Changes stay in this browser. Demo roles do not provide account security. The local history is not a secure audit log.</p><p>No video, upload service or notifications are connected. The prototype cannot establish the quality of an immersive experience.</p><p>User benefit and AI accuracy have not been tested. Hiding the summary also hides suggested questions. Sources and issue flags remain visible.</p></div></details>
        <div class="dialog-footer"><button class="button secondary" data-action="journey">View the wider journey</button><button class="button ghost" data-action="reset">Reset demo</button></div><p class="form-note"><a href="https://oceanx.org/education/education-impact-challenge/" target="_blank" rel="noopener noreferrer">Read the official challenge brief</a></p>`;
    }
    if(type==='journey'){title='From brief to mentor handover';wide=true;body=`<p>The working prototype covers review and decision-making. The wider journey explains where the inputs come from and who uses the result.</p><div class="journey">${[
      ['Brief','Organiser','Audience, learning aim and rubric','Approved brief/version','Context shown'],['Submission','Participating team','Concept and pitch evidence','Entry with original sources','Sample data'],['Review','Assigned judges','Brief, sources and prepared assistance','Independent scores, reasons and questions','Working'],['Decision','Panel lead','Reviews, coverage and unresolved issues','Recorded outcome and rationale','Working'],['Handover','Mentor / build lead','Decision and unresolved assumptions','Owner, next experiment and checkpoint','Working record'],['Outcome review','Programme team','Later development and learning evidence','Revisit the original assumptions','Future step']
    ].map(([name,actor,input,output,status],i)=>`<div class="journey-step"><span class="journey-number">${i+1}</span><h3>${name}</h3>${badge(status,status==='Working'?'teal':'gray')}<strong>${actor}</strong><p><b>In:</b> ${input}</p><p><b>Out:</b> ${output}</p></div>`).join('')}</div><p class="form-note">Shortlisting does not guarantee production readiness, an earlier programme date or improved learning outcomes.</p>`;}
    if(type==='edit-claim'){const claim=entry.claims.find(c=>c.id===data.claimId),edit=entry.claimEdits[claim.id],source=entry.sources.find(s=>s.id===claim.sourceId);title='Correct the summary';body=`<div class="source-card"><div class="source-label">${esc(source?.label || 'Original source')}</div><p>${esc(source?.text || 'Source unavailable')}</p></div><form data-form="correction"><div class="field"><label class="field-label" for="correction-text">Corrected statement</label><textarea class="text-area" id="correction-text" name="text" rows="4" required data-autofocus>${esc(edit?.text || claim.text)}</textarea></div><div class="field"><label class="field-label" for="correction-reason">Why did you change it?</label><textarea class="text-area" id="correction-reason" name="reason" rows="3" required placeholder="Explain which evidence supports the correction.">${esc(edit?.reason || '')}</textarea></div><div class="dialog-footer"><button type="button" class="button secondary" data-action="close-modal">Cancel</button><button class="button primary" type="submit">Save correction</button></div></form>`;}
    if(type==='resolve-gap'){const gap=entry.gaps.find(g=>g.id===data.gapId),resolution=entry.gapResolutions[gap.id],source=entry.sources.find(s=>s.id===gap.sourceId);title='Review the evidence issue';body=`<h3>${esc(gap.title)}</h3><p>${esc(gap.detail)}</p><div class="source-card"><div class="source-label">${esc(source?.label || 'Source')}</div><p>${esc(source?.text || 'No source available.')}</p></div><p class="form-note">Explain what addresses this issue. Keep any remaining uncertainty in the record.</p><form data-form="gap"><div class="field"><label for="gap-reason" class="field-label">Evidence and resolution</label><textarea class="text-area" id="gap-reason" name="rationale" required rows="5" data-autofocus placeholder="Record what was checked, what was corrected and what remains unknown.">${esc(resolution?.rationale || '')}</textarea></div><div class="dialog-footer"><button type="button" class="button secondary" data-action="close-modal">Keep unresolved</button><button class="button primary" type="submit">Record resolution</button></div></form>`;}
    if(type==='moderate'){title='Record the panel discussion';body=`<p>Explain how the panel resolved the difference. The independent scores will stay unchanged.</p>${D.disagreement(entry,DATA.criteria).map(d=>`<div class="gap-card"><strong>${esc(DATA.criteria.find(c=>c.id===d.criterion)?.label || d.criterion)}</strong><p>Independent ratings range from ${d.min} to ${d.max}.</p></div>`).join('')}<form data-form="moderation"><div class="field"><label class="field-label" for="moderation-reason">What did the panel conclude?</label><textarea class="text-area" id="moderation-reason" name="rationale" required rows="5" data-autofocus></textarea></div><div class="dialog-footer"><button type="button" class="button secondary" data-action="close-modal">Cancel</button><button class="button primary" type="submit">Save discussion</button></div></form>`;}
    if(type==='assignment'){const target=state.entries.find(e=>e.id===data.entryId);title='Assign two independent reviewers';body=`<h3>${esc(target.title)}</h3><p>Choose an available reviewer with relevant expertise.</p>${target.assigned.map(id=>`<div class="reviewer-row"><span class="avatar">${esc(judge(id)?.initials || id)}</span><div><strong>${esc(nameOf(id))}</strong><p class="muted">${esc(judge(id)?.role || '')}</p>${target.conflicts.includes(id)?badge('Declared conflict','red'):badge('Assigned','blue')}</div></div>`).join('')}<form data-form="assignment"><div class="field"><label class="field-label" for="replace-judge">Replace reviewer</label><select class="select-input" id="replace-judge" name="oldJudge">${target.assigned.map(id=>`<option value="${id}">${esc(nameOf(id))}</option>`).join('')}</select></div><div class="field"><label class="field-label" for="new-judge">Assign reviewer</label><select class="select-input" id="new-judge" name="newJudge">${DATA.judges.map(j=>`<option value="${j.id}" ${target.assigned.includes(j.id)||target.conflicts.includes(j.id)?'disabled':''}>${esc(j.name)} · ${esc(j.role)}${target.conflicts.includes(j.id)?' (conflict)':''}</option>`).join('')}</select></div><div id="assignment-error" class="error-text" role="alert"></div><div class="dialog-footer"><button type="button" class="button secondary" data-action="close-modal">Cancel</button><button class="button primary" type="submit" ${!isLead()||final(target)?'disabled':''}>Save assignment</button></div></form>${!isLead()?'<p class="form-note">Switch to the panel lead role to change assignments.</p>':''}`;}
    if(type==='history'){const target=state.entries.find(e=>e.id===data.entryId);title='History of this review';const logs=state.audit.filter(a=>a.entryId===target.id);body=`<h3>${esc(target.title)}</h3><p class="form-note">This history records changes made in this browser.</p><div class="timeline">${logs.length?[...logs].reverse().map(a=>`<div class="timeline-item"><span class="timeline-dot"></span><div><strong>${esc(auditText(a).title)}</strong><p class="audit-text">${esc(auditText(a).detail)}</p><small class="audit-time">${esc(a.actor?nameOf(a.actor):'Demo action')} · ${formatTime(a.at || a.timestamp)}</small></div></div>`).join(''):'<div class="empty-state"><p>No changes have been recorded yet.</p></div>'}</div>`;}
    if(type==='reset'){title='Reset the demonstration?';body='<p>This restores all six fictional entries and removes this prototype’s saved reviews, decisions and local history. Export any handover you want to keep first.</p><div class="dialog-footer"><button class="button secondary" data-action="close-modal">Keep current work</button><button class="button danger" data-action="confirm-reset">Reset demonstration</button></div>';}
    modalRoot.innerHTML=`<div class="modal-backdrop" data-action="backdrop"><section class="dialog ${wide?'wide':''} ${drawer?'drawer':''}" role="dialog" aria-modal="true" aria-labelledby="modal-title"><header class="dialog-header"><h2 id="modal-title">${esc(title)}</h2><button class="close-button button ghost icon-only" data-action="close-modal" aria-label="Close dialog">${icon('close')}</button></header><div class="dialog-body">${body}</div></section></div>`;
  }
  function formatTime(value){if(!value)return 'Current session';const date=new Date(value);return Number.isNaN(date.getTime())?'Current session':new Intl.DateTimeFormat('en-SG',{timeZone:'Asia/Singapore',day:'2-digit',month:'short',hour:'2-digit',minute:'2-digit'}).format(date);}
  function auditText(event) {
    const detail=event.detail || {};
    if(event.type==='review-submitted')return {title:'Review saved',detail:nameOf(detail.judge)+' saved an independent assessment.'};
    if(event.type==='judge-assigned')return {title:'Reviewer changed',detail:nameOf(detail.judge)+' replaced '+nameOf(detail.previousJudge)+'.'};
    if(event.type==='decision-finalized')return {title:'Decision saved',detail:detail.rationale || ''};
    return {title:event.type,detail:typeof detail==='string'?detail:''};
  }
  function exportRecord(entry,format='text') {
    if(!entry || !final(entry)){toast('Save a decision before downloading its handover.','warning');return;}
    const payload={schemaVersion:1,exportedAt:new Date().toISOString(),demonstration:{fictionalData:true,liveAI:false,description:'Student prototype; no measured benefits or production-readiness claim.'},round:DATA.round,criteria:DATA.criteria,reviewers:DATA.judges,panelLead:{id:'lead',name:'Taylor Brooks'},proposedRules:{scale:'1 to 5, with an explicit incomplete state',weighting:'Equal weight across six criteria and eligible reviewers',coverage:'Two assigned, non-conflicted, submitted reviews for the current source version',comparison:'Mean of all eligible criterion ratings; unrounded comparison; tied scores share a rank',moderation:'A spread of three or more points on any criterion requires a recorded panel rationale before shortlisting',shortlist:'Complete coverage, no assignment conflict, and all critical evidence issues and score differences resolved',provenance:'Anchors, weights, coverage and moderation rules are Team 7 proposals, not official OceanX policy'},entry,decision:final(entry),history:state.audit.filter(a=>a.entryId===entry.id)};
    let content=JSON.stringify(payload,null,2),extension='json',mime='application/json';
    if(format!=='json'){
      const decision=final(entry),outcome={shortlist:'Shortlisted',clarify:'Clarification requested',hold:'On hold',decline:'Not selected'}[decision.outcome];
      const questions=[...entry.questions.filter(q=>entry.acceptedQuestions.includes(q.id)).map(q=>q.text),entry.manualQuestion].filter(Boolean);
      const issues=entry.gaps.map(g=>{const r=entry.gapResolutions[g.id];return '- '+g.title+' ['+(r?.status==='resolved'?'Resolution recorded':'Open')+']\n  '+(r?.rationale || g.detail);});
      const reviews=entry.assigned.map(id=>{const r=entry.reviews[id],valid=r?.submitted&&!entry.conflicts.includes(id)&&r.sourceVersion===entry.sourceVersion;return nameOf(id)+': '+(valid?'Review submitted':'Review pending or ineligible')+(valid?'\n'+r.rationale+'\n'+DATA.criteria.map(c=>c.label+': '+r.scores[c.id]+'/5').join('\n'):'');});
      content=[
        'OCEANX CHALLENGE REVIEW',entry.title+' | '+entry.team,
        'DEMO: Fictional data. Prepared AI examples. No live model.',
        '', 'DECISION',outcome,decision.rationale,
        '', 'NEXT STEP','Owner: '+(decision.owner || 'Not assigned'),'Checkpoint: '+(decision.checkpoint || 'Not set'),decision.nextAction || 'No next action recorded.',
        '', 'QUESTIONS FOR THE NEXT STAGE',questions.length?questions.map(q=>'- '+q).join('\n'):'No questions selected.',
        '', 'EVIDENCE ISSUES',issues.length?issues.join('\n\n'):'No issues recorded.',
        '', 'PANEL DISCUSSION',entry.moderation?.rationale || 'No discussion recorded.',
        '', 'INDEPENDENT REVIEWS',reviews.join('\n\n'),
        '', 'SUMMARY CORRECTIONS',Object.keys(entry.claimEdits).length?entry.claims.filter(c=>entry.claimEdits[c.id]).map(c=>{const edit=entry.claimEdits[c.id];return edit.text+'\nReason: '+edit.reason+'\nSource: '+(entry.sources.find(src=>src.id===c.sourceId)?.label || c.sourceId);}).join('\n\n'):'No corrections recorded.',
        '', 'ORIGINAL SOURCES',entry.sources.map(src=>src.label+'\n'+src.text).join('\n\n'),
        '', 'RECORD CONTEXT','Brief: '+DATA.round.briefVersion+' | Source version: '+entry.sourceVersion,'Decision owner: '+nameOf(decision.author),'Decision saved: '+decision.finalizedAt,
        'The rating anchors, equal weights and two-reviewer rule are Team 7 proposals.',
        'Shortlisting does not establish production readiness or learning impact.',
        'Download the optional JSON record for rubric anchors and full local history.'
      ].join('\n');extension='txt';mime='text/plain;charset=utf-8';
    }
    const url=URL.createObjectURL(new Blob([content],{type:mime}));
    const link=document.createElement('a');link.href=url;link.download=`${entry.id}-handover.${extension}`;document.body.append(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(url),3000);
    addAudit('Handover downloaded',entry.id,'Downloaded the '+(extension==='txt'?'readable handover.':'full JSON record.'));persist();toast('Handover downloaded.');
  }
  document.addEventListener('click',event=>{
    const button=event.target.closest('[data-action]');if(!button||button.disabled)return;
    const action=button.dataset.action,entry=selected();
    if(action==='backdrop'){if(event.target===button)closeModal();return;}
    event.preventDefault();
    if(action==='nav'){navigate(button.dataset.view);return;}
    if(action==='open-entry'){navigate('review',button.dataset.entry);return;}
    if(action==='open-panel-entry'&&isLead()){navigate('panel',button.dataset.entry);return;}
    if(action==='evidence-tab'){ui.evidenceTab=button.dataset.tab;ui.sourceId=null;render();document.querySelector('.evidence-tabs .active')?.focus();return;}
    if(action==='select-panel'){state.selectedId=button.dataset.entry;render();return;}
    if(action==='filter'){ui.filter=button.dataset.filter;render();return;}
    if(action==='clear-filter'){ui.filter='all';ui.search='';render();return;}
    if(action==='source'){showSource(button.dataset.source);return;}
    if(action==='close-modal'){closeModal();return;}
    if(['brief','journey','about','method','reset'].includes(action)){openModal(action);return;}
    if(action==='history'){openModal('history',{entryId:button.dataset.entry || entry.id});return;}
    if(action==='assignment'){openModal('assignment',{entryId:button.dataset.entry || entry.id});return;}
    if(action==='switch-lead'){state.currentUser='lead';if(ui.filter==='mine')ui.filter='all';navigate('panel');toast('You are now viewing the panel lead role.');return;}
    if(action==='rate'&&canReview(entry)){
      const value=button.dataset.rating==='none'?null:Number(button.dataset.rating);draftFor(entry).scores[button.dataset.criterion]=value;persist();
      const fieldset=button.closest('.criterion');fieldset.querySelectorAll('[data-action="rate"]').forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.rating===button.dataset.rating)));
      document.getElementById('draft-status').textContent='Saved in this browser';
      document.getElementById('review-progress').textContent=DATA.criteria.filter(c=>draftFor(entry).scores[c.id]!=null).length+' of 6 criteria rated.';return;
    }
    if(action==='edit-claim'&&canAnnotate(entry)){openModal('edit-claim',{claimId:button.dataset.claim});return;}
    if(action==='question'&&canAnnotate(entry)){const id=button.dataset.question;entry.acceptedQuestions=entry.acceptedQuestions.includes(id)?entry.acceptedQuestions.filter(q=>q!==id):[...entry.acceptedQuestions,id];addAudit('Follow-up question changed',entry.id,'Selected questions for the handover.');render();document.querySelector('[data-question="'+id+'"]')?.focus();return;}
    if(action==='resolve-gap'&&isLead()&&!final(entry)){openModal('resolve-gap',{gapId:button.dataset.gap});return;}
    if(action==='moderate'&&isLead()&&!final(entry)){openModal('moderate');return;}
    if(action==='outcome'&&isLead()&&!final(entry)){decisionDraft(entry).outcome=button.dataset.outcome;persist();document.querySelectorAll('[data-action="outcome"]').forEach(b=>{const active=b===button;b.classList.toggle('selected',active);b.setAttribute('aria-pressed',String(active));});return;}
    if(action==='use-questions'&&isLead()&&!final(entry)){
      const draft=decisionDraft(entry),existing=draft.nextAction.trim();
      const questions=[...entry.questions.filter(q=>entry.acceptedQuestions.includes(q.id)).map(q=>q.text),entry.manualQuestion].filter(Boolean);
      const additions=questions.filter(q=>!existing.includes(q));
      draft.nextAction=[existing,...additions].filter(Boolean).join('\n');persist();render();
      document.getElementById('decision-action')?.focus();toast(additions.length?'Questions added.':'These questions are already included.');return;
    }
    if(action==='export'){exportRecord(state.entries.find(e=>e.id===button.dataset.entry),button.dataset.format || 'text');return;}
    if(action==='confirm-reset'){state=D.createState(DATA);state.decisionDrafts={};ui.filter='all';ui.search='';ui.evidenceTab='summary';ui.disclosures={};closeModal();root.innerHTML='';navigate('queue');toast('Demonstration restored.');return;}
  });
  document.addEventListener('input',event=>{
    const target=event.target,entry=selected();
    if(target.id==='entry-search'){ui.search=target.value;document.getElementById('entry-results').innerHTML=entryResults();return;}
    if(target.id==='review-rationale'&&canReview(entry)){draftFor(entry).rationale=target.value;persist();document.getElementById('draft-status').textContent='Saved in this browser';}
    if(target.id==='manual-question'&&canAnnotate(entry)){entry.manualQuestion=target.value;persist();}
    if(target.dataset.decisionField&&isLead()&&!final(entry)){decisionDraft(entry)[target.dataset.decisionField]=target.value;persist();}
  });
  document.addEventListener('change',event=>{
    const target=event.target;
    if(target.id==='assistance-toggle'){state.mode=target.checked?'assisted':'manual';ui.evidenceTab=target.checked?'summary':'sources';addAudit('Review mode changed',state.selectedId,`Changed to ${state.mode} mode. Prepared assistance only; no measured result.`);render();document.getElementById('assistance-toggle')?.focus();toast(state.mode==='assisted'?'Prepared summary shown.':'Summary hidden. Your review is unchanged.');}
    if(target.id==='current-user'){state.currentUser=target.value;if(isLead()&&ui.filter==='mine')ui.filter='all';render();document.getElementById('current-user')?.focus();toast('Demo role changed.');}
    if(target.dataset.briefCheck!=null){state.briefChecks ||= {};state.briefChecks[target.dataset.briefCheck]=target.checked;persist();}
  });
  document.addEventListener('submit',event=>{
    const form=event.target;if(!form.dataset.form)return;event.preventDefault();const entry=selected(),type=form.dataset.form;
    if(type==='review'){
      const draft=draftFor(entry),result=D.saveReview(state,entry.id,state.currentUser,{scores:{...draft.scores},rationale:draft.rationale,sourceVersion:entry.sourceVersion},DATA);
      if(!result.ok){const el=document.getElementById('review-error');el.textContent=result.error;el.focus();el.scrollIntoView({block:'nearest'});return;}
      navigate('review',entry.id);toast('Review saved.');return;
    }
    if(type==='decision'){
      if(!isLead())return;
      const result=D.finalizeDecision(state,entry.id,{...decisionDraft(entry)},DATA);
      if(!result.ok){const error=document.getElementById('decision-error');error.textContent=result.error;error.focus();return;}
      navigate('panel',entry.id);toast('Decision saved.');return;
    }
    if(type==='assignment'){
      if(!isLead())return;const values=new FormData(form);const result=D.assignJudge(state,ui.modalData.entryId,values.get('oldJudge'),values.get('newJudge'),DATA);
      if(!result.ok){document.getElementById('assignment-error').textContent=result.error;return;}
      closeModal();render();toast('Reviewer assignment updated. Previous review records are preserved.');return;
    }
    if(final(entry)){toast('The recorded decision is locked.','warning');return;}
    const values=new FormData(form);
    if(type==='correction'){
      if(!canAnnotate(entry))return;
      const text=String(values.get('text')||'').trim(),reason=String(values.get('reason')||'').trim();if(!text||!reason){toast('Add the corrected statement and its reason.','warning');return;}
      entry.claimEdits[ui.modalData.claimId]={text,reason,by:state.currentUser,at:new Date().toISOString()};addAudit('Draft statement corrected',entry.id,reason);closeModal();render();toast('Correction saved.');return;
    }
    if((type==='gap'||type==='moderation')&&isLead()){
      const rationale=String(values.get('rationale')||'').trim();if(!rationale){toast('Record the evidence and rationale first.','warning');return;}
      if(type==='gap'){entry.gapResolutions[ui.modalData.gapId]={status:'resolved',rationale,by:state.currentUser,at:new Date().toISOString()};addAudit('Evidence issue resolved',entry.id,rationale);}
      else{entry.moderation={resolved:true,rationale,by:state.currentUser,at:new Date().toISOString()};addAudit('Moderation recorded',entry.id,rationale);}
      closeModal();render();toast(type==='gap'?'Resolution saved.':'Panel discussion saved.');
    }
  });
  document.addEventListener('keydown',event=>{
    if(!ui.modal)return;
    if(event.key==='Escape'){event.preventDefault();closeModal();return;}
    if(event.key==='Tab'){
      const focusables=[...modalRoot.querySelectorAll('button:not(:disabled),a[href],input:not(:disabled),select:not(:disabled),textarea:not(:disabled),[tabindex="0"]')].filter(el=>el.offsetParent!==null);
      const first=focusables[0],last=focusables.at(-1);if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    }
  });
  render();
})();
