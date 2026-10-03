const STEPS = ["Add an internship from the Applications page.", "Change its stage as things progress: Applied, Assessment, Interview, Offer.",
  "Check Deadlines each week and Analytics to see what is working.", "Export a backup from Settings now and then."];

export default function About() {
  return (
    <>
      <section className="hero"><h1>About InternTrack</h1>
        <p>A simple, private internship tracker. No accounts, no servers: everything is saved in your browser with localStorage.</p></section>
      <div className="two">
        <div className="stat"><h3>How to use it</h3><ol>{STEPS.map((s) => <li key={s}>{s}</li>)}</ol></div>
        <div className="stat"><h3>Built with</h3><ul><li>React 18 with JSX, split into components</li><li>Vite for development and builds</li><li>Plain CSS with light and dark themes</li><li>localStorage for saving data</li></ul></div>
      </div>
    </>
  );
}
