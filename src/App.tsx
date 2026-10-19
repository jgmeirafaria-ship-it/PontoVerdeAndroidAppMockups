import { useState } from "react";

type Screen =
  | "permissions"
  | "camera"
  | "result"
  | "map"
  | "profile"
  | "report"
  | "confirmation";

type IconProps = {
  name: string;
  className?: string;
  filled?: boolean;
};

const bottlePhoto =
  "https://images.unsplash.com/photo-1731342484101-c91e0cc1971f?crop=entropy&cs=tinysrgb&fit=crop&fm=jpg&q=84&w=1080";

function Icon({ name, className = "", filled = false }: IconProps) {
  return (
    <span
      aria-hidden="true"
      className={`material-symbols-outlined ${filled ? "icon-filled" : ""} ${className}`}
    >
      {name}
    </span>
  );
}

function StatusBar({ dark = false }: { dark?: boolean }) {
  return (
    <div className={`status-bar ${dark ? "status-bar-dark" : ""}`}>
      <span>09:41</span>
      <div className="status-icons">
        <Icon name="signal_cellular_alt" />
        <Icon name="wifi" />
        <Icon name="battery_full" />
      </div>
    </div>
  );
}

function AppButton({
  children,
  onClick,
  variant = "primary",
  icon,
  disabled = false,
}: {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "text";
  icon?: string;
  disabled?: boolean;
}) {
  return (
    <button
      className={`app-button app-button-${variant}`}
      onClick={onClick}
      type="button"
      disabled={disabled}
    >
      {icon && <Icon name={icon} />}
      <span>{children}</span>
    </button>
  );
}

const navItems = [
  { screen: "camera" as Screen, label: "Câmara", icon: "photo_camera" },
  { screen: "map" as Screen, label: "Mapa", icon: "map" },
  { screen: "profile" as Screen, label: "Perfil", icon: "person" },
  { screen: "report" as Screen, label: "Reportar", icon: "campaign" },
];

function BottomNav({
  active,
  onNavigate,
}: {
  active: Screen;
  onNavigate: (screen: Screen) => void;
}) {
  return (
    <nav className="bottom-nav" aria-label="Navegação principal">
      {navItems.map((item) => {
        const isActive = active === item.screen || (active === "result" && item.screen === "camera");
        return (
          <button
            className={`nav-item ${isActive ? "nav-item-active" : ""}`}
            key={item.screen}
            onClick={() => onNavigate(item.screen)}
            type="button"
          >
            <span className="nav-icon">
              <Icon name={item.icon} filled={isActive} />
            </span>
            <span>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

function TopBar({
  title,
  eyebrow,
  onBack,
}: {
  title: string;
  eyebrow?: string;
  onBack?: () => void;
}) {
  return (
    <header className="top-bar">
      {onBack && (
        <button className="icon-button" onClick={onBack} aria-label="Voltar" type="button">
          <Icon name="arrow_back" />
        </button>
      )}
      <div>
        {eyebrow && <p className="eyebrow">{eyebrow}</p>}
        <h1>{title}</h1>
      </div>
      <div className="brand-mark" aria-label="PontoVerde">
        <Icon name="eco" filled />
      </div>
    </header>
  );
}

function PermissionsScreen({ onAllow }: { onAllow: () => void }) {
  return (
    <div className="screen permissions-screen">
      <div className="welcome-hero">
        <StatusBar dark />
        <div className="welcome-header">
          <div className="permissions-brand">
            <div className="brand-logo">
              <Icon name="recycling" />
            </div>
            <span>PontoVerde</span>
          </div>
          <span className="ods-pill">ODS 11</span>
        </div>
        <div className="welcome-copy">
          <p>Separa melhor. Vive mais verde.</p>
          <h1>O ecoponto certo, sempre à mão.</h1>
        </div>
        <div className="recycling-scene" aria-hidden="true">
          <div className="scene-orbit orbit-one" />
          <div className="scene-orbit orbit-two" />
          <div className="scene-center">
            <Icon name="recycling" />
          </div>
          <div className="scene-card scene-camera">
            <Icon name="photo_camera" />
            <span>Identifica</span>
          </div>
          <div className="scene-card scene-location">
            <Icon name="location_on" filled />
            <span>Encontra</span>
          </div>
          <div className="scene-bin bin-yellow"><Icon name="local_drink" /></div>
          <div className="scene-bin bin-blue"><Icon name="description" /></div>
          <div className="scene-bin bin-green"><Icon name="wine_bar" /></div>
        </div>
      </div>
      <main className="permissions-panel">
        <div className="panel-handle" />
        <div className="permissions-copy">
          <h2>Vamos começar?</h2>
          <p>
            Para te dar a melhor indicação, a PontoVerde precisa de duas permissões.
          </p>
        </div>
        <div className="permission-list">
          <div className="permission-row">
            <span className="permission-icon">
              <Icon name="photo_camera" />
            </span>
            <div>
              <strong>Câmara</strong>
              <span>Identificar objetos</span>
            </div>
            <Icon name="check_circle" filled />
          </div>
          <div className="permission-row">
            <span className="permission-icon">
              <Icon name="location_on" />
            </span>
            <div>
              <strong>Localização</strong>
              <span>Encontrar ecopontos</span>
            </div>
            <Icon name="check_circle" filled />
          </div>
        </div>
        <AppButton onClick={onAllow} icon="arrow_forward">
          Começar agora
        </AppButton>
        <p className="privacy-note">
          Podes alterar estas permissões a qualquer momento.
        </p>
      </main>
    </div>
  );
}

function CameraScreen({
  onCapture,
  onNavigate,
}: {
  onCapture: () => void;
  onNavigate: (screen: Screen) => void;
}) {
  const [flash, setFlash] = useState(false);

  return (
    <div className="screen camera-screen">
      <div className="camera-preview">
        <img src={bottlePhoto} alt="Pré-visualização da câmara com garrafas de plástico" />
        <div className="camera-overlay" />
        <StatusBar dark />
        <div className="camera-header">
          <div className="camera-brand">
            <Icon name="recycling" />
            <span>PontoVerde</span>
          </div>
          <button
            className={`glass-icon-button ${flash ? "is-on" : ""}`}
            onClick={() => setFlash(!flash)}
            aria-label="Ativar ou desativar flash"
            type="button"
          >
            <Icon name={flash ? "flash_on" : "flash_off"} />
          </button>
        </div>
        <div className="camera-guide">
          <p>Aponta para o objeto</p>
          <span>Mantém o objeto dentro da moldura</span>
          <div className="focus-frame">
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>
        <div className="camera-controls">
          <button className="gallery-button" type="button" aria-label="Abrir galeria">
            <img src={bottlePhoto} alt="" />
            <Icon name="photo_library" />
          </button>
          <button className="capture-button" onClick={onCapture} type="button" aria-label="Capturar">
            <span />
          </button>
          <div className="control-spacer" />
        </div>
      </div>
      <BottomNav active="camera" onNavigate={onNavigate} />
    </div>
  );
}

function ResultScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div className="screen standard-screen">
      <StatusBar />
      <TopBar title="Resultado" onBack={() => onNavigate("camera")} />
      <main className="scroll-content result-content">
        <div className="result-photo">
          <img src={bottlePhoto} alt="Garrafa de plástico identificada" />
          <span className="image-badge">
            <Icon name="auto_awesome" filled />
            Identificado
          </span>
        </div>
        <section className="result-card">
          <div className="result-heading">
            <div>
              <span className="waste-chip waste-yellow">
                <Icon name="delete_outline" />
                Ecoponto amarelo
              </span>
              <h2>Garrafa de plástico</h2>
            </div>
            <div className="confidence">
              <strong>96%</strong>
              <span>confiança</span>
            </div>
          </div>
          <div className="deposit-section">
            <h3>Como depositar</h3>
            <div className="steps">
              {[
                ["water_drop", "Esvazia", "Retira todo o conteúdo"],
                ["compress", "Espalma", "Ocupa menos espaço"],
                ["recycling", "Deposita", "Sem tampa, no amarelo"],
              ].map(([icon, title, detail], index) => (
                <div className="step" key={title}>
                  <span className="step-number">{index + 1}</span>
                  <span className="step-icon">
                    <Icon name={icon} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <span>{detail}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="result-actions">
          <AppButton onClick={() => onNavigate("map")} icon="near_me">
            Ver ecoponto mais próximo
          </AppButton>
          <AppButton variant="secondary" icon="bookmark_add">
            Guardar no histórico
          </AppButton>
          <button className="retry-link" onClick={() => onNavigate("camera")} type="button">
            Não é isto? <strong>Tentar outra vez</strong>
          </button>
        </div>
      </main>
      <BottomNav active="result" onNavigate={onNavigate} />
    </div>
  );
}

const markerData = [
  { color: "marker-yellow", icon: "delete_outline", left: "68%", top: "25%" },
  { color: "marker-blue", icon: "delete_outline", left: "20%", top: "36%" },
  { color: "marker-green", icon: "delete_outline", left: "74%", top: "52%" },
  { color: "marker-red", icon: "battery_alert", left: "29%", top: "65%" },
  { color: "marker-orange", icon: "recycling", left: "84%", top: "69%" },
];

function MapScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [filter, setFilter] = useState("Amarelo");
  const filters = [
    ["Amarelo", "filter-yellow"],
    ["Azul", "filter-blue"],
    ["Verde", "filter-green"],
    ["Pilhão", "filter-red"],
    ["Ecocentro", "filter-orange"],
  ];

  return (
    <div className="screen map-screen">
      <div className="map-canvas">
        <StatusBar />
        <div className="map-top">
          <div className="map-search">
            <Icon name="search" />
            <span>Ecopontos perto de ti</span>
            <button type="button" aria-label="Centra o mapa">
              <Icon name="my_location" />
            </button>
          </div>
          <div className="filter-row">
            {filters.map(([label, color]) => (
              <button
                type="button"
                className={`filter-chip ${filter === label ? "selected" : ""}`}
                key={label}
                onClick={() => setFilter(label)}
              >
                <span className={`filter-dot ${color}`} />
                {label}
              </button>
            ))}
          </div>
        </div>
        <div className="map-grid" aria-label="Mapa com ecopontos próximos">
          <div className="park park-one">
            <Icon name="park" />
          </div>
          <div className="park park-two" />
          <span className="street street-one">Av. da Liberdade</span>
          <span className="street street-two">Rua do Sol</span>
          <span className="street street-three">Praça Verde</span>
          <svg className="map-route" viewBox="0 0 412 500" aria-hidden="true">
            <path d="M108 355 C128 312, 145 300, 173 294 S232 282, 250 244 S278 204, 304 190" />
          </svg>
          <div className="user-marker" aria-label="A tua localização">
            <span />
          </div>
          {markerData.map((marker, index) => (
            <div
              className={`map-marker ${marker.color}`}
              style={{ left: marker.left, top: marker.top }}
              key={index}
            >
              <Icon name={marker.icon} />
            </div>
          ))}
          <button className="map-location-button" type="button" aria-label="Mostrar localização">
            <Icon name="my_location" />
          </button>
        </div>
        <section className="map-sheet">
          <div className="sheet-handle" />
          <div className="sheet-label">
            <span className="waste-chip waste-yellow">Mais próximo</span>
            <span className="open-label">
              <i />
              Disponível
            </span>
          </div>
          <div className="location-title">
            <div>
              <h2>Rua Alexandre Herculano</h2>
              <p>Ecoponto junto ao n.º 42</p>
            </div>
            <span className="yellow-bin">
              <Icon name="delete_outline" />
            </span>
          </div>
          <div className="distance-row">
            <div>
              <Icon name="distance" />
              <strong>120 m</strong>
              <span>de distância</span>
            </div>
            <i />
            <div>
              <Icon name="directions_walk" />
              <strong>2 min</strong>
              <span>a pé</span>
            </div>
          </div>
          <div className="sheet-actions">
            <AppButton icon="near_me">Iniciar rota</AppButton>
            <AppButton variant="secondary" icon="report_problem" onClick={() => onNavigate("report")}>
              Sinalizar problema
            </AppButton>
          </div>
        </section>
      </div>
      <BottomNav active="map" onNavigate={onNavigate} />
    </div>
  );
}

const historyItems = [
  {
    icon: "local_drink",
    color: "item-yellow",
    name: "Garrafa de plástico",
    bin: "Ecoponto amarelo",
    date: "Hoje, 09:42",
  },
  {
    icon: "description",
    color: "item-blue",
    name: "Caixa de cereais",
    bin: "Ecoponto azul",
    date: "Ontem, 18:15",
  },
  {
    icon: "wine_bar",
    color: "item-green",
    name: "Frasco de vidro",
    bin: "Ecoponto verde",
    date: "12 jun., 13:08",
  },
  {
    icon: "battery_5_bar",
    color: "item-red",
    name: "Pilha AA",
    bin: "Pilhão",
    date: "9 jun., 17:30",
  },
];

function ProfileScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [view, setView] = useState<"records" | "empty">("records");

  return (
    <div className="screen standard-screen">
      <StatusBar />
      <TopBar title="Perfil" eyebrow="A tua conta" />
      <main className="scroll-content history-content">
        <section className="profile-card">
          <div className="profile-avatar">
            <span>MS</span>
            <i><Icon name="eco" filled /></i>
          </div>
          <div className="profile-copy">
            <h2>Maria Silva</h2>
            <p>Lisboa · Recicladora desde junho</p>
            <span className="profile-level">
              <Icon name="workspace_premium" filled />
              Nível 3 · Guardiã Verde
            </span>
          </div>
          <button className="profile-settings" type="button" aria-label="Definições do perfil">
            <Icon name="settings" />
          </button>
        </section>
        <section className="impact-card">
          <div className="impact-head">
            <div>
              <span>Em junho</span>
              <h2>Reciclaste <strong>24 objetos</strong> este mês</h2>
            </div>
            <div className="impact-badge">
              <Icon name="trending_up" />
              18%
            </div>
          </div>
          <div className="mini-chart" aria-label="Gráfico de objetos reciclados por ecoponto">
            {[
              ["12", "Amarelo", "bar-yellow", "86%"],
              ["7", "Azul", "bar-blue", "58%"],
              ["4", "Vidro", "bar-green", "38%"],
              ["1", "Pilhão", "bar-red", "18%"],
            ].map(([value, label, color, height]) => (
              <div className="chart-column" key={label}>
                <span>{value}</span>
                <div className="bar-track">
                  <i className={color} style={{ height }} />
                </div>
                <small>{label}</small>
              </div>
            ))}
          </div>
        </section>
        <div className="history-heading">
          <div>
            <h2>Atividade recente</h2>
            <p>Os teus últimos objetos identificados</p>
          </div>
          <button
            className="empty-toggle"
            type="button"
            onClick={() => setView(view === "records" ? "empty" : "records")}
          >
            {view === "records" ? "Ver vazio" : "Ver registos"}
          </button>
        </div>
        {view === "records" ? (
          <div className="history-list">
            {historyItems.map((item) => (
              <article className="history-item" key={item.name}>
                <span className={`history-icon ${item.color}`}>
                  <Icon name={item.icon} />
                </span>
                <div>
                  <h3>{item.name}</h3>
                  <p>{item.bin}</p>
                </div>
                <time>{item.date}</time>
              </article>
            ))}
          </div>
        ) : (
          <section className="empty-state">
            <div className="empty-illustration">
              <Icon name="recycling" />
              <span className="empty-bottle">
                <Icon name="local_drink" />
              </span>
              <span className="empty-paper">
                <Icon name="description" />
              </span>
            </div>
            <h2>Ainda não reciclaste nada</h2>
            <p>Identifica o teu primeiro objeto e começa a acompanhar o teu impacto.</p>
            <AppButton onClick={() => onNavigate("camera")} icon="photo_camera">
              Abrir câmara
            </AppButton>
          </section>
        )}
      </main>
      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}

function MiniMap() {
  return (
    <div className="mini-map">
      <div className="mini-road mini-road-one" />
      <div className="mini-road mini-road-two" />
      <div className="mini-location">
        <Icon name="location_on" filled />
      </div>
      <div className="mini-map-label">
        <Icon name="my_location" />
        <div>
          <strong>Rua Alexandre Herculano</strong>
          <span>Localização atual · Lisboa</span>
        </div>
      </div>
    </div>
  );
}

function ReportScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [problem, setProblem] = useState("Cheio");
  const [description, setDescription] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const problems = [
    ["Cheio", "delete_sweep"],
    ["Danificado", "handyman"],
    ["Sujo", "cleaning_services"],
    ["Em falta", "location_off"],
  ];

  return (
    <div className="screen standard-screen">
      <StatusBar />
      <TopBar title="Sinalizar ecoponto" eyebrow="Ajuda a tua comunidade" />
      <main className="scroll-content report-content">
        <section>
          <div className="section-heading">
            <span>1</span>
            <div>
              <h2>Confirma a localização</h2>
              <p>Detetámos o ecoponto mais próximo</p>
            </div>
          </div>
          <MiniMap />
        </section>
        <section>
          <div className="section-heading">
            <span>2</span>
            <div>
              <h2>Qual é o problema?</h2>
              <p>Seleciona uma opção</p>
            </div>
          </div>
          <div className="problem-grid">
            {problems.map(([label, icon]) => (
              <button
                className={`problem-chip ${problem === label ? "selected" : ""}`}
                type="button"
                key={label}
                onClick={() => setProblem(label)}
              >
                <Icon name={icon} />
                <span>{label}</span>
                {problem === label && <Icon name="check_circle" filled />}
              </button>
            ))}
          </div>
        </section>
        <section>
          <div className="field-label">
            <label htmlFor="description">Descrição</label>
            <span>Opcional</span>
          </div>
          <textarea
            id="description"
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            placeholder="Acrescenta detalhes que nos possam ajudar..."
            maxLength={180}
          />
          <div className="character-count">{description.length}/180</div>
        </section>
        <button
          className={`photo-upload ${hasPhoto ? "has-photo" : ""}`}
          type="button"
          onClick={() => setHasPhoto(!hasPhoto)}
        >
          {hasPhoto ? (
            <>
              <img src={bottlePhoto} alt="Fotografia adicionada à sinalização" />
              <span>
                <strong>Fotografia adicionada</strong>
                <small>Toca para remover</small>
              </span>
              <Icon name="check_circle" filled />
            </>
          ) : (
            <>
              <span className="upload-icon">
                <Icon name="add_a_photo" />
              </span>
              <span>
                <strong>Adicionar fotografia</strong>
                <small>Ajuda-nos a resolver mais depressa</small>
              </span>
              <Icon name="chevron_right" />
            </>
          )}
        </button>
        <AppButton onClick={() => onNavigate("confirmation")} icon="send">
          Enviar sinalização
        </AppButton>
        <p className="report-note">
          A tua sinalização será partilhada com a entidade responsável pela recolha.
        </p>
      </main>
      <BottomNav active="report" onNavigate={onNavigate} />
    </div>
  );
}

function ConfirmationScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div className="screen confirmation-screen">
      <StatusBar />
      <main>
        <div className="success-illustration">
          <div className="success-ring">
            <Icon name="check" />
          </div>
          <span className="success-spark spark-one" />
          <span className="success-spark spark-two" />
          <span className="success-spark spark-three" />
        </div>
        <span className="success-kicker">Sinalização enviada</span>
        <h1>Obrigado!</h1>
        <p>
          A tua sinalização foi enviada. Juntos estamos a tornar a cidade mais limpa e sustentável.
        </p>
        <div className="confirmation-card">
          <span className="confirmation-icon">
            <Icon name="delete_outline" />
          </span>
          <div>
            <strong>Ecoponto cheio</strong>
            <span>Rua Alexandre Herculano</span>
          </div>
          <Icon name="verified" filled />
        </div>
        <div className="confirmation-actions">
          <AppButton onClick={() => onNavigate("map")} icon="map">
            Voltar ao mapa
          </AppButton>
          <AppButton variant="text" onClick={() => onNavigate("camera")}>
            Ir para a câmara
          </AppButton>
        </div>
      </main>
    </div>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("permissions");

  const navigate = (nextScreen: Screen) => {
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <div className="phone-frame">
        {screen === "permissions" && <PermissionsScreen onAllow={() => navigate("camera")} />}
        {screen === "camera" && (
          <CameraScreen onCapture={() => navigate("result")} onNavigate={navigate} />
        )}
        {screen === "result" && <ResultScreen onNavigate={navigate} />}
        {screen === "map" && <MapScreen onNavigate={navigate} />}
        {screen === "profile" && <ProfileScreen onNavigate={navigate} />}
        {screen === "report" && <ReportScreen onNavigate={navigate} />}
        {screen === "confirmation" && <ConfirmationScreen onNavigate={navigate} />}
      </div>
    </div>
  );
}
