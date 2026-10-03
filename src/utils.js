// Constants, helpers and localStorage functions shared across the app

export const KEY = "interntrack:v1";
export const STAGES = ["Wishlist", "Applied", "Assessment", "Interview", "Offer", "Rejected"];
export const PATH = [1, 2, 3, 4]; // Applied -> Offer (used for the progress bar)
export const MODES = ["Remote", "Hybrid", "On-site"];

export const today = () => new Date().toISOString().slice(0, 10);
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 6);

export const fmt = (d) =>
  d ? new Date(d + "T00:00").toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "";

export const daysFrom = (d) => Math.round((new Date(d + "T00:00") - new Date(today() + "T00:00")) / 864e5);

export function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || []; } catch (e) { return []; }
}

export function save(v) {
  try { localStorage.setItem(KEY, JSON.stringify(v)); } catch (e) {}
}

export const blank = () => ({
  company: "", position: "", status: 1, appliedOn: today(),
  location: "", mode: "Remote", stipend: "", link: "", notes: "", dates: {}
});

export function exportJson(items) {
  const a = document.createElement("a");
  a.href = "data:application/json;charset=utf-8," + encodeURIComponent(JSON.stringify(items, null, 2));
  a.download = "interntrack-export.json";
  a.click();
}

export const chip = (s) => ({ background: `var(--c${s})` });

// Each stage has its own date. Only Wishlist, Assessment and Interview use one.
export const DATE_LABEL = { 0: "Deadline:", 2: "Assessment on", 3: "Interview on" };
export const DATE_FIELD = { 0: "Application deadline", 2: "Assessment date", 3: "Interview date" };
export const eventDate = (it) => (it.dates ? it.dates[it.status] : DATE_LABEL[it.status] ? it.deadline : "") || "";
export const normalize = (it) => ({ ...it, dates: it.dates || (it.deadline ? { [it.status]: it.deadline } : {}) });
