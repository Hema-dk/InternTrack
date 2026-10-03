import { useState, useMemo } from "react";
import Card from "../components/Card.jsx";
import Form from "../components/Form.jsx";
import DatePrompt from "../components/DatePrompt.jsx";
import { STAGES, blank, uid, today, exportJson, eventDate, normalize, DATE_LABEL } from "../utils";

export default function Applications({ items, setItems }) {
  const [form, setForm] = useState(null);
  const [ask, setAsk] = useState(null); // { id, status } when a date is needed
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState(-1);
  const [sort, setSort] = useState("new");

  const stats = useMemo(() => {
    const applied = items.filter((i) => i.status >= 1).length;
    const responded = items.filter((i) => i.status >= 2 && i.status <= 4).length;
    return {
      total: items.length,
      active: items.filter((i) => i.status >= 1 && i.status <= 3).length,
      interviews: items.filter((i) => i.status === 3).length,
      offers: items.filter((i) => i.status === 4).length,
      rate: applied ? Math.round((100 * responded) / applied) : 0,
    };
  }, [items]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const sorters = {
      new: (a, b) => b.appliedOn.localeCompare(a.appliedOn),
      old: (a, b) => a.appliedOn.localeCompare(b.appliedOn),
      az: (a, b) => a.company.localeCompare(b.company),
      due: (a, b) => (eventDate(a) || "9999").localeCompare(eventDate(b) || "9999"),
    };
    return items
      .filter(
        (i) =>
          (filter < 0 || i.status === filter) &&
          (!s || `${i.company} ${i.position} ${i.location}`.toLowerCase().includes(s))
      )
      .sort(sorters[sort]);
  }, [items, q, filter, sort]);

  const onSave = (v) => {
    setItems(v.id ? items.map((i) => (i.id === v.id ? v : i)) : [{ ...v, id: uid() }, ...items]);
    setForm(null);
  };
  const onStatus = (id, s) => {
    const it = items.find((i) => i.id === id);
    setItems(items.map((i) => (i.id === id ? { ...i, status: s } : i)));
    // Ask for a date if this stage uses one and none is saved yet
    if (it && DATE_LABEL[s] && !eventDate({ ...it, status: s })) setAsk({ id, status: s });
  };
  const saveDate = (date) => {
    setItems(items.map((i) => (i.id === ask.id ? { ...normalize(i), dates: { ...normalize(i).dates, [ask.status]: date } } : i)));
    setAsk(null);
  };
  const onDelete = (it) => {
    if (confirm(`Delete ${it.company} — ${it.position}?`)) setItems(items.filter((i) => i.id !== it.id));
  };

  const loadExamples = () =>
    setItems([
      { ...blank(), id: uid(), company: "Freshworks", position: "Product Engineering Intern", status: 3, location: "Chennai", mode: "Hybrid", stipend: "₹40,000/month", appliedOn: today(), dates: { 3: today() }, notes: "Round 2 with the hiring manager. Revise system design basics." },
      { ...blank(), id: uid(), company: "Zoho", position: "Software Developer Intern", status: 2, location: "Chennai", mode: "On-site", stipend: "₹25,000/month", notes: "Online coding test link in email." },
      { ...blank(), id: uid(), company: "Razorpay", position: "Backend Intern", status: 1, location: "Bengaluru", mode: "Remote" },
    ]);

  const countFor = (i) => (i < 0 ? items.length : items.filter((x) => x.status === i).length);

  const statCards = [
    ["Total tracked", stats.total],
    ["In progress", stats.active],
    ["Interviews", stats.interviews],
    ["Offers", stats.offers],
    ["Response rate", stats.rate + "%"],
  ];

  return (
    <div className="wrap">
      <header className="top">
        <div className="brand"><div><h1>Applications</h1><small>Add, update and track every internship</small></div></div>
        {items.length > 0 && <button className="btn" onClick={() => exportJson(items)}>Export JSON</button>}
        <button className="btn pri" onClick={() => setForm(blank())}>Add internship</button>
      </header>

      <section className="stats">
        {statCards.map(([label, n]) => (
          <div className="stat" key={label}>
            <b>{n}</b>
            <span>{label}</span>
          </div>
        ))}
      </section>

      <div className="tools">
        <input type="search" placeholder="Search company, role or location" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Search" />
        <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort">
          <option value="new">Newest applied</option>
          <option value="old">Oldest applied</option>
          <option value="due">Nearest deadline</option>
          <option value="az">Company A–Z</option>
        </select>
      </div>

      <div className="pills">
        {[-1, 0, 1, 2, 3, 4, 5].map((i) => (
          <button key={i} className="pill" aria-pressed={filter === i} onClick={() => setFilter(i)}>
            {(i < 0 ? "All" : STAGES[i]) + " " + countFor(i)}
          </button>
        ))}
      </div>

      {shown.length ? (
        <main className="grid">
          {shown.map((it) => (
            <Card key={it.id} it={it} onStatus={onStatus} onEdit={setForm} onDelete={onDelete} />
          ))}
        </main>
      ) : (
        <div className="empty">
          <h2>{items.length ? "Nothing matches" : "No internships yet"}</h2>
          <p>
            {items.length
              ? "Try a different search or filter."
              : "Add your first application, or load a few examples to see how it works."}
          </p>
          {!items.length && (
            <div className="acts" style={{ justifyContent: "center" }}>
              <button className="btn" onClick={loadExamples}>Load examples</button>
              <button className="btn pri" onClick={() => setForm(blank())}>Add internship</button>
            </div>
          )}
        </div>
      )}

      {ask && (
        <DatePrompt item={items.find((i) => i.id === ask.id)} status={ask.status} onSave={saveDate} onSkip={() => setAsk(null)} />
      )}

      {form && <Form initial={form} onSave={onSave} onClose={() => setForm(null)} />}
    </div>
  );
}
