import { useState } from "react";
import { STAGES, DATE_FIELD } from "../utils";

// Small popup shown when an application moves to a stage that needs a date
export default function DatePrompt({ item, status, onSave, onSkip }) {
  const [date, setDate] = useState("");
  return (
    <div className="ov" onMouseDown={(e) => e.target === e.currentTarget && onSkip()}>
      <form
        className="modal"
        style={{ maxWidth: 400 }}
        role="dialog"
        aria-modal="true"
        onSubmit={(e) => { e.preventDefault(); if (date) onSave(date); }}
      >
        <h2>Moved to {STAGES[status]}</h2>
        <p className="muted" style={{ marginTop: -6 }}>{item.company} · {item.position}</p>
        <div className="f">
          <label className="w">
            {DATE_FIELD[status]}
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} autoFocus />
          </label>
        </div>
        <div className="acts">
          <button type="button" className="btn" onClick={onSkip}>Skip for now</button>
          <button type="submit" className="btn pri" disabled={!date}>Save date</button>
        </div>
      </form>
    </div>
  );
}
