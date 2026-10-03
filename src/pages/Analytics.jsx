import { STAGES } from "../utils";

function Bars({ rows, color }) {
  const max = Math.max(1, ...rows.map((r) => r[1]));
  return (
    <div className="bars">
      {rows.map(([label, n, c]) => (
        <div className="bar" key={label}>
          <span>{label}</span>
          <div><i style={{ width: (n / max) * 100 + "%", background: c || color }} /></div>
          <b>{n}</b>
        </div>
      ))}
    </div>
  );
}

export default function Analytics({ items }) {
  const byStage = STAGES.map((s, i) => [s, items.filter((x) => x.status === i).length, `var(--c${i})`]);
  const months = {};
  items.forEach((i) => { const m = i.appliedOn?.slice(0, 7); if (m) months[m] = (months[m] || 0) + 1; });
  const byMonth = Object.keys(months).sort().slice(-6).map((m) => [new Date(m + "-01T00:00").toLocaleDateString(undefined, { month: "short", year: "2-digit" }), months[m]]);
  const sent = items.filter((i) => i.status >= 1).length;
  const pct = (n) => (sent ? Math.round((100 * n) / sent) + "%" : "–");
  const modes = ["Remote", "Hybrid", "On-site"].map((m) => [m, items.filter((i) => i.mode === m).length]);

  return (
    <>
      <header className="top"><div className="brand"><div><h1>Analytics</h1><small>How your search is going</small></div></div></header>
      {!items.length ? <div className="empty"><h2>No data yet</h2><p>Add some applications to see charts.</p></div> : (
        <>
          <section className="stats">
            {[["Applications sent", sent], ["Reached assessment+", pct(items.filter((i) => i.status >= 2 && i.status <= 4).length)],
              ["Reached interview+", pct(items.filter((i) => i.status === 3 || i.status === 4).length)], ["Offer rate", pct(items.filter((i) => i.status === 4).length)]]
              .map(([l, n]) => <div className="stat" key={l}><b>{n}</b><span>{l}</span></div>)}
          </section>
          <div className="two">
            <div className="stat"><h3>By stage</h3><Bars rows={byStage} /></div>
            <div className="stat"><h3>Applications per month</h3><Bars rows={byMonth} color="var(--accent)" /></div>
            <div className="stat"><h3>By work mode</h3><Bars rows={modes} color="var(--c3)" /></div>
          </div>
        </>
      )}
    </>
  );
}
