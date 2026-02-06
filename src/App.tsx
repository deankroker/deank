import { useState, useRef, useEffect } from "react";
import { Trash2 } from "lucide-react";
import { useSharedTerminal } from "./hooks/useSharedTerminal";

const ASCII_ART = `
 ____  _____    _    _   _   _  ______   ___  _  _______ ____
|  _ \\| ____|  / \\  | \\ | | | |/ /  _ \\ / _ \\| |/ / ____|  _ \\
| | | |  _|   / _ \\ |  \\| | | ' /| |_) | | | | ' /|  _| | |_) |
| |_| | |___ / ___ \\| |\\  | | . \\|  _ <| |_| | . \\| |___|  _ <
|____/|_____/_/   \\_\\_| \\_| |_|\\_\\_| \\_\\\\___/|_|\\_\\_____|_| \\_\\
`;

const OBSERVATIONS = `
┌─────────────────────────────────────────────────────────────────┐
│  CLOUDFLARE WORKERS ONBOARDING                    2026-02-05    │
└─────────────────────────────────────────────────────────────────┘

$ cat friction.log

[GITHUB_FLOW]
  - Multiple repos failing to create workers via GitHub integration
  - Build failures with no clear error surfacing
  - Unclear if failures are plan-related or config issues
  - Had to fall back to template selection flow

[TEMPLATE_DISCOVERY]
  - No way to preview template details without switching tabs
  - Would love inline expansion or modal with more info
  - Template selection path itself was intuitive once found

[ONBOARDING_FLOW]
  - Hello world script feels unnecessary for most devs
  - Would prefer free-form creation with AI assistance
  - "Connect with Claude Code" option would be great
  - Static file upload option seems unnecessary

[BUILD_ERRORS]
  - Build failures should bubble up more immediately
  - Currently buried - need to dig to find actual error
  - Overview shows sources but not actionable next steps

[DOMAIN_SETUP]
  - Custom domain connection via Wrangler super intuitive
  - Would benefit from guided setup via skill or MCP server
  - Infrastructure decisions need more hand-holding

[DURABLE_OBJECTS]
  - Had to experiment with creative use case to understand value prop
  - Wow what an awesome primative! 
  - Think docs could be more interactive and show real-world use cases

[WINS]
  + CI pipeline auto-configured - no YAML needed!
  + GitHub flow worked well once template was selected
  + Selection path was intuitive

$ _
`;

const LINKS = [
  { label: "github", url: "https://github.com/deankroker" },
  { label: "linkedin", url: "https://linkedin.com/in/deankroker" },
];

function App() {
  const [activePanel, setActivePanel] = useState<string | null>(null);
  const { segments, you, users, isConnected, appendText, backspace, clearContent } =
    useSharedTerminal(activePanel === "shared");
  const inputRef = useRef<HTMLDivElement>(null);

  const others = users.filter((u) => u.name !== you?.name);

  // Focus the input area when shared panel opens
  useEffect(() => {
    if (activePanel === "shared" && inputRef.current) {
      inputRef.current.focus();
    }
  }, [activePanel]);

  const formatPresence = () => {
    if (!you) return null;

    const youPart = (
      <span style={{ color: you.color }}>You ({you.name.trim()})</span>
    );

    if (others.length === 0) {
      return youPart;
    }

    if (others.length === 1) {
      return (
        <>
          {youPart} and <span style={{ color: others[0].color }}>{others[0].name}</span> are here
        </>
      );
    }

    const lastOther = others[others.length - 1];
    const restOthers = others.slice(0, -1);

    return (
      <>
        {youPart},{" "}
        {restOthers.map((u, i) => (
          <span key={u.name}>
            <span style={{ color: u.color }}>{u.name}</span>
            {i < restOthers.length - 1 ? ", " : ""}
          </span>
        ))}
        , and <span style={{ color: lastOther.color }}>{lastOther.name}</span> are here
      </>
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      backspace();
    } else if (e.key === "Enter") {
      e.preventDefault();
      appendText("\n");
    } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
      e.preventDefault();
      appendText(e.key);
    }
  };

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
            Engineer, designer, and product tinkerer.
            <span className="cursor" />
          </p>
        </div>

        <section className="about">
          <p className="section-header">// what is this</p>
          <p>
            A log of things I'd love to see. Product observations, friction points,
            and ideas from building on the internet.
          </p>
        </section>

        <section className="panels">
          <p className="section-header">// explore</p>
          <div className="panel-grid">
            <button
              className={`panel-box ${activePanel === "observations" ? "active" : ""}`}
              onClick={() => setActivePanel(activePanel === "observations" ? null : "observations")}
            >
              <pre>{`
┌─────────────────────┐
│                     │
│    observations     │
│                     │
└─────────────────────┘`}</pre>
            </button>
            <button
              className={`panel-box ${activePanel === "shared" ? "active" : ""}`}
              onClick={() => setActivePanel(activePanel === "shared" ? null : "shared")}
            >
              <pre>{`
┌─────────────────────┐
│                     │
│    shared space     │
│                     │
└─────────────────────┘`}</pre>
            </button>
          </div>
        </section>

        {activePanel === "observations" && (
          <section className="terminal-output">
            <pre>{OBSERVATIONS}</pre>
          </section>
        )}

        {activePanel === "shared" && (
          <section className="terminal-output shared-terminal">
            <div className="shared-header">
              <div className="shared-status">
                <span className={`status-dot ${isConnected ? "connected" : ""}`} />
                {isConnected && you ? formatPresence() : <span>connecting...</span>}
              </div>
              <button className="clear-btn" onClick={clearContent} title="Clear terminal">
                <Trash2 size={14} />
              </button>
            </div>
            <div
              ref={inputRef}
              className="shared-input"
              tabIndex={0}
              onKeyDown={handleKeyDown}
            >
              {segments.length === 0 ? (
                <span className="placeholder">
                  Start typing... everyone connected will see this in real-time.
                </span>
              ) : (
                segments.map((seg, i) => (
                  <span key={i} style={{ color: seg.color }}>
                    {seg.text}
                  </span>
                ))
              )}
              <span className="input-cursor" style={{ backgroundColor: you?.color }} />
            </div>
          </section>
        )}

        <section className="links">
          <p className="section-header">// links</p>
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
