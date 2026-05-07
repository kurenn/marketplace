// Root app — production. Locks in the defaults: manifesto direction,
// warm-paper palette, text hero, regular density, list layout, serif-sans type.
// (The handoff Tweaks panel is omitted from production traffic.)

function App() {
  return (
    <>
      <Nav />
      <Hero variant="text" />
      <Manifesto density="regular" />
      <WorkflowDiagram />
      <ToolsSection />
      <CodeDemo />
      <About />
      <Install />
      <FAQ />
      <Footer />
    </>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);
