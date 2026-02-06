const ASCII_ART = `
 ____  _____    _    _   _   _  ______   ___  _  _______ ____
|  _ \\| ____|  / \\  | \\ | | | |/ /  _ \\ / _ \\| |/ / ____|  _ \\
| | | |  _|   / _ \\ |  \\| | | ' /| |_) | | | | ' /|  _| | |_) |
| |_| | |___ / ___ \\| |\\  | | . \\|  _ <| |_| | . \\| |___|  _ <
|____/|_____/_/   \\_\\_| \\_| |_|\\_\\_| \\_\\\\___/|_|\\_\\_____|_| \\_\\
`;

const LINKS = [
  { label: "github", url: "https://github.com/deankroker" },
  { label: "linkedin", url: "https://linkedin.com/in/deankroker" },
];

function App() {
  return (
    <div className="container">
      <header>
        <pre className="ascii-header">{ASCII_ART}</pre>
      </header>

      <main>
        <div className="intro">
          <p>
            <span className="prompt">$</span> whoami
          </p>
          <p>
            Software engineer. Building things on the internet.
            <span className="cursor" />
          </p>
        </div>

        <section className="links">
          <p className="links-header">// links</p>
          <ul className="links-list">
            {LINKS.map((link) => (
              <li key={link.label}>
                <a href={link.url} target="_blank" rel="noopener noreferrer">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </section>
      </main>

      <footer className="footer">
        <p>$ uptime</p>
        <div className="status">
          <span>cloudflare workers</span>
          <span>react</span>
          <span>typescript</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
