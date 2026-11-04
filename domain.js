(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  if (root) root.OX_DOMAIN = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';

  var REQUIRED_REVIEWS = 2;
  var OUTCOMES = ['shortlist', 'clarify', 'hold', 'decline'];

  function copy(value) {
    return JSON.parse(JSON.stringify(value));
  }

  function nonblank(value) {
    return typeof value === 'string' && value.trim().length > 0;
  }

  function validScore(value) {
    return typeof value === 'number' && Number.isFinite(value) && value >= 1 && value <= 5;
  }

  function criterionIds(criteria) {
    if (!Array.isArray(criteria)) return [];
    return criteria.map(function (criterion) {
      return typeof criterion === 'string' ? criterion : criterion && criterion.id;
    }).filter(nonblank);
  }

  function assignedIds(entry) {
    return Array.from(new Set(Array.isArray(entry.assigned) ? entry.assigned : []));
  }

  function conflicts(entry) {
    return Array.isArray(entry.conflicts) ? entry.conflicts : [];
  }

  function eligibleIds(entry) {
    return assignedIds(entry).filter(function (id) { return !conflicts(entry).includes(id); });
  }

  function validReview(review, entry, criteria) {
    var ids = criterionIds(criteria);
    return ids.length > 0 && !!review && review.submitted === true &&
      review.sourceVersion === entry.sourceVersion && nonblank(review.rationale) &&
      !!review.scores && ids.every(function (id) { return validScore(review.scores[id]); });
  }

  function currentReviews(entry, criteria) {
    return eligibleIds(entry).map(function (id) {
      return entry.reviews && entry.reviews[id];
    }).filter(function (review) { return validReview(review, entry, criteria); });
  }

  function createState(data) {
    var state = copy(data || {});
    state.version = 1;
    state.entries = (Array.isArray(state.entries) ? state.entries : []).map(function (entry) {
      entry.claimEdits = entry.claimEdits || {};
      entry.gapResolutions = entry.gapResolutions || {};
      entry.acceptedQuestions = entry.acceptedQuestions || [];
      entry.drafts = entry.drafts || {};
      entry.reviews = entry.reviews || {};
      return entry;
    });
    state.currentUser = 'j1';
    state.mode = 'manual'; // the final design shows the entry in its own words first
    state.view = 'queue';
    state.selectedId = 'ox-014';
    state.decisions = {};
    state.audit = [];
    state.sequence = 0;
    return state;
  }

  function getEntry(state, entryId) {
    return state && Array.isArray(state.entries) ? state.entries.find(function (entry) {
      return entry.id === entryId;
    }) : undefined;
  }

  function getReviewStatus(entry, criteria) {
    var eligible = eligibleIds(entry);
    var missing = eligible.filter(function (id) {
      return !validReview(entry.reviews && entry.reviews[id], entry, criteria);
    });
    var completed = eligible.length - missing.length;
    return {
      eligibleAssigned: eligible,
      completed: completed,
      required: REQUIRED_REVIEWS,
      complete: completed >= REQUIRED_REVIEWS,
      conflict: assignedIds(entry).some(function (id) { return conflicts(entry).includes(id); }),
      missing: missing,
      stale: eligible.some(function (id) {
        var review = entry.reviews && entry.reviews[id];
        return !!review && review.submitted === true && review.sourceVersion !== entry.sourceVersion;
      })
    };
  }

  function scoreEntry(entry, criteria) {
    if (!getReviewStatus(entry, criteria).complete) return null;
    var ids = criterionIds(criteria);
    var reviews = currentReviews(entry, criteria);
    var total = reviews.reduce(function (sum, review) {
      return sum + ids.reduce(function (subtotal, id) { return subtotal + review.scores[id]; }, 0);
    }, 0);
    return total / (ids.length * reviews.length);
  }

  function disagreement(entry, criteria) {
    var reviews = currentReviews(entry, criteria);
    if (reviews.length < 2) return [];
    return criterionIds(criteria).map(function (id) {
      var values = reviews.map(function (review) { return review.scores[id]; });
      var min = Math.min.apply(Math, values);
      var max = Math.max.apply(Math, values);
      return { criterion: id, min: min, max: max, spread: max - min };
    }).filter(function (item) { return item.spread >= 3; });
  }

  function blockers(entry, criteria) {
    var reasons = [];
    var status = getReviewStatus(entry, criteria);
    if (!status.complete) reasons.push('Review coverage is incomplete. ' + status.completed + ' of ' + status.required + ' eligible reviews are complete and current.');
    if (status.conflict) reasons.push('A reviewer has a declared conflict. Assign someone else before shortlisting.');
    (Array.isArray(entry.gaps) ? entry.gaps : []).filter(function (gap) {
      return gap.critical === true;
    }).forEach(function (gap) {
      var resolution = entry.gapResolutions && entry.gapResolutions[gap.id];
      if (!resolution || resolution.status !== 'resolved' || !nonblank(resolution.rationale)) {
        reasons.push('Record a resolution for this critical evidence gap: ' + (gap.title || gap.label || gap.id) + '.');
      }
    });
    if (disagreement(entry, criteria).length &&
        !(entry.moderation && entry.moderation.resolved === true && nonblank(entry.moderation.rationale))) {
      reasons.push('The panel must record its moderation of the rating differences.');
    }
    return reasons;
  }

  function rankEntries(entries, criteria) {
    var ranked = entries.map(function (entry, index) {
      return { id: entry.id, score: scoreEntry(entry, criteria), index: index };
    }).filter(function (entry) { return entry.score !== null; }).sort(function (a, b) {
      return b.score - a.score || a.index - b.index;
    });
    return ranked.map(function (entry, index) {
      var rank = index + 1;
      if (index > 0 && Math.abs(entry.score - ranked[index - 1].score) < 1e-10) {
        rank = ranked[index - 1].rank;
      }
      entry.rank = rank;
      return { id: entry.id, score: entry.score, rank: rank };
    });
  }

  function addAudit(state, type, entryId, detail) {
    state.sequence = (Number.isInteger(state.sequence) ? state.sequence : 0) + 1;
    if (!Array.isArray(state.audit)) state.audit = [];
    var event = {
      id: 'event-' + state.sequence,
      sequence: state.sequence,
      type: type,
      entryId: entryId || null,
      detail: detail === undefined ? '' : copy(detail),
      actor: state.currentUser || 'organiser',
      at: new Date().toISOString()
    };
    state.audit.push(event);
    return event;
  }

  function mutationError(state, entryId) {
    if (!getEntry(state, entryId)) return 'This entry could not be found. Return to all entries.';
    if (state.decisions && state.decisions[entryId]) return 'This decision is final. Its review is locked.';
    return null;
  }

  function assignJudge(state, entryId, oldJudge, newJudge, data) {
    var error = mutationError(state, entryId);
    if (error) return { ok: false, error: error };
    var entry = getEntry(state, entryId);
    var assigned = assignedIds(entry);
    if (!assigned.includes(oldJudge)) return { ok: false, error: 'Choose an assigned reviewer to replace.' };
    if (!data || !Array.isArray(data.judges) || !data.judges.some(function (judge) { return judge.id === newJudge; })) {
      return { ok: false, error: 'Choose a reviewer from the list.' };
    }
    if (assigned.includes(newJudge)) return { ok: false, error: 'Choose another reviewer. This reviewer is already assigned.' };
    if (conflicts(entry).includes(newJudge)) return { ok: false, error: 'Choose another reviewer. This reviewer has a conflict with this entry.' };
    entry.assigned = assigned.map(function (id) { return id === oldJudge ? newJudge : id; });
    if (entry.moderation) entry.moderation = Object.assign({}, entry.moderation, { resolved: false });
    addAudit(state, 'judge-assigned', entryId, { previousJudge: oldJudge, judge: newJudge });
    return { ok: true };
  }

  function saveReview(state, entryId, judgeId, review, data) {
    var error = mutationError(state, entryId);
    if (error) return { ok: false, error: error };
    var entry = getEntry(state, entryId);
    if (!assignedIds(entry).includes(judgeId)) return { ok: false, error: 'Only an assigned reviewer can save this review.' };
    if (conflicts(entry).includes(judgeId)) return { ok: false, error: 'Your declared conflict prevents this review. Ask the panel lead to reassign it.' };
    var ids = criterionIds(data && data.criteria);
    if (!ids.length || !review || !review.scores || !ids.every(function (id) { return validScore(review.scores[id]); })) {
      return { ok: false, error: 'Rate every criterion from 1 to 5 before saving. Keep the draft if evidence is missing.' };
    }
    if (!nonblank(review.rationale)) return { ok: false, error: 'Explain your ratings before saving the review.' };
    if (review.sourceVersion !== entry.sourceVersion) return { ok: false, error: 'The submission has changed. Check the current version before saving.' };
    var saved = {
      scores: ids.reduce(function (scores, id) { scores[id] = review.scores[id]; return scores; }, {}),
      rationale: review.rationale.trim(),
      submitted: true,
      sourceVersion: entry.sourceVersion
    };
    if (!entry.reviews) entry.reviews = {};
    var previous = entry.reviews[judgeId] ? copy(entry.reviews[judgeId]) : null;
    entry.reviews[judgeId] = saved;
    // A changed assessment can create a new disagreement; earlier moderation is no longer sufficient.
    if (entry.moderation) entry.moderation = Object.assign({}, entry.moderation, { resolved: false });
    addAudit(state, 'review-submitted', entryId, { judge: judgeId, sourceVersion: entry.sourceVersion, previous: previous, review: copy(saved) });
    return { ok: true };
  }

  function validDate(value) {
    if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
    var date = new Date(value + 'T00:00:00.000Z');
    return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }

  function finalizeDecision(state, entryId, input, data) {
    var error = mutationError(state, entryId);
    if (error) return { ok: false, error: error };
    if (!input || !OUTCOMES.includes(input.outcome)) return { ok: false, error: 'Choose an outcome before saving the decision.' };
    if (!nonblank(input.rationale)) return { ok: false, error: 'Record the reason for this decision.' };
    var needsHandover = input.outcome === 'shortlist' || input.outcome === 'clarify';
    if (needsHandover && (!nonblank(input.owner) || !nonblank(input.nextAction) || !validDate(input.checkpoint))) {
      return { ok: false, error: 'Name an owner and describe the next action. Choose a valid checkpoint date.' };
    }
    if (nonblank(input.checkpoint) && !validDate(input.checkpoint)) {
      return { ok: false, error: 'Choose a valid checkpoint date.' };
    }
    var entry = getEntry(state, entryId);
    if (input.outcome === 'shortlist') {
      var reasons = blockers(entry, data && data.criteria);
      if (reasons.length) return { ok: false, error: reasons.join(' ') };
    }
    var decision = {
      outcome: input.outcome,
      rationale: input.rationale.trim(),
      owner: nonblank(input.owner) ? input.owner.trim() : '',
      nextAction: nonblank(input.nextAction) ? input.nextAction.trim() : '',
      checkpoint: nonblank(input.checkpoint) ? input.checkpoint.trim() : '',
      sourceVersion: entry.sourceVersion,
      author: state.currentUser || 'organiser',
      finalized: true,
      score: scoreEntry(entry, data && data.criteria),
      finalizedAt: new Date().toISOString()
    };
    if (!state.decisions) state.decisions = {};
    state.decisions[entryId] = decision;
    addAudit(state, 'decision-finalized', entryId, copy(decision));
    return { ok: true, decision: copy(decision) };
  }

  return {
    createState: createState,
    getEntry: getEntry,
    getReviewStatus: getReviewStatus,
    scoreEntry: scoreEntry,
    disagreement: disagreement,
    blockers: blockers,
    rankEntries: rankEntries,
    assignJudge: assignJudge,
    saveReview: saveReview,
    finalizeDecision: finalizeDecision,
    addAudit: addAudit
  };
});
