import { STAGES, fmt, daysFrom, chip, DATE_LABEL, eventDate } from "../utils";

export default function Deadlines({ items }) {
  const list = items.filter((i) => DATE_LABEL[i.status] && eventDate(i))
    .map((i) => ({ ...i, date: eventDate(i), d: daysFrom(eventDate(i)) })).sort((a, b) => a.d - b.d);
  const groups = [
    ["Passed", list.filter((i) => i.d < 0)],
    ["This week", list.filter((i) => i.d >= 0 && i.d <= 7)],
    ["Later", list.filter((i) => i.d > 7)],
  ];

  return (
    <>
      <header className="top"><div className="brand"><div><h1>Deadlines</h1><small>Deadlines, assessments and interviews for your current stage, soonest first</small></div></div></header>
      {!list.length && <div className="empty"><h2>Nothing scheduled</h2><p>Dates show up here for Wishlist, Assessment and Interview applications. Add one with Edit.</p></div>}
      {groups.map(([title, rows]) => rows.length > 0 && (
        <section key={title}>
          <h2 className="sec">{title} ({rows.length})</h2>
          <div className="list">
            {rows.map((i) => (
              <div className="li" key={i.id}>
                <div><b>{i.company}</b> · {i.position}<br />
                  <span className={i.d >= 0 && i.d <= 3 ? "warn" : "muted"}>{DATE_LABEL[i.status]} {fmt(i.date)} · {i.d < 0 ? `${-i.d} day(s) ago` : i.d === 0 ? "today" : `in ${i.d} day(s)`}</span></div>
                <span className="chip" style={chip(i.status)}>{STAGES[i.status]}</span>
              </div>
            ))}
          </div>
        </section>
      ))}
    </>
  );
}
