import { STAGES, PATH, fmt, daysFrom, DATE_LABEL, eventDate } from "../utils";

export default function Card({ it, onStatus, onEdit, onDelete }) {
  const rejected = it.status === 5;
  const idx = PATH.indexOf(it.status);
  const label = DATE_LABEL[it.status];
  const date = label ? eventDate(it) : "";
  const dl = date ? daysFrom(date) : null;
  const when = dl === null ? "" : dl < 0 ? " · passed" : dl === 0 ? " · today" : ` · in ${dl} day${dl === 1 ? "" : "s"}`;
  const next = it.status < 4 ? it.status + 1 : null;

  return (
    <article className="card" style={{ "--sc": `var(--c${it.status})` }}>
      <div className="row">
        <h3>{it.company}</h3>
        <select
          className="stsel"
          value={it.status}
          aria-label={`Status for ${it.company}`}
          onChange={(e) => onStatus(it.id, +e.target.value)}
        >
          {STAGES.map((s, i) => (
            <option key={s} value={i} style={{ color: "#000" }}>{s}</option>
          ))}
        </select>
      </div>

      <div className="role">{it.position}</div>

      <div className="steps" aria-hidden="true">
        {PATH.map((p, i) => (
          <i key={p} className={!rejected && it.status > 0 && i <= idx ? "on" : ""} />
        ))}
      </div>

      <div className="meta">
        {it.appliedOn && <span>Applied {fmt(it.appliedOn)}</span>}
        {it.location && <span>{it.location} ({it.mode})</span>}
        {it.stipend && <span>{it.stipend}</span>}
        {date && <span className={dl <= 3 ? "warn" : ""}>{label} {fmt(date)}{when}</span>}
        {label && !date && <span>No date set (use Edit)</span>}
      </div>

      {it.notes && <div className="note">{it.notes}</div>}

      <div className="foot">
        {next && (
          <button className="btn" onClick={() => onStatus(it.id, next)}>Move to {STAGES[next]}</button>
        )}
        <span className="sp" />
        {it.link && (
          <a className="btn ghost" href={it.link} target="_blank" rel="noopener noreferrer">Posting</a>
        )}
        <button className="btn ghost" onClick={() => onEdit(it)}>Edit</button>
        <button className="btn ghost" onClick={() => onDelete(it)}>Delete</button>
      </div>
    </article>
  );
}
