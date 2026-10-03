import { useState, useEffect } from "react";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Applications from "./pages/Applications.jsx";
import Deadlines from "./pages/Deadlines.jsx";
import Analytics from "./pages/Analytics.jsx";
import Settings from "./pages/Settings.jsx";
import About from "./pages/About.jsx";
import { KEY, load, save, exportJson } from "./utils";

const read = (k, d) => { try { return localStorage.getItem(KEY + k) ?? d; } catch (e) { return d; } };

export default function App() {
  const [items, setItems] = useState(load);
  const [page, setPage] = useState(() => location.hash.slice(1) || "home");
  const [theme, setTheme] = useState(() => read(":theme", ""));
  const [name, setName] = useState(() => read(":name", ""));

  useEffect(() => save(items), [items]);
  useEffect(() => {
    const onHash = () => { setPage(location.hash.slice(1) || "home"); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);
  useEffect(() => {
    if (theme) document.documentElement.dataset.theme = theme;
    else delete document.documentElement.dataset.theme;
    try { localStorage.setItem(KEY + ":theme", theme); localStorage.setItem(KEY + ":name", name); } catch (e) {}
  }, [theme, name]);

  const pages = {
    home: <Home items={items} name={name} />,
    applications: <Applications items={items} setItems={setItems} />,
    deadlines: <Deadlines items={items} />,
    analytics: <Analytics items={items} />,
    settings: <Settings items={items} setItems={setItems} name={name} setName={setName} theme={theme} setTheme={setTheme} />,
    about: <About />,
  };

  return (
    <>
      <Navbar page={page} name={name} theme={theme} setTheme={setTheme} onExport={() => exportJson(items)} />
      <div className="wrap">{pages[page] || pages.home}</div>
      <footer className="foot-bar">InternTrack · Built with React, CSS and localStorage · Your data never leaves this browser</footer>
    </>
  );
}
