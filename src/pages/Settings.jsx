import { useRef } from "react";
import { exportJson, uid } from "../utils";

export default function Settings({ items, setItems, name, setName, theme, setTheme }) {
  const file = useRef();
  const onImport = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const r = new FileReader();
    r.onload = () => {
      try {
        const data = JSON.parse(r.result);
        if (!Array.isArray(data)) throw new Error();
        const ids = new Set(items.map((i) => i.id));
        setItems([...items, ...data.filter((d) => d.company && d.position).map((d) => ({ ...d, id: ids.has(d.id) || !d.id ? uid() : d.id }))]);
        alert("Import complete.");
      } catch (err) { alert("That file is not a valid InternTrack export."); }
    };
    r.readAsText(f);
    e.target.value = "";
  };

  return (
    <>
      <header className="top"><div className="brand"><div><h1>Settings</h1><small>Profile, appearance and your data</small></div></div></header>
      <div className="two">
        <div className="stat"><h3>Profile</h3>
          <div className="f"><label className="w">Your name<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Shown on the Home page" /></label></div></div>
        <div className="stat"><h3>Appearance</h3>
          <div className="f"><label className="w">Theme
            <select value={theme} onChange={(e) => setTheme(e.target.value)}>
              <option value="">Match my device</option><option value="light">Light</option><option value="dark">Dark</option>
            </select></label></div></div>
        <div className="stat"><h3>Your data</h3>
          <p className="muted">{items.length} internship(s) stored in this browser.</p>
          <div className="acts" style={{ justifyContent: "flex-start", flexWrap: "wrap" }}>
            <button className="btn" onClick={() => exportJson(items)} disabled={!items.length}>Export JSON</button>
            <button className="btn" onClick={() => file.current.click()}>Import JSON</button>
            <button className="btn" style={{ color: "var(--c5)" }} disabled={!items.length}
              onClick={() => confirm("Delete ALL internships? This cannot be undone.") && setItems([])}>Delete all</button>
            <input ref={file} type="file" accept="application/json" hidden onChange={onImport} />
          </div></div>
      </div>
    </>
  );
}
