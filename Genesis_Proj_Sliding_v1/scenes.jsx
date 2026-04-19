// scenes.jsx — Six scenes for the 49 Days animation
// Uses globals from animations.jsx: Stage, Sprite, TextSprite, RectSprite, Easing, interpolate, useSprite, useTime, clamp

const W = 1920;
const H = 1080;

// ── Shared tokens ───────────────────────────────────────────────────────────
const BG = '#0c1013';                  // deep navy-black
const BG_SOFT = '#131920';
const FG = '#f3ede2';                  // warm off-white
const FG_DIM = 'rgba(243,237,226,0.55)';
const FG_FAINT = 'rgba(243,237,226,0.14)';
const STRIKE = 'oklch(68% 0.16 45)';   // burnt orange
const STRIKE_SOFT = 'oklch(68% 0.16 45 / 0.18)';
const DIPLO = 'oklch(72% 0.09 230)';   // cool muted blue
const DIPLO_SOFT = 'oklch(72% 0.09 230 / 0.22)';

const SERIF = "'Fraunces', 'Canela', 'Georgia', serif";
const SANS = "'Inter', 'Helvetica Neue', system-ui, sans-serif";
const MONO = "'JetBrains Mono', ui-monospace, SFMono-Regular, monospace";
const HAN = "'Noto Serif SC', 'Songti SC', serif";

// ── Atoms ───────────────────────────────────────────────────────────────────

function Grain() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      opacity: 0.06, mixBlendMode: 'overlay',
      backgroundImage: "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='200' height='200'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.5 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
    }}/>
  );
}

function Vignette() {
  return (
    <div style={{
      position: 'absolute', inset: 0, pointerEvents: 'none',
      background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.55) 100%)',
    }}/>
  );
}

function Chrome({ label, dayLabel }) {
  // Top-left channel tag + top-right day counter, like a cinematic news bug but abstract.
  return (
    <React.Fragment>
      <div style={{
        position: 'absolute', top: 40, left: 56,
        fontFamily: MONO, fontSize: 14, letterSpacing: '0.22em',
        color: FG_DIM, textTransform: 'uppercase',
      }}>
        <span style={{ color: STRIKE }}>● </span>{label}
      </div>
      <div style={{
        position: 'absolute', top: 40, right: 56,
        fontFamily: MONO, fontSize: 14, letterSpacing: '0.22em',
        color: FG_DIM, textTransform: 'uppercase', textAlign: 'right',
      }}>
        {dayLabel}
      </div>
    </React.Fragment>
  );
}

function Footer({ enText, cnText }) {
  return (
    <div style={{
      position: 'absolute', bottom: 52, left: 56, right: 56,
      display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
      color: FG_DIM, fontFamily: MONO, fontSize: 13, letterSpacing: '0.18em',
      textTransform: 'uppercase',
    }}>
      <span>49 Days / 美伊戰爭</span>
      <span>Feb 28 — Apr 17, 2026</span>
    </div>
  );
}

// Caption block: big English headline + small Chinese subtitle
function Caption({ en, cn, x, y, size = 88, width = 1400, color = FG, align = 'left' }) {
  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width, textAlign: align,
    }}>
      <div style={{
        fontFamily: SERIF, fontWeight: 400, fontSize: size,
        lineHeight: 1.02, letterSpacing: '-0.025em',
        color, textWrap: 'balance',
      }}>{en}</div>
      {cn && (
        <div style={{
          marginTop: 22,
          fontFamily: HAN, fontWeight: 300, fontSize: Math.round(size * 0.28),
          letterSpacing: '0.06em', color: FG_DIM,
        }}>{cn}</div>
      )}
    </div>
  );
}

// Tiny label block for data
function Stat({ x, y, value, enLabel, cnLabel, color = FG, width = 640 }) {
  return (
    <div style={{ position: 'absolute', left: x, top: y, width }}>
      <div style={{
        fontFamily: SERIF, fontWeight: 400, fontSize: 148, lineHeight: 0.95,
        color, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums',
      }}>{value}</div>
      <div style={{
        marginTop: 18,
        fontFamily: MONO, fontSize: 15, letterSpacing: '0.22em',
        color: FG_DIM, textTransform: 'uppercase',
      }}>{enLabel}</div>
      {cnLabel && (
        <div style={{
          marginTop: 6, fontFamily: HAN, fontSize: 18, color: FG_DIM,
          letterSpacing: '0.08em',
        }}>{cnLabel}</div>
      )}
    </div>
  );
}

// Animated counter (monotonically counts up from 0 to target over duration)
function Counter({ target, duration = 1.2, start = 0, format = (v) => v }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - start) / duration, 0, 1);
  const eased = Easing.easeOutCubic(t);
  const v = Math.round(target * eased);
  return <>{format(v)}</>;
}

// A dot that pulses into existence (for strike markers on maps)
function PulseDot({ x, y, size = 14, color = STRIKE, delay = 0, pulseOnly = false }) {
  const { localTime } = useSprite();
  const t = Math.max(0, localTime - delay);
  const appear = clamp(t / 0.4, 0, 1);
  const e = Easing.easeOutBack(appear);
  const scale = pulseOnly ? 1 : 0.3 + 0.7 * e;
  const opacity = pulseOnly ? 1 : appear;

  // Ongoing pulse ring
  const ringT = ((t * 1.2) % 1.6) / 1.6;
  const ringScale = 1 + ringT * 3;
  const ringOpacity = t > 0.1 ? (1 - ringT) * 0.55 : 0;

  return (
    <div style={{
      position: 'absolute', left: x, top: y,
      width: size, height: size, marginLeft: -size/2, marginTop: -size/2,
    }}>
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        border: `1.5px solid ${color}`,
        transform: `scale(${ringScale})`,
        opacity: ringOpacity,
      }}/>
      <div style={{
        position: 'absolute', inset: 0,
        borderRadius: '50%',
        background: color,
        transform: `scale(${scale})`,
        opacity,
        boxShadow: `0 0 20px ${color}`,
      }}/>
    </div>
  );
}

// A simple abstract dot-grid map of a region. Renders a blob-path-ish shape
// as a filled area + scattered points to suggest geography without copying any real map.
function DotMap({ width, height, points, highlight = [] }) {
  // points: array of {x, y, size?}
  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} style={{ position: 'absolute', inset: 0 }}>
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r={p.size || 1.4}
          fill={FG} opacity={p.o || 0.22} />
      ))}
      {highlight.map((p, i) => (
        <circle key={`h${i}`} cx={p.x} cy={p.y} r={p.size || 2.2}
          fill={FG} opacity={0.5} />
      ))}
    </svg>
  );
}

// Generate a pseudo-Iran-shaped dot cloud (procedural, deterministic)
function useIranDots() {
  return React.useMemo(() => {
    // Blob outline points (roughly Iran-ish oriented shape, but abstract)
    // We'll just spray points inside an ellipse with some irregular boundary
    const pts = [];
    const rand = mulberry32(42);
    const cx = 1020, cy = 540;
    const rx = 520, ry = 320;
    const count = 1400;
    for (let i = 0; i < count; i++) {
      // Sample in ellipse, with density falloff
      const a = rand() * Math.PI * 2;
      const r = Math.pow(rand(), 0.7);
      // Irregular boundary
      const bump = 1 + 0.18 * Math.sin(a * 3 + 0.7) + 0.12 * Math.cos(a * 5 - 0.3);
      const x = cx + Math.cos(a) * rx * r * bump;
      const y = cy + Math.sin(a) * ry * r * bump * 0.85;
      pts.push({ x, y, size: rand() < 0.1 ? 2.0 : 1.2, o: 0.12 + rand() * 0.22 });
    }
    return pts;
  }, []);
}

// Broader Middle East dot cloud for scene 3
function useRegionDots() {
  return React.useMemo(() => {
    const pts = [];
    const rand = mulberry32(77);
    const cx = 960, cy = 540;
    const rx = 840, ry = 420;
    for (let i = 0; i < 2400; i++) {
      const a = rand() * Math.PI * 2;
      const r = Math.pow(rand(), 0.6);
      const bump = 1 + 0.25 * Math.sin(a * 2.2 + 0.1) + 0.15 * Math.cos(a * 4.1);
      const x = cx + Math.cos(a) * rx * r * bump;
      const y = cy + Math.sin(a) * ry * r * bump * 0.7;
      pts.push({ x, y, size: 1.1, o: 0.1 + rand() * 0.18 });
    }
    return pts;
  }, []);
}

function mulberry32(a) {
  return function() {
    a |= 0; a = a + 0x6D2B79F5 | 0;
    let t = a;
    t = Math.imul(t ^ t >>> 15, t | 1);
    t ^= t + Math.imul(t ^ t >>> 7, t | 61);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// ── Scene 1: Cold open — 0-8s ───────────────────────────────────────────────
function Scene1() {
  const { localTime } = useSprite();
  // subtle vertical drift
  const drift = interpolate([0, 8], [0, -18], Easing.linear)(localTime);

  return (
    <div style={{ position: 'absolute', inset: 0, background: BG }}>
      <Chrome label="Origin / 起點" dayLabel="Day 01" />

      {/* A single hairline that draws across */}
      <Sprite start={0.3} end={8}>
        {({ localTime }) => {
          const w = interpolate([0, 2], [0, 1600], Easing.easeInOutCubic)(localTime);
          return (
            <div style={{
              position: 'absolute', left: 160, top: 420,
              height: 1, width: w, background: FG_FAINT,
            }}/>
          );
        }}
      </Sprite>

      {/* Date stamp */}
      <Sprite start={0.6} end={8}>
        <TextSprite
          text="28 FEBRUARY 2026"
          x={160} y={430 + drift}
          size={28} font={MONO} color={FG_DIM} weight={400}
          letterSpacing="0.28em"
          entryDur={0.5} exitDur={0.4}
        />
      </Sprite>

      {/* Main headline */}
      <Sprite start={1.2} end={8}>
        <Caption
          en={"The war\nbegins."}
          cn={"美伊戰爭 —— 爆發於二月二十八日"}
          x={160} y={480 + drift}
          size={200}
          width={1600}
        />
      </Sprite>

      {/* Day marker, bottom right */}
      <Sprite start={2.2} end={8}>
        {({ localTime }) => {
          const t = clamp((localTime - 0) / 0.6, 0, 1);
          return (
            <div style={{
              position: 'absolute', right: 160, bottom: 160,
              opacity: Easing.easeOutCubic(t),
              transform: `translateY(${(1 - t) * 20}px)`,
              textAlign: 'right',
            }}>
              <div style={{
                fontFamily: SERIF, fontWeight: 400, fontSize: 340, lineHeight: 0.85,
                color: STRIKE, letterSpacing: '-0.05em',
              }}>01</div>
              <div style={{
                marginTop: 12, fontFamily: MONO, fontSize: 15, letterSpacing: '0.28em',
                color: FG_DIM, textTransform: 'uppercase',
              }}>Day / 第一日</div>
            </div>
          );
        }}
      </Sprite>

      <Footer />
      <Vignette />
      <Grain />
    </div>
  );
}

// ── Scene 2: The opening strike — 8-18s ─────────────────────────────────────
function Scene2() {
  const iranDots = useIranDots();

  // Strike sites (positions within the Iran blob, roughly)
  const sites = [
    { x: 960, y: 480, delay: 0.2 },    // Tehran
    { x: 890, y: 550, delay: 0.7 },    // Isfahan
    { x: 820, y: 460, delay: 1.1 },    // Arak/Fordow area
    { x: 1080, y: 620, delay: 1.5 },   // Natanz-ish
    { x: 1150, y: 500, delay: 1.9 },
    { x: 990, y: 600, delay: 2.3 },
    { x: 870, y: 400, delay: 2.7 },
  ];

  return (
    <div style={{ position: 'absolute', inset: 0, background: BG }}>
      <Chrome label="Opening strike / 首輪打擊" dayLabel="Days 01 — 03" />

      {/* Iran dot shape */}
      <Sprite start={0.1} end={10}>
        {({ localTime }) => {
          const opacity = interpolate([0, 1.2], [0, 1], Easing.easeOutCubic)(localTime);
          return (
            <div style={{ position: 'absolute', inset: 0, opacity }}>
              <DotMap width={1920} height={1080} points={iranDots} />
            </div>
          );
        }}
      </Sprite>

      {/* IRAN label */}
      <Sprite start={0.8} end={10}>
        <TextSprite
          text="IRAN / 伊朗"
          x={680} y={240}
          size={22} font={MONO} color={FG_DIM}
          letterSpacing="0.3em" weight={400}
          entryDur={0.5} exitDur={0.4}
        />
      </Sprite>

      {/* Strike markers */}
      <Sprite start={1.4} end={10}>
        {sites.map((s, i) => (
          <PulseDot key={i} x={s.x} y={s.y} delay={s.delay} size={18} color={STRIKE} />
        ))}
      </Sprite>

      {/* Strike annotations, typewriter-like */}
      <Sprite start={2.0} end={10}>
        <TextSprite
          text="TEHRAN" x={974} y={460} size={14} font={MONO}
          color={STRIKE} letterSpacing="0.25em" weight={500}
          entryDur={0.4} exitDur={0.3}
        />
      </Sprite>
      <Sprite start={2.6} end={10}>
        <TextSprite
          text="ISFAHAN" x={904} y={530} size={14} font={MONO}
          color={STRIKE} letterSpacing="0.25em" weight={500}
        />
      </Sprite>
      <Sprite start={3.2} end={10}>
        <TextSprite
          text="NATANZ" x={1094} y={600} size={14} font={MONO}
          color={STRIKE} letterSpacing="0.25em" weight={500}
        />
      </Sprite>

      {/* Caption */}
      <Sprite start={4.2} end={10}>
        <Caption
          en={"Israeli–US airstrikes\nhit military, civilian\nand heritage sites."}
          cn={"以色列與美國的聯合空襲 —— 擊中軍事設施、民用建築與歷史遺址"}
          x={80} y={720}
          size={66} width={1100}
        />
      </Sprite>

      {/* Right-side killed note */}
      <Sprite start={6.0} end={10}>
        <div style={{ position: 'absolute', right: 80, top: 720, width: 520, textAlign: 'right' }}>
          <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.28em',
            color: STRIKE, textTransform: 'uppercase' }}>28 Feb · Tehran</div>
          <div style={{ marginTop: 16, fontFamily: SERIF, fontSize: 44, lineHeight: 1.08,
            color: FG, letterSpacing: '-0.02em' }}>
            Supreme Leader Ali Khamenei<br/>killed in strike on compound.
          </div>
          <div style={{ marginTop: 14, fontFamily: HAN, fontSize: 20, color: FG_DIM }}>
            最高領袖哈梅內伊於空襲中身亡
          </div>
        </div>
      </Sprite>

      <Footer />
      <Vignette />
      <Grain />
    </div>
  );
}

// ── Scene 3: Retaliation spreads — 18-28s ───────────────────────────────────
function Scene3() {
  const regionDots = useRegionDots();

  // Arc targets across the region
  const targets = [
    { x: 620, y: 430, label: 'ISRAEL', cn: '以色列', delay: 0.3 },
    { x: 1240, y: 640, label: 'QATAR · UAE · SAUDI', cn: '海灣美軍基地', delay: 0.8 },
    { x: 1110, y: 370, label: 'IRAQ', cn: '伊拉克', delay: 1.3 },
    { x: 540, y: 320, label: 'CYPRUS', cn: '塞浦路斯', delay: 1.7 },
    { x: 400, y: 500, label: 'LEBANON', cn: '黎巴嫩', delay: 2.1 },
    { x: 780, y: 300, label: 'TURKEY', cn: '土耳其', delay: 2.5 },
  ];
  const origin = { x: 960, y: 540 };

  return (
    <div style={{ position: 'absolute', inset: 0, background: BG }}>
      <Chrome label="Retaliation / 伊朗反擊" dayLabel="Days 03 — 10" />

      {/* Regional dot cloud */}
      <Sprite start={0} end={10}>
        {({ localTime }) => {
          const opacity = interpolate([0, 1], [0, 1], Easing.easeOutCubic)(localTime);
          return (
            <div style={{ position: 'absolute', inset: 0, opacity }}>
              <DotMap width={1920} height={1080} points={regionDots} />
            </div>
          );
        }}
      </Sprite>

      {/* Origin pulse (Iran) */}
      <Sprite start={0.3} end={10}>
        <PulseDot x={origin.x} y={origin.y} size={20} color={STRIKE} />
      </Sprite>
      <Sprite start={0.5} end={10}>
        <TextSprite text="IRAN / 伊朗" x={origin.x + 20} y={origin.y - 10}
          size={13} font={MONO} color={FG_DIM} letterSpacing="0.25em" weight={500}/>
      </Sprite>

      {/* Arcs */}
      <svg width={1920} height={1080} viewBox="0 0 1920 1080"
        style={{ position: 'absolute', inset: 0 }}>
        {targets.map((t, i) => (
          <AnimatedArc key={i} from={origin} to={t} delay={t.delay} />
        ))}
      </svg>

      {/* Target dots */}
      {targets.map((t, i) => (
        <Sprite key={i} start={t.delay + 1.1} end={10}>
          <PulseDot x={t.x} y={t.y} size={14} color={STRIKE} />
          <div style={{
            position: 'absolute',
            left: t.x + 18, top: t.y - 8,
            fontFamily: MONO, fontSize: 12, letterSpacing: '0.25em',
            color: STRIKE, fontWeight: 500,
          }}>
            {t.label}
          </div>
        </Sprite>
      ))}

      {/* Caption */}
      <Sprite start={4.0} end={10}>
        <Caption
          en={"Hundreds of drones and\nmissiles strike six countries."}
          cn={"伊朗向六國發射數百枚無人機與導彈"}
          x={80} y={820}
          size={64} width={1300}
        />
      </Sprite>

      {/* Lebanon sub-note */}
      <Sprite start={7.0} end={10}>
        <div style={{ position: 'absolute', right: 80, top: 860, width: 520, textAlign: 'right' }}>
          <div style={{ fontFamily: MONO, fontSize: 12, letterSpacing: '0.28em',
            color: FG_DIM, textTransform: 'uppercase' }}>Lebanon war / 黎巴嫩戰事</div>
          <div style={{ marginTop: 12, fontFamily: SERIF, fontSize: 34, lineHeight: 1.1,
            color: FG, letterSpacing: '-0.02em' }}>
            2,000+ killed as Hezbollah<br/>conflict reignites.
          </div>
        </div>
      </Sprite>

      <Footer />
      <Vignette />
      <Grain />
    </div>
  );
}

function AnimatedArc({ from, to, delay }) {
  const { localTime } = useSprite();
  const t = clamp((localTime - delay) / 1.0, 0, 1);
  const eased = Easing.easeInOutCubic(t);

  // Quadratic Bezier — lift midpoint perpendicular to chord
  const mx = (from.x + to.x) / 2;
  const my = (from.y + to.y) / 2;
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  const len = Math.sqrt(dx*dx + dy*dy);
  const nx = -dy / len;
  const ny = dx / len;
  const lift = Math.min(160, len * 0.35);
  const cx = mx + nx * lift;
  const cy = my + ny * lift - 40; // bias upward

  const d = `M ${from.x} ${from.y} Q ${cx} ${cy} ${to.x} ${to.y}`;
  // Stroke length animation via pathLength
  return (
    <path d={d}
      stroke={STRIKE}
      strokeWidth={1.4}
      fill="none"
      opacity={0.85}
      pathLength={1}
      strokeDasharray="1 1"
      strokeDashoffset={1 - eased}
      style={{ filter: `drop-shadow(0 0 6px ${STRIKE_SOFT})` }}
    />
  );
}

// ── Scene 4: The chokepoint — 28-40s ────────────────────────────────────────
function Scene4() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG }}>
      <Chrome label="Hormuz blockade / 荷姆茲封鎖" dayLabel="Day 45" />

      {/* Abstract strait — two landmasses as dot clouds with a narrow gap */}
      <Sprite start={0} end={12}>
        <StraitOfHormuz />
      </Sprite>

      {/* Blocked tanker ticks */}
      <Sprite start={2.0} end={12}>
        <TankerRow />
      </Sprite>

      {/* Caption */}
      <Sprite start={0.8} end={12}>
        <Caption
          en={"The US Navy closes\nthe Strait of Hormuz."}
          cn={"美國海軍封鎖荷姆茲海峽"}
          x={80} y={120}
          size={76} width={1300}
        />
      </Sprite>

      {/* Sub stats */}
      <Sprite start={5.5} end={12}>
        <div style={{ position: 'absolute', right: 80, top: 140, width: 560, textAlign: 'right' }}>
          <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.28em',
            color: DIPLO, textTransform: 'uppercase' }}>13 April, 10:00 ET</div>
          <div style={{ marginTop: 14, fontFamily: SERIF, fontSize: 38, lineHeight: 1.08,
            color: FG, letterSpacing: '-0.02em' }}>
            Blockade of all Iranian<br/>ports fully implemented.
          </div>
          <div style={{ marginTop: 10, fontFamily: HAN, fontSize: 20, color: FG_DIM }}>
            美軍全面封鎖伊朗所有港口
          </div>
        </div>
      </Sprite>

      <Sprite start={8.5} end={12}>
        <div style={{ position: 'absolute', left: 80, bottom: 150 }}>
          <div style={{ fontFamily: SERIF, fontWeight: 400, fontSize: 200,
            color: STRIKE, letterSpacing: '-0.04em', lineHeight: 0.9,
            fontVariantNumeric: 'tabular-nums',
          }}>
            <Counter target={20000} duration={1.5} start={0} format={v => v.toLocaleString()} />
          </div>
          <div style={{ marginTop: 14, fontFamily: MONO, fontSize: 16,
            color: FG_DIM, letterSpacing: '0.25em', textTransform: 'uppercase' }}>
            vessels stranded globally
          </div>
          <div style={{ marginTop: 6, fontFamily: HAN, fontSize: 20, color: FG_DIM }}>
            全球約兩萬艘船隻滯留
          </div>
        </div>
      </Sprite>

      <Footer />
      <Vignette />
      <Grain />
    </div>
  );
}

function StraitOfHormuz() {
  const { localTime } = useSprite();
  const o = interpolate([0, 1.0], [0, 1], Easing.easeOutCubic)(localTime);
  // Two landmasses — north and south — with a narrow gap
  const northDots = React.useMemo(() => {
    const pts = []; const r = mulberry32(11);
    for (let i = 0; i < 900; i++) {
      const x = 200 + r() * 1520;
      const y = 400 + Math.pow(r(), 1.6) * -260 + 100*Math.sin(x*0.004);
      pts.push({ x, y, size: 1.1, o: 0.14 + r() * 0.2 });
    }
    return pts;
  }, []);
  const southDots = React.useMemo(() => {
    const pts = []; const r = mulberry32(22);
    for (let i = 0; i < 900; i++) {
      const x = 200 + r() * 1520;
      const y = 680 + Math.pow(r(), 1.6) * 260 - 80*Math.sin(x*0.005);
      pts.push({ x, y, size: 1.1, o: 0.14 + r() * 0.2 });
    }
    return pts;
  }, []);

  return (
    <div style={{ position: 'absolute', inset: 0, opacity: o }}>
      <DotMap width={1920} height={1080} points={[...northDots, ...southDots]} />
      {/* Country labels */}
      <div style={{
        position: 'absolute', left: 820, top: 340,
        fontFamily: MONO, fontSize: 13, color: FG_DIM, letterSpacing: '0.28em',
      }}>IRAN / 伊朗</div>
      <div style={{
        position: 'absolute', left: 820, top: 760,
        fontFamily: MONO, fontSize: 13, color: FG_DIM, letterSpacing: '0.28em',
      }}>OMAN · UAE / 阿曼 · 阿聯酋</div>

      {/* Strait label + block bar */}
      <div style={{
        position: 'absolute', left: 800, top: 540, width: 320,
        textAlign: 'center',
        fontFamily: MONO, fontSize: 12, color: FG_DIM, letterSpacing: '0.3em',
      }}>STRAIT OF HORMUZ / 荷姆茲海峽</div>

      {/* Red blockade line */}
      <Sprite start={1.6} end={12}>
        {({ localTime }) => {
          const t = clamp((localTime - 0) / 0.8, 0, 1);
          const w = Easing.easeOutCubic(t) * 420;
          return (
            <div style={{
              position: 'absolute', left: 960 - w/2, top: 560,
              width: w, height: 2, background: STRIKE,
              boxShadow: `0 0 16px ${STRIKE}`,
            }}/>
          );
        }}
      </Sprite>
    </div>
  );
}

function TankerRow() {
  const { localTime } = useSprite();
  // A row of small tanker ticks that halt against an invisible wall
  const tankers = [];
  for (let i = 0; i < 12; i++) {
    tankers.push({
      id: i,
      startX: 1700 - i * 100,
      targetX: 1100 + i * 36, // they pile up west of the blockade
      delay: i * 0.08,
    });
  }
  return (
    <React.Fragment>
      {tankers.map(t => {
        const localT = clamp((localTime - t.delay) / 1.3, 0, 1);
        const eased = Easing.easeOutCubic(localT);
        const x = t.startX + (t.targetX - t.startX) * eased;
        return (
          <div key={t.id} style={{
            position: 'absolute', left: x, top: 590,
            width: 18, height: 5, background: FG_DIM,
            borderRadius: 1,
          }}/>
        );
      })}
    </React.Fragment>
  );
}

// ── Scene 5: Human + economic toll — 40-50s ─────────────────────────────────
function Scene5() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG }}>
      <Chrome label="Toll / 代價" dayLabel="As of Day 48" />

      <Sprite start={0} end={10}>
        <Caption
          en={"What it cost."}
          cn={"戰爭的代價"}
          x={80} y={120}
          size={88} width={1200}
        />
      </Sprite>

      {/* Stat 1: displaced */}
      <Sprite start={1.2} end={10}>
        <div style={{ position: 'absolute', left: 80, top: 340, width: 620 }}>
          <div style={{
            fontFamily: SERIF, fontSize: 220, lineHeight: 0.9,
            color: FG, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums',
          }}>
            <Counter target={1000000} duration={1.6} start={0}
              format={v => v >= 1000000 ? '1M+' : v.toLocaleString()} />
          </div>
          <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 15, letterSpacing: '0.22em',
            color: STRIKE, textTransform: 'uppercase' }}>People displaced in Lebanon</div>
          <div style={{ marginTop: 6, fontFamily: HAN, fontSize: 20, color: FG_DIM }}>
            黎巴嫩境內逾百萬人流離失所
          </div>
        </div>
      </Sprite>

      {/* Stat 2: Iran $270bn */}
      <Sprite start={3.0} end={10}>
        <div style={{ position: 'absolute', left: 760, top: 340, width: 560 }}>
          <div style={{
            fontFamily: SERIF, fontSize: 220, lineHeight: 0.9,
            color: FG, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums',
            display: 'flex', alignItems: 'baseline',
          }}>
            <span style={{ fontSize: 120, marginRight: 4, color: FG_DIM }}>$</span>
            <Counter target={270} duration={1.4} start={0} />
            <span style={{ fontSize: 80, marginLeft: 14, color: FG_DIM }}>bn</span>
          </div>
          <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 15, letterSpacing: '0.22em',
            color: STRIKE, textTransform: 'uppercase' }}>Iran's estimated war losses</div>
          <div style={{ marginTop: 6, fontFamily: HAN, fontSize: 20, color: FG_DIM }}>
            伊朗預估戰爭損失 2,700 億美元
          </div>
        </div>
      </Sprite>

      {/* Stat 3: IMF growth cut */}
      <Sprite start={5.0} end={10}>
        <div style={{ position: 'absolute', left: 1400, top: 340, width: 440 }}>
          <div style={{
            fontFamily: SERIF, fontSize: 140, lineHeight: 0.9,
            color: FG_DIM, letterSpacing: '-0.04em', textDecoration: 'line-through',
            textDecorationColor: STRIKE, textDecorationThickness: 4,
            fontVariantNumeric: 'tabular-nums',
          }}>3.9%</div>
          <div style={{
            marginTop: 10,
            fontFamily: SERIF, fontSize: 200, lineHeight: 0.9,
            color: STRIKE, letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums',
          }}>
            <Counter target={11} duration={1.2} start={0} format={v => (v/10).toFixed(1) + '%'} />
          </div>
          <div style={{ marginTop: 22, fontFamily: MONO, fontSize: 15, letterSpacing: '0.22em',
            color: FG_DIM, textTransform: 'uppercase' }}>IMF growth, MENA 2026</div>
          <div style={{ marginTop: 6, fontFamily: HAN, fontSize: 18, color: FG_DIM }}>
            IMF 下修中東北非增長預期
          </div>
        </div>
      </Sprite>

      {/* Low note */}
      <Sprite start={7.0} end={10}>
        <div style={{
          position: 'absolute', left: 80, bottom: 140, right: 80,
          display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end',
        }}>
          <div style={{ fontFamily: SERIF, fontSize: 42, color: FG_DIM,
            letterSpacing: '-0.015em', width: 1100, lineHeight: 1.15 }}>
            Civilian sites, heritage sites, schools, hospitals — all among the damaged.
          </div>
          <div style={{ fontFamily: HAN, fontSize: 20, color: FG_DIM, textAlign: 'right' }}>
            民居、學校、醫院<br/>與歷史遺址同遭波及
          </div>
        </div>
      </Sprite>

      <Footer />
      <Vignette />
      <Grain />
    </div>
  );
}

// ── Scene 6: Fragile present — 50-60s ───────────────────────────────────────
function Scene6() {
  return (
    <div style={{ position: 'absolute', inset: 0, background: BG }}>
      <Chrome label="Today / 現況" dayLabel="Day 49" />

      {/* Day counter rolling up */}
      <Sprite start={0} end={10}>
        <div style={{
          position: 'absolute', left: 80, top: 200,
          fontFamily: MONO, fontSize: 16, letterSpacing: '0.3em',
          color: FG_DIM, textTransform: 'uppercase',
        }}>Day · 第</div>
      </Sprite>
      <Sprite start={0.1} end={10}>
        {({ localTime }) => {
          const t = clamp(localTime / 1.8, 0, 1);
          const eased = Easing.easeOutCubic(t);
          const v = Math.round(1 + 48 * eased);
          return (
            <div style={{
              position: 'absolute', left: 80, top: 230,
              fontFamily: SERIF, fontWeight: 400, fontSize: 440, lineHeight: 0.85,
              color: FG, letterSpacing: '-0.05em', fontVariantNumeric: 'tabular-nums',
            }}>{String(v).padStart(2, '0')}</div>
          );
        }}
      </Sprite>
      <Sprite start={1.8} end={10}>
        <div style={{
          position: 'absolute', left: 80, top: 670,
          fontFamily: HAN, fontSize: 26, color: FG_DIM, letterSpacing: '0.1em',
        }}>第四十九日</div>
      </Sprite>

      {/* Two columns of facts */}
      <Sprite start={2.4} end={10}>
        <div style={{
          position: 'absolute', right: 80, top: 200, width: 960,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.28em',
            color: DIPLO, textTransform: 'uppercase' }}>Diplomacy · 外交</div>
          <div style={{ marginTop: 14, fontFamily: SERIF, fontSize: 58, lineHeight: 1.08,
            color: FG, letterSpacing: '-0.025em' }}>
            A deal, Trump says,<br/>is "very close".
          </div>
          <div style={{ marginTop: 12, fontFamily: HAN, fontSize: 22, color: FG_DIM }}>
            川普稱協議「非常接近」,伊朗外交部表示歡迎停火
          </div>
        </div>
      </Sprite>

      <Sprite start={4.6} end={10}>
        <div style={{
          position: 'absolute', right: 80, top: 480, width: 960,
        }}>
          <div style={{ fontFamily: MONO, fontSize: 13, letterSpacing: '0.28em',
            color: STRIKE, textTransform: 'uppercase' }}>The other hand · 另一面</div>
          <div style={{ marginTop: 14, fontFamily: SERIF, fontSize: 58, lineHeight: 1.08,
            color: FG, letterSpacing: '-0.025em' }}>
            US forces "ready to<br/>resume combat".
          </div>
          <div style={{ marginTop: 12, fontFamily: HAN, fontSize: 22, color: FG_DIM }}>
            美國防長赫格塞斯:若無協議,美軍隨時恢復作戰
          </div>
        </div>
      </Sprite>

      {/* End plate */}
      <Sprite start={7.2} end={10}>
        {({ localTime }) => {
          const t = clamp(localTime / 0.8, 0, 1);
          return (
            <div style={{
              position: 'absolute', left: 80, bottom: 140, right: 80,
              opacity: Easing.easeOutCubic(t),
              transform: `translateY(${(1 - t) * 12}px)`,
              display: 'flex', justifyContent: 'space-between', alignItems: 'baseline',
            }}>
              <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: '0.3em',
                color: FG_DIM, textTransform: 'uppercase' }}>
                As of 17 April 2026 · 截至二〇二六年四月十七日
              </div>
              <div style={{ fontFamily: MONO, fontSize: 15, letterSpacing: '0.3em',
                color: FG_DIM, textTransform: 'uppercase' }}>
                Ceasefire holds, for now · 停火暫時維持
              </div>
            </div>
          );
        }}
      </Sprite>

      <Vignette />
      <Grain />
    </div>
  );
}

// ── Top-level scene router + timestamp label ────────────────────────────────
function Movie() {
  const time = useTime();
  const rootRef = React.useRef(null);

  // Update data-screen-label on root with current second
  React.useEffect(() => {
    if (rootRef.current) {
      const s = Math.floor(time);
      rootRef.current.setAttribute('data-screen-label',
        `t=${String(s).padStart(2,'0')}s`);
    }
  }, [Math.floor(time)]);

  return (
    <div ref={rootRef} style={{
      position: 'absolute', inset: 0, background: BG,
      overflow: 'hidden',
    }}>
      <Sprite start={0}    end={8}>  <Scene1 /></Sprite>
      <Sprite start={8}    end={18}> <Scene2 /></Sprite>
      <Sprite start={18}   end={28}> <Scene3 /></Sprite>
      <Sprite start={28}   end={40}> <Scene4 /></Sprite>
      <Sprite start={40}   end={50}> <Scene5 /></Sprite>
      <Sprite start={50}   end={60}> <Scene6 /></Sprite>

      {/* Section transition flashes at scene boundaries */}
      <SceneFlash at={8}/>
      <SceneFlash at={18}/>
      <SceneFlash at={28}/>
      <SceneFlash at={40}/>
      <SceneFlash at={50}/>
    </div>
  );
}

function SceneFlash({ at }) {
  const time = useTime();
  const d = time - at;
  if (d < -0.1 || d > 0.5) return null;
  const t = clamp(d / 0.5, 0, 1);
  const opacity = Math.pow(1 - t, 2) * 0.55;
  return (
    <div style={{
      position: 'absolute', inset: 0, background: '#000',
      opacity, pointerEvents: 'none', zIndex: 100,
    }}/>
  );
}

Object.assign(window, { Movie });
