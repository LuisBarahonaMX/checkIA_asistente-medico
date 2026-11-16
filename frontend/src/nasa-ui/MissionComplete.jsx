import React from 'react';
import './mission-ui.css';

export default function MissionComplete({ open, onContinue }) {
  if (!open) return null;
  return (
    <div className="mission-complete" role="dialog" aria-modal="true" aria-labelledby="mission-complete-title">
      <div className="mission-complete-panel">
        <div className="mission-check" aria-hidden="true">✓</div>
        <h2 id="mission-complete-title">ASSESSMENT COMPLETE</h2>
        <p>All 50 questions have been recorded.</p>
        <p>Proceed to review the health assessment summary.</p>
        <button type="button" onClick={onContinue}>VIEW ASSESSMENT SUMMARY</button>
      </div>
    </div>
  );
}
