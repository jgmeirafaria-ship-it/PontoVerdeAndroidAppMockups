import { useEffect, useState } from "react";

type Screen =
  | "welcome"
  | "login"
  | "signup"
  | "permissions"
  | "camera"
  | "identifying"
  | "result"
  | "unrecognized"
  | "cameraPermissionDenied"
  | "mapPermissionDenied"
  | "map"
  | "history"
  | "profile"
  | "accountSettings"
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
  { screen: "history" as Screen, label: "Histórico", icon: "history" },
  { screen: "report" as Screen, label: "Reportar", icon: "campaign" },
  { screen: "profile" as Screen, label: "Perfil", icon: "person" },
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
  showBrand = true,
}: {
  title: string;
  eyebrow?: string;
  onBack?: () => void;
  showBrand?: boolean;
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
      {showBrand && (
        <div className="brand-mark" aria-label="PontoVerde">
          <Icon name="eco" filled />
        </div>
      )}
    </header>
  );
}

type User = {
  name: string;
  email: string;
};

function WelcomeScreen({
  onLogin,
  onSignup,
}: {
  onLogin: () => void;
  onSignup: () => void;
}) {
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
      <main className="welcome-panel">
        <div className="panel-handle" />
        <div className="permissions-copy">
          <h2>Começa a reciclar melhor</h2>
          <p>
            Cria uma conta para guardares o teu impacto ou entra para continuares onde ficaste.
          </p>
        </div>
        <div className="welcome-actions">
          <AppButton onClick={onSignup} icon="person_add">
            Criar conta
          </AppButton>
          <AppButton onClick={onLogin} variant="secondary" icon="login">
            Entrar
          </AppButton>
        </div>
        <p className="privacy-note">
          Ao continuar, aceitas os Termos de utilização e a Política de privacidade.
        </p>
      </main>
    </div>
  );
}

function AuthField({
  id,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  hint,
  readOnly = false,
}: {
  id: string;
  label: string;
  type?: "text" | "email" | "password";
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  hint?: string;
  readOnly?: boolean;
}) {
  const [visible, setVisible] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="auth-field">
      <label htmlFor={id}>{label}</label>
      <div className="auth-input-wrap">
        <input
          id={id}
          type={isPassword && visible ? "text" : type}
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          readOnly={readOnly}
          autoComplete={isPassword ? "current-password" : type === "email" ? "email" : "name"}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setVisible(!visible)}
            aria-label={visible ? "Ocultar palavra-passe" : "Mostrar palavra-passe"}
          >
            <Icon name={visible ? "visibility_off" : "visibility"} />
          </button>
        )}
      </div>
      {hint && <span className="field-hint">{hint}</span>}
    </div>
  );
}

function AuthHeader({ title, onBack }: { title: string; onBack: () => void }) {
  return (
    <>
      <StatusBar />
      <header className="auth-header">
        <button className="icon-button" onClick={onBack} aria-label="Voltar" type="button">
          <Icon name="arrow_back" />
        </button>
        <div className="auth-brand">
          <Icon name="recycling" />
        </div>
      </header>
      <div className="auth-title">
        <span>Olá novamente</span>
        <h1>{title}</h1>
        <p>Continua a construir hábitos mais sustentáveis.</p>
      </div>
    </>
  );
}

function LoginScreen({
  onBack,
  onSignup,
  onSuccess,
}: {
  onBack: () => void;
  onSignup: () => void;
  onSuccess: (user: User) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);

  const submit = () => {
    if (!email.includes("@") || password.length < 6) {
      setError(true);
      return;
    }
    setError(false);
    onSuccess({ name: "Ana Martins", email });
  };

  return (
    <div className="screen auth-screen">
      <AuthHeader title="Bem-vindo de volta" onBack={onBack} />
      <main className="auth-content">
        {error && (
          <div className="auth-error">
            <Icon name="error" filled />
            <span>Email ou palavra-passe incorretos</span>
          </div>
        )}
        <AuthField
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="nome@exemplo.pt"
        />
        <AuthField
          id="login-password"
          label="Palavra-passe"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Introduz a tua palavra-passe"
        />
        <button className="forgot-link" type="button">
          Esqueci-me da palavra-passe
        </button>
        <AppButton onClick={submit} icon="login">Entrar</AppButton>
      </main>
      <div className="auth-footer">
        <span>Ainda não tens conta?</span>
        <button type="button" onClick={onSignup}>Criar conta</button>
      </div>
    </div>
  );
}

function SignupScreen({
  onBack,
  onLogin,
  onSuccess,
}: {
  onBack: () => void;
  onLogin: () => void;
  onSuccess: (user: User) => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const submit = () => {
    if (!name.trim() || !email.includes("@") || password.length < 6) {
      setError("Preenche todos os campos corretamente.");
      return;
    }
    if (password !== confirmPassword) {
      setError("As palavras-passe não coincidem.");
      return;
    }
    setError("");
    onSuccess({ name: name.trim(), email });
  };

  return (
    <div className="screen auth-screen">
      <AuthHeader title="Cria a tua conta" onBack={onBack} />
      <main className="auth-content signup-content">
        {error && (
          <div className="auth-error">
            <Icon name="error" filled />
            <span>{error}</span>
          </div>
        )}
        <AuthField id="signup-name" label="Nome" value={name} onChange={setName} placeholder="O teu nome" />
        <AuthField
          id="signup-email"
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="nome@exemplo.pt"
        />
        <AuthField
          id="signup-password"
          label="Palavra-passe"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="Cria uma palavra-passe"
          hint="Mínimo de 6 caracteres"
        />
        <AuthField
          id="signup-confirm-password"
          label="Confirmar palavra-passe"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="Repete a palavra-passe"
        />
        <AppButton onClick={submit} icon="person_add">Criar conta</AppButton>
      </main>
      <div className="auth-footer">
        <span>Já tens conta?</span>
        <button type="button" onClick={onLogin}>Entrar</button>
      </div>
    </div>
  );
}

function PermissionsScreen({
  onAllow,
  onSimulateDenied,
}: {
  onAllow: () => void;
  onSimulateDenied: () => void;
}) {
  return (
    <div className="screen permission-step-screen">
      <StatusBar />
      <main className="permission-step-content">
        <div className="permission-step-illustration">
          <div className="permission-phone">
            <Icon name="recycling" />
          </div>
          <span className="permission-float permission-float-camera"><Icon name="photo_camera" /></span>
          <span className="permission-float permission-float-location"><Icon name="location_on" filled /></span>
        </div>
        <div className="permission-step-copy">
          <span>Permissões</span>
          <h1>Para funcionar bem</h1>
          <p>Precisamos de acesso à câmara e localização enquanto usas a aplicação.</p>
        </div>
        <div className="permission-list permission-step-list">
          <div className="permission-row">
            <span className="permission-icon"><Icon name="photo_camera" /></span>
            <div><strong>Câmara</strong><span>Identificar objetos</span></div>
            <Icon name="chevron_right" />
          </div>
          <div className="permission-row">
            <span className="permission-icon"><Icon name="location_on" /></span>
            <div><strong>Localização</strong><span>Encontrar ecopontos</span></div>
            <Icon name="chevron_right" />
          </div>
        </div>
        <div className="permission-step-actions">
          <AppButton onClick={onAllow} icon="verified_user">Permitir e continuar</AppButton>
          <button className="permission-demo-link" type="button" onClick={onSimulateDenied}>
            Simular permissão negada
          </button>
          <p className="privacy-note">Podes alterar estas permissões a qualquer momento.</p>
        </div>
      </main>
    </div>
  );
}

function CameraScreen({
  onCapture,
  onUnrecognized,
  onNavigate,
}: {
  onCapture: () => void;
  onUnrecognized: () => void;
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
        <button className="camera-demo-link" type="button" onClick={onUnrecognized}>
          Simular objeto não reconhecido
        </button>
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

function IdentifyingScreen({ onComplete }: { onComplete: () => void }) {
  useEffect(() => {
    const timer = window.setTimeout(onComplete, 1500);
    return () => window.clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="screen identifying-screen">
      <img src={bottlePhoto} alt="Objeto capturado a ser identificado" />
      <div className="identifying-overlay">
        <div className="progress-ring" aria-label="A identificar objeto" />
        <h1>A identificar...</h1>
        <p>Estamos a analisar o objeto</p>
      </div>
    </div>
  );
}

function ResultScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [saved, setSaved] = useState(false);

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
          <AppButton
            variant="secondary"
            icon={saved ? "check" : "bookmark_add"}
            disabled={saved}
            onClick={() => setSaved(true)}
          >
            {saved ? "Guardado ✓" : "Guardar no histórico"}
          </AppButton>
          <button className="retry-link" onClick={() => onNavigate("camera")} type="button">
            Não é isto? <strong>Tentar outra vez</strong>
          </button>
        </div>
      </main>
      {saved && (
        <div className="snackbar">
          <Icon name="check_circle" filled />
          <span>Guardado no teu histórico</span>
          <button type="button" onClick={() => onNavigate("history")}>
            Ver
          </button>
        </div>
      )}
      <BottomNav active="result" onNavigate={onNavigate} />
    </div>
  );
}

function UnrecognizedResultScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  return (
    <div className="screen standard-screen">
      <StatusBar />
      <TopBar title="Resultado" onBack={() => onNavigate("camera")} />
      <main className="scroll-content result-content unrecognized-content">
        <div className="result-photo unrecognized-photo">
          <img src={bottlePhoto} alt="Objeto que não foi possível identificar" />
          <span className="image-badge unidentified-badge">
            <Icon name="help_outline" />
            Não identificado
          </span>
        </div>
        <section className="unrecognized-card">
          <span className="unknown-icon"><Icon name="question_mark" /></span>
          <h2>Não conseguimos identificar este objeto</h2>
          <p>Tenta aproximar a câmara e melhorar a luz.</p>
        </section>
        <div className="result-actions unrecognized-actions">
          <AppButton onClick={() => onNavigate("camera")} icon="photo_camera">
            Tentar outra vez
          </AppButton>
          <AppButton variant="secondary" icon="category">
            Escolher o tipo manualmente
          </AppButton>
        </div>
      </main>
      <BottomNav active="result" onNavigate={onNavigate} />
    </div>
  );
}

function PermissionDeniedScreen({
  kind,
  onNavigate,
  onOpenSettings,
}: {
  kind: "camera" | "location";
  onNavigate: (screen: Screen) => void;
  onOpenSettings: () => void;
}) {
  const isCamera = kind === "camera";

  return (
    <div className="screen standard-screen">
      <StatusBar />
      <main className="denied-content">
        <div className="denied-icon">
          <Icon name={isCamera ? "no_photography" : "location_off"} />
        </div>
        <span className="denied-label">Permissão desativada</span>
        <h1>Precisamos da tua permissão</h1>
        <p>
          {isCamera
            ? "Sem acesso à câmara não conseguimos identificar objetos. Podes ativá-lo nas definições."
            : "Ativa a localização para ver o ecoponto mais próximo."}
        </p>
        <div className="denied-actions">
          <AppButton onClick={onOpenSettings} icon="settings">Abrir definições</AppButton>
          <AppButton variant="text" onClick={() => onNavigate(isCamera ? "camera" : "map")}>
            Agora não
          </AppButton>
        </div>
      </main>
      <BottomNav active={isCamera ? "camera" : "map"} onNavigate={onNavigate} />
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

function MapScreen({
  onNavigate,
  onReport,
}: {
  onNavigate: (screen: Screen) => void;
  onReport: () => void;
}) {
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
            <button
              type="button"
              aria-label="Simular localização indisponível"
              onClick={() => onNavigate("mapPermissionDenied")}
            >
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
            <AppButton variant="secondary" icon="report_problem" onClick={onReport}>
              Sinalizar problema
            </AppButton>
          </div>
        </section>
      </div>
      <BottomNav active="map" onNavigate={onNavigate} />
    </div>
  );
}

type HistoryItem = {
  icon: string;
  color: string;
  name: string;
  bin: string;
  filter: string;
  time: string;
  group: "Hoje" | "Ontem" | "Esta semana";
};

const historyItems: HistoryItem[] = [
  {
    icon: "local_drink",
    color: "item-yellow",
    name: "Garrafa de plástico",
    bin: "Ecoponto amarelo",
    filter: "Amarelo",
    time: "09:42",
    group: "Hoje",
  },
  {
    icon: "description",
    color: "item-blue",
    name: "Caixa de cereais",
    bin: "Ecoponto azul",
    filter: "Azul",
    time: "18:15",
    group: "Ontem",
  },
  {
    icon: "wine_bar",
    color: "item-green",
    name: "Frasco de vidro",
    bin: "Ecoponto verde",
    filter: "Verde",
    time: "13:08",
    group: "Esta semana",
  },
  {
    icon: "battery_5_bar",
    color: "item-red",
    name: "Pilha AA",
    bin: "Pilhão",
    filter: "Pilhão",
    time: "17:30",
    group: "Esta semana",
  },
  {
    icon: "chair",
    color: "item-orange",
    name: "Cadeira de madeira",
    bin: "Ecocentro",
    filter: "Ecocentro",
    time: "11:20",
    group: "Esta semana",
  },
];

const historyFilters = ["Todos", "Amarelo", "Azul", "Verde", "Pilhão", "Ecocentro"];
const historyGroups: HistoryItem["group"][] = ["Hoje", "Ontem", "Esta semana"];

function ImpactCard() {
  return (
    <section className="impact-card">
      <div className="impact-head">
        <div>
          <span>Este mês</span>
          <h2>Reciclaste <strong>24 objetos</strong> este mês</h2>
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
  );
}

function HistoryScreen({ onNavigate }: { onNavigate: (screen: Screen) => void }) {
  const [view, setView] = useState<"records" | "empty">("records");
  const [filter, setFilter] = useState("Todos");
  const filteredItems =
    filter === "Todos" ? historyItems : historyItems.filter((item) => item.filter === filter);

  return (
    <div className="screen standard-screen">
      <StatusBar />
      <TopBar title="Histórico" eyebrow="Os teus objetos reciclados" />
      <main className="scroll-content history-content">
        <ImpactCard />
        <div className="history-filter-row" aria-label="Filtrar histórico">
          {historyFilters.map((label) => (
            <button
              className={`filter-chip ${filter === label ? "selected" : ""}`}
              type="button"
              key={label}
              onClick={() => setFilter(label)}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="history-heading">
          <div>
            <h2>Registos</h2>
            <p>{filter === "Todos" ? "Toda a tua atividade" : `Objetos do tipo ${filter.toLowerCase()}`}</p>
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
          <div className="history-groups">
            {historyGroups.map((group) => {
              const items = filteredItems.filter((item) => item.group === group);
              if (items.length === 0) return null;
              return (
                <section className="history-group" key={group}>
                  <h3>{group}</h3>
                  <div className="history-list">
                    {items.map((item) => (
                      <article className="history-item" key={item.name}>
                        <span className={`history-icon ${item.color}`}>
                          <Icon name={item.icon} />
                        </span>
                        <div>
                          <h3>{item.name}</h3>
                          <p>{item.bin}</p>
                        </div>
                        <time>{item.time}</time>
                      </article>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
        ) : (
          <section className="empty-state">
            <div className="empty-illustration">
              <Icon name="recycling" />
              <span className="empty-bottle"><Icon name="local_drink" /></span>
              <span className="empty-paper"><Icon name="description" /></span>
            </div>
            <h2>Ainda não reciclaste nada</h2>
            <p>Identifica o teu primeiro objeto e começa a acompanhar o teu impacto.</p>
            <AppButton onClick={() => onNavigate("camera")} icon="photo_camera">
              Abrir câmara
            </AppButton>
          </section>
        )}
      </main>
      <BottomNav active="history" onNavigate={onNavigate} />
    </div>
  );
}

function ProfileScreen({
  onNavigate,
  user,
  onLogout,
}: {
  onNavigate: (screen: Screen) => void;
  user: User;
  onLogout: () => void;
}) {
  const [showLogoutDialog, setShowLogoutDialog] = useState(false);
  const initials = user.name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="screen standard-screen">
      <StatusBar />
      <TopBar title="Perfil" eyebrow="A tua conta" />
      <main className="scroll-content profile-content">
        <section className="profile-card">
          <div className="profile-avatar">
            <span>{initials}</span>
            <i><Icon name="eco" filled /></i>
          </div>
          <div className="profile-copy">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
          </div>
        </section>
        <section className="profile-stats" aria-label="Resumo de reciclagem">
          {[
            ["126", "Total reciclado"],
            ["24", "Este mês"],
            ["Amarelo", "Tipo mais frequente"],
          ].map(([value, label]) => (
            <div key={label}>
              <strong>{value}</strong>
              <span>{label}</span>
            </div>
          ))}
        </section>
        <section className="profile-menu">
          <button type="button" onClick={() => onNavigate("accountSettings")}>
            <span className="menu-icon"><Icon name="manage_accounts" /></span>
            <span>
              <strong>Definições da conta</strong>
              <small>Nome, email e palavra-passe</small>
            </span>
            <Icon name="chevron_right" />
          </button>
          <button type="button" className="logout-menu-item" onClick={() => setShowLogoutDialog(true)}>
            <span className="menu-icon"><Icon name="logout" /></span>
            <span>
              <strong>Terminar sessão</strong>
              <small>Sair da tua conta PontoVerde</small>
            </span>
            <Icon name="chevron_right" />
          </button>
        </section>
      </main>
      {showLogoutDialog && (
        <div className="dialog-backdrop" role="presentation">
          <section className="logout-dialog" role="dialog" aria-modal="true" aria-labelledby="logout-title">
            <span className="dialog-icon"><Icon name="logout" /></span>
            <h2 id="logout-title">Queres terminar a sessão?</h2>
            <p>Terás de voltar a introduzir os teus dados para entrar.</p>
            <div className="dialog-actions">
              <AppButton variant="secondary" onClick={() => setShowLogoutDialog(false)}>
                Cancelar
              </AppButton>
              <AppButton onClick={onLogout}>Terminar sessão</AppButton>
            </div>
          </section>
        </div>
      )}
      <BottomNav active="profile" onNavigate={onNavigate} />
    </div>
  );
}

function AccountSettingsScreen({
  user,
  onBack,
  onSave,
}: {
  user: User;
  onBack: () => void;
  onSave: (name: string) => void;
}) {
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);

  const save = () => {
    onSave(name.trim() || user.name);
    setSaved(true);
  };

  return (
    <div className="screen standard-screen">
      <StatusBar />
      <TopBar title="Definições da conta" onBack={onBack} showBrand={false} />
      <main className="settings-content">
        <div className="settings-fields">
          <AuthField
            id="settings-name"
            label="Nome"
            value={name}
            onChange={(value) => {
              setName(value);
              setSaved(false);
            }}
            placeholder="O teu nome"
          />
          <AuthField
            id="settings-email"
            label="Email"
            type="email"
            value={user.email}
            onChange={() => undefined}
            placeholder="O teu email"
            readOnly
          />
        </div>
        <button className="password-reset-row" type="button">
          <span className="menu-icon"><Icon name="lock_reset" /></span>
          <span>
            <strong>Alterar palavra-passe</strong>
            <small>Enviamos-te um email para a redefinires</small>
          </span>
          <Icon name="chevron_right" />
        </button>
        <AppButton icon="save" onClick={save}>Guardar alterações</AppButton>
      </main>
      {saved && (
        <div className="snackbar settings-snackbar">
          <Icon name="check_circle" filled />
          <span>Alterações guardadas</span>
        </div>
      )}
    </div>
  );
}

function MiniMap({ selected = true }: { selected?: boolean }) {
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
          <strong>{selected ? "Rua Alexandre Herculano" : "A tua localização"}</strong>
          <span>
            {selected ? <><i className="ecopoint-color-dot" /> Ecoponto amarelo</> : "Lisboa"}
          </span>
        </div>
      </div>
    </div>
  );
}

function ReportScreen({
  onNavigate,
  hasSelectedEcopoint,
}: {
  onNavigate: (screen: Screen) => void;
  hasSelectedEcopoint: boolean;
}) {
  const [problem, setProblem] = useState("Cheio");
  const [description, setDescription] = useState("");
  const [hasPhoto, setHasPhoto] = useState(false);
  const [ecopointSelected, setEcopointSelected] = useState(hasSelectedEcopoint);
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
              <h2>{ecopointSelected ? "Ecoponto selecionado" : "Escolhe o ecoponto"}</h2>
              <p>
                {ecopointSelected
                  ? "Rua Alexandre Herculano · Ecoponto amarelo"
                  : "Indica onde encontraste o problema"}
              </p>
            </div>
          </div>
          <MiniMap selected={ecopointSelected} />
          {!ecopointSelected && (
            <button className="nearest-ecopoint-button" type="button" onClick={() => setEcopointSelected(true)}>
              <Icon name="near_me" />
              <span>Usar o mais próximo</span>
              <Icon name="chevron_right" />
            </button>
          )}
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
  const [screen, setScreen] = useState<Screen>("welcome");
  const [user, setUser] = useState<User>({
    name: "Ana Martins",
    email: "ana.martins@email.pt",
  });
  const [reportHasEcopoint, setReportHasEcopoint] = useState(false);

  const navigate = (nextScreen: Screen) => {
    if (nextScreen === "report") {
      setReportHasEcopoint(false);
    }
    setScreen(nextScreen);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="app-shell">
      <div className="phone-frame">
        {screen === "welcome" && (
          <WelcomeScreen onLogin={() => navigate("login")} onSignup={() => navigate("signup")} />
        )}
        {screen === "login" && (
          <LoginScreen
            onBack={() => navigate("welcome")}
            onSignup={() => navigate("signup")}
            onSuccess={(authenticatedUser) => {
              setUser(authenticatedUser);
              navigate("permissions");
            }}
          />
        )}
        {screen === "signup" && (
          <SignupScreen
            onBack={() => navigate("welcome")}
            onLogin={() => navigate("login")}
            onSuccess={(authenticatedUser) => {
              setUser(authenticatedUser);
              navigate("permissions");
            }}
          />
        )}
        {screen === "permissions" && (
          <PermissionsScreen
            onAllow={() => navigate("camera")}
            onSimulateDenied={() => navigate("cameraPermissionDenied")}
          />
        )}
        {screen === "camera" && (
          <CameraScreen
            onCapture={() => navigate("identifying")}
            onUnrecognized={() => navigate("unrecognized")}
            onNavigate={navigate}
          />
        )}
        {screen === "identifying" && <IdentifyingScreen onComplete={() => navigate("result")} />}
        {screen === "result" && <ResultScreen onNavigate={navigate} />}
        {screen === "unrecognized" && <UnrecognizedResultScreen onNavigate={navigate} />}
        {screen === "cameraPermissionDenied" && (
          <PermissionDeniedScreen
            kind="camera"
            onNavigate={navigate}
            onOpenSettings={() => navigate("permissions")}
          />
        )}
        {screen === "mapPermissionDenied" && (
          <PermissionDeniedScreen
            kind="location"
            onNavigate={navigate}
            onOpenSettings={() => navigate("permissions")}
          />
        )}
        {screen === "map" && (
          <MapScreen
            onNavigate={navigate}
            onReport={() => {
              setReportHasEcopoint(true);
              setScreen("report");
            }}
          />
        )}
        {screen === "history" && <HistoryScreen onNavigate={navigate} />}
        {screen === "profile" && (
          <ProfileScreen onNavigate={navigate} user={user} onLogout={() => navigate("welcome")} />
        )}
        {screen === "accountSettings" && (
          <AccountSettingsScreen
            user={user}
            onBack={() => navigate("profile")}
            onSave={(name) => setUser((currentUser) => ({ ...currentUser, name }))}
          />
        )}
        {screen === "report" && (
          <ReportScreen onNavigate={navigate} hasSelectedEcopoint={reportHasEcopoint} />
        )}
        {screen === "confirmation" && <ConfirmationScreen onNavigate={navigate} />}
      </div>
    </div>
  );
}
