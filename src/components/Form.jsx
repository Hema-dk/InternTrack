import { useState } from "react";
import { STAGES, MODES, DATE_FIELD, normalize } from "../utils";

function Field({ label, wide, children }) {
  return (
    <label className={wide ? "w" : ""}>
      {label}
      {children}
    </label>
  );
}

export default function Form({ initial, onSave, onClose }) {
  const [v, setV] = useState(normalize(initial));
  const set = (k) => (e) => setV({ ...v, [k]: e.target.value });
  const editing = Boolean(initial.id);

  return (
    <div className="ov" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <form
        className="modal"
        role="dialog"
        aria-modal="true"
        onSubmit={(e) => {
          e.preventDefault();
          onSave({ ...v, status: +v.status });
        }}
      >
        <h2>{editing ? "Edit internship" : "Add internship"}</h2>

        <div className="f">
          <Field label="Company *">
            <input value={v.company} onChange={set("company")} required autoFocus placeholder="e.g. Zoho" />
          </Field>
          <Field label="Position *">
            <input value={v.position} onChange={set("position")} required placeholder="e.g. SDE Intern" />
          </Field>
          <Field label="Status">
            <select value={v.status} onChange={set("status")}>
              {STAGES.map((s, i) => (
                <option key={s} value={i}>{s}</option>
              ))}
            </select>
          </Field>
          <Field label="Application date">
            <input type="date" value={v.appliedOn} onChange={set("appliedOn")} />
          </Field>
          {DATE_FIELD[v.status] && (
            <Field label={DATE_FIELD[v.status]}>
              <input type="date" value={(v.dates || {})[v.status] || ""}
                onChange={(e) => setV({ ...v, dates: { ...v.dates, [v.status]: e.target.value } })} />
            </Field>
          )}
          <Field label="Stipend">
            <input value={v.stipend} onChange={set("stipend")} placeholder="e.g. ₹25,000/month" />
          </Field>
          <Field label="Location">
            <input value={v.location} onChange={set("location")} placeholder="e.g. Chennai" />
          </Field>
          <Field label="Work mode">
            <select value={v.mode} onChange={set("mode")}>
              {MODES.map((m) => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </Field>
          <Field label="Posting link" wide>
            <input type="url" value={v.link} onChange={set("link")} placeholder="https://" />
          </Field>
          <Field label="Notes" wide>
            <textarea rows={3} value={v.notes} onChange={set("notes")} placeholder="Recruiter name, prep topics, assessment date…" />
          </Field>
        </div>

        <div className="acts">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button type="submit" className="btn pri">{editing ? "Save changes" : "Add internship"}</button>
        </div>
      </form>
    </div>
  );
}
