import { useState, useEffect } from "react";

const TRACKER = [["applications", "Applications"], ["deadlines", "Deadlines"], ["analytics", "Analytics"]];

export default function Navbar({ page, name, theme, setTheme, onExport }) {
  const [open, setOpen] = useState(null); // "menu" | "tracker" | "user"
  const toggle = (k) => () => setOpen(open === k ? null : k);

  useEffect(() => setOpen(null), [page]);
  useEffect(() => {
    const close = (e) => !e.target.closest(".dd") && setOpen(null);
    document.addEventListener("click", close);
    return () => document.removeEventListener("click", close);
  }, []);

  const cur = (p) => (page === p ? "page" : undefined);
  return (
    <nav className="nav dd">
      <div className="nav-in">
        <a className="nav-brand" href="#home"><span className="logo">IT</span>InternTrack</a>
        <button className="btn ghost burger" onClick={toggle("menu")} aria-label="Menu" aria-expanded={open === "menu"}>☰</button>
        <div className={"links" + (open === "menu" ? " show" : "")}>
          <a href="#home" aria-current={cur("home")}>Home</a>
          <div className="menu">
            <button onClick={toggle("tracker")} aria-expanded={open === "tracker"}
              aria-current={TRACKER.some(([k]) => k === page) ? "page" : undefined}>Tracker ▾</button>
            {open === "tracker" && (
              <div className="drop">
                {TRACKER.map(([k, l]) => <a key={k} href={"#" + k} aria-current={cur(k)}>{l}</a>)}
              </div>
            )}
          </div>
          <a href="#about" aria-current={cur("about")}>About</a>
          <div className="menu push">
            <button onClick={toggle("user")} aria-expanded={open === "user"}>{name || "Account"} ▾</button>
            {open === "user" && (
              <div className="drop right">
                <a href="#settings">Settings</a>
                <button onClick={onExport}>Export data</button>
                <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>{theme === "dark" ? "Light mode" : "Dark mode"}</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
