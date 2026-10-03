import { STAGES, fmt, daysFrom, chip, DATE_LABEL, eventDate } from "../utils";

const FEATURES = [
  ["Track everything", "Company, role, stipend, deadlines and notes on one card."],
  ["Update in one click", "Move an application from Applied to Assessment to Offer."],
  ["Never miss a deadline", "The Deadlines page shows what is due and what is overdue."],
  ["See your progress", "Analytics show your response rate and activity by month."],
];

export default function Home({ items, name }) {
  const active = items.filter((i) => i.status >= 1 && i.status <= 3).length;
  const next = items.filter((i) => DATE_LABEL[i.status] && eventDate(i) && daysFrom(eventDate(i)) >= 0)
    .sort((a, b) => eventDate(a).localeCompare(eventDate(b)))[0];

  return (
    <>
      <section className="hero">
        <h1>{name ? `Welcome back, ${name}.` : "Your internship search, organised."}</h1>
        <p>
          {items.length
            ? `You are tracking ${items.length} internship${items.length === 1 ? "" : "s"}, with ${active} in progress.`
            : "Add your first application and InternTrack will keep it all in one place."}
          {next && ` Coming up: ${next.company}, ${DATE_LABEL[next.status].replace(":", "")} ${fmt(eventDate(next))}.`}
        </p>
        <div className="acts" style={{ justifyContent: "flex-start" }}>
          <a className="btn pri" href="#applications">Open applications</a>
          <a className="btn" href="#analytics">View analytics</a>
        </div>
      </section>

      <h2 className="sec">What you can do</h2>
      <div className="feat">
        {FEATURES.map(([t, d]) => <div className="stat" key={t}><h3>{t}</h3><span>{d}</span></div>)}
      </div>

      <h2 className="sec">Recent applications</h2>
      {items.length ? (
        <div className="list">
          {items.slice(0, 4).map((i) => (
            <div className="li" key={i.id}>
              <div><b>{i.company}</b><br /><span className="muted">{i.position}</span></div>
              <span className="chip" style={chip(i.status)}>{STAGES[i.status]}</span>
            </div>
          ))}
        </div>
      ) : <div className="empty"><p>Nothing here yet. Head to Applications to add one.</p></div>}
    </>
  );
}
