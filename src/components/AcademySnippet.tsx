import "@/components/academy-snippet.css";

const AcademySnippet = () => (
  <main className="min-h-screen bg-black flex items-center justify-center overflow-hidden">
    <div className="snippet-frame">
      <div id="og-snippet-container" className="academy-snippet">
        <div className="academy-snippet-copy">
          <p className="academy-snippet-brand">ABSOLUTE MIKHAIL</p>
          <h1>ACADEMY<span>.</span></h1>
          <p className="academy-snippet-heading">От идеи<br />к своей игре.</p>
          <p className="academy-snippet-topics">Unreal Engine · C++<br />Нейросети · Инструменты</p>
          <div className="academy-snippet-footer">
            <p>КУРСЫ / СТАТЬИ / ПРАКТИКА</p>
            <a href="/academy/">gamepunk.ru/academy</a>
          </div>
        </div>
        <div className="academy-snippet-blueprint" aria-hidden="true">
          <svg viewBox="0 0 510 630" fill="none">
            <path d="M287 190 V234 H140 V280 M140 370 V414 H287 V460" stroke="#ff663d" strokeWidth="3" />
            <circle cx="287" cy="190" r="6" fill="#ff663d" />
            <circle cx="140" cy="280" r="6" fill="#ff663d" />
            <circle cx="140" cy="370" r="6" fill="#ff663d" />
            <circle cx="287" cy="460" r="6" fill="#ff663d" />
          </svg>
          <div className="academy-snippet-node academy-snippet-idea"><span>01 / ЗАДАЧА</span><strong>Идея</strong></div>
          <div className="academy-snippet-node academy-snippet-prototype"><span>02 / ЭКСПЕРИМЕНТ</span><strong>Прототип</strong></div>
          <div className="academy-snippet-node academy-snippet-game"><span>03 / ТВОЙ ПРОЕКТ</span><strong>Игра ↗</strong></div>
        </div>
      </div>
    </div>
  </main>
);

export default AcademySnippet;
