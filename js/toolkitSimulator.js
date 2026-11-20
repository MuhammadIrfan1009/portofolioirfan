export function initToolkitSimulator() {
  const dialog = document.getElementById('toolkit-dialog');
  if (!dialog) return;

  const tagBadge = document.getElementById('toolkit-dialog-tag');
  const titleEl = document.getElementById('toolkit-dialog-title');
  const filenameEl = document.getElementById('toolkit-dialog-filename');
  const codeEl = document.getElementById('toolkit-dialog-code');
  const latencyEl = document.getElementById('toolkit-latency');
  const nodeEl = document.getElementById('toolkit-node');
  const hudBadge = document.getElementById('toolkit-hud-badge');
  const canvas = document.getElementById('toolkit-coder-canvas');
  const closeBtn = document.getElementById('toolkit-dialog-close');
  const tags = document.querySelectorAll('.toolkit-tag');

  let activeTech = 'React';
  let animId = null;
  let typeTimer = null;
  let telemetryTimer = null;
  let lastFocusedEl = null;

  const blueprints = {
    Figma: {
      tag: 'SYS://FIGMA',
      title: 'FIGMA VECTOR STUDIO & TOKEN ENGINE',
      hud: 'VECTOR ENGINE // 60 FPS',
      file: 'design-tokens.figma.json',
      node: 'CANVAS-1440',
      stat1: 'DEV MODE',
      stat2: '1440x900',
      stat3: '34 TOKENS',
      domain: 'UI/UX & DESIGN SYSTEM',
      code: `:root {
  --canvas-dark: #080a0e;
  --surface-panel: #101319;
  --accent-copper: #c18b61;
  --font-display: 'Space Grotesk', sans-serif;
  --radius-card: 2px;
}

.spatial-hero-card {
  display: flex;
  flex-direction: column;
  padding: 24px 32px;
  gap: 16px;
  background: var(--surface-panel);
  border: 1px solid var(--accent-copper);
  border-radius: var(--radius-card);
  box-shadow: 0 20px 50px rgba(0, 0, 0, 0.4);
}

.atelier-nav-items {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}`
    },
    GitHub: {
      tag: 'SYS://GITHUB',
      title: 'DISTRIBUTED COMMIT GRAPH & CI/CD RUNNER',
      hud: 'CI/CD RUNNER // 100% PASS',
      file: '.github/workflows/deploy.yml',
      node: 'RUNNER-LINUX-01',
      stat1: 'PASSING',
      stat2: '1.4s',
      stat3: '142 COMMITS',
      domain: 'CI/CD & VERSION CONTROL',
      code: `$ git status -s -b
## main...origin/main [up to date]

$ git log --graph --oneline -n 3
* a7c4e21 (HEAD -> main) feat(stages): full-screen 3D focal stage
* 8b29f04 feat(toolkit): contextual domain simulators
* 1d9e338 chore: zero-comment architecture pass

--- GitHub Actions: production-deploy.yml ---
[10:00:02] ✓ Set up job (Ubuntu 22.04 LTS)
[10:00:04] ✓ Run actions/checkout@v4 (commit a7c4e21)
[10:00:06] ✓ Setup Node.js v20.12.0
[10:00:08] ✓ Run npm test: 14/14 suites passed (0.42s)
[10:00:10] ✓ Vite bundle built in 158ms (169.0kb)
[10:00:12] ✓ Deployed to Global Anycast Edge in 1.4s
Status: PIPELINE_SUCCESS (200 OK)`
    },
    Git: {
      tag: 'SYS://GIT',
      title: 'DISTRIBUTED DAG VERSION CONTROL',
      hud: 'GIT DAG ENGINE // 142 NODES',
      file: '.gitconfig',
      node: 'DAG-LOCAL-TREE',
      stat1: 'CLEAN',
      stat2: '0.8ms',
      stat3: 'MAIN (UP TO DATE)',
      domain: 'VERSION CONTROL',
      code: `[core]
    editor = code --wait
    autocrlf = true
[branch]
    autosetuprebase = always
[merge]
    ff = only
[alias]
    graph = log --graph --oneline --decorate --all
    telemetry = status -s -b
    deploy-check = !git diff --stat origin/main

$ git branch -vv
* main a7c4e21 [origin/main] feat(stages): full-screen 3D focal stage
  feature/toolkit-modes 8b29f04 [origin/feature] contextual simulators`
    },
    VSCode: {
      tag: 'SYS://VSCODE',
      title: 'MODERN WORKSPACE & EXTENSION RUNTIME',
      hud: 'IDE ENVIRONMENT // EXTENSIONS ACTIVE',
      file: '.vscode/settings.json',
      node: 'V8-ELECTRON',
      stat1: 'READY',
      stat2: '142MB',
      stat3: '12 PLUGINS',
      domain: 'DEVELOPER ENVIRONMENT',
      code: `{
  "editor.fontSize": 14,
  "editor.fontFamily": "'JetBrains Mono', 'Fira Code', monospace",
  "editor.fontLigatures": true,
  "editor.cursorBlinking": "smooth",
  "editor.cursorSmoothCaretAnimation": "on",
  "editor.smoothScrolling": true,
  "editor.formatOnSave": true,
  "workbench.colorTheme": "One Dark Pro",
  "extensions.active": [
    "dbaeumer.vscode-eslint (v2.4.4)",
    "esbenp.prettier-vscode (v10.1.0)",
    "bradlc.vscode-tailwindcss (v0.9.11)"
  ]
}`
    },
    MySQL: {
      tag: 'SYS://MYSQL',
      title: 'RELATIONAL SCHEMA & QUERY BENCHMARK',
      hud: 'BUFFER POOL // 99.8% HIT',
      file: '001_schema_cluster.sql',
      node: 'DB-PRIMARY',
      stat1: 'INDEXED',
      stat2: '1.8ms',
      stat3: '99.8% HIT',
      domain: 'DATABASE & PERSISTENCE',
      code: `EXPLAIN ANALYZE
SELECT p.sys_identifier, p.title, t.metric_value
FROM sys_portfolio_projects p
INNER JOIN sys_telemetry t ON p.id = t.project_id
WHERE p.status = 'ACTIVE' AND p.gpa_record >= 3.90
ORDER BY p.indexed_at DESC LIMIT 6;

-- Execution Plan:
-> Limit: 6 row(s) (actual time=0.042..0.051 rows=6 loops=1)
-> Sort: p.indexed_at DESC (actual time=0.041..0.048 rows=6)
-> Stream results via Index Scan on idx_sys_status
Query OK, 6 rows fetched in 0.0018 sec.
Buffer Pool Hit Rate: 99.8% | Lock Wait: 0.00ms`
    },
    Vercel: {
      tag: 'SYS://VERCEL',
      title: 'SERVERLESS ANYCAST EDGE NETWORK',
      hud: 'EDGE NETWORK // 240+ POPS',
      file: 'vercel.json',
      node: 'ANYCAST-EDGE',
      stat1: 'HEALTHY',
      stat2: '14ms',
      stat3: '240+ POPS',
      domain: 'CLOUD & EDGE NETWORK',
      code: `▲ Vercel CLI 34.2.0
Deploying to https://muhammadirfan.vercel.app

✓ Building static atelier assets
✓ Compressing bundles: gzip + brotli
✓ Generated 14 serverless edge routes
✓ Routing traffic to 240+ Anycast Edge PoPs

Active Edge PoPs:
- sin1 (Singapore): 12ms [Active Primary]
- hnd1 (Tokyo): 38ms
- fra1 (Frankfurt): 140ms

Ready! Production deployment completed in 1.4s
SSL Certificate: Validated (Let's Encrypt ECC-256)`
    },
    WordPress: {
      tag: 'SYS://WORDPRESS',
      title: 'HEADLESS REST API & CONTENT MODEL',
      hud: 'REST API // 200 OK',
      file: 'functions.php',
      node: 'CMS-ENDPOINT',
      stat1: 'REST 200',
      stat2: '24ms',
      stat3: 'SSR HYDRATED',
      domain: 'HEADLESS CMS & API',
      code: `GET /wp-json/atelier/v1/portfolio-nodes HTTP/2
Host: cms.muhammadirfan.internal
Accept: application/json

HTTP/2 200 OK
Content-Type: application/json; charset=UTF-8
X-Cache: HIT (Atelier Edge CDN)

{
  "author": "Muhammad Irfan",
  "domain": "Information Systems",
  "gpa": 3.93,
  "activeNodes": [
    { "id": "SYS-001", "name": "SI FEST 2026", "role": "Frontend PIC" },
    { "id": "SYS-006", "name": "GORYUK", "category": "Booking Platform" }
  ]
}`
    },
    React: {
      tag: 'SYS://REACT',
      title: 'REACT VIRTUAL DOM & FIBER KERNEL',
      hud: 'VIRTUAL DOM // 120 FPS',
      file: 'AtelierShowcase.tsx',
      node: 'EDGE-SG-01',
      stat1: 'COMPILED',
      stat2: '3.2ms',
      stat3: 'EDGE-01',
      domain: 'FRONTEND ARCHITECTURE',
      code: `import React, { useState, useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";

export const InteractiveOrbit = ({ activeSystem }: Props) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [pulse, setPulse] = useState<number>(0);

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.45;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime) * 0.15;
    }
  });

  return (
    <group position={[0, 0, 0]}>
      <mesh ref={meshRef}>
        <torusKnotGeometry args={[10, 3, 100, 16]} />
        <meshStandardMaterial color="#c18b61" wireframe />
      </mesh>
    </group>
  );
};`
    },
    Laravel: {
      tag: 'SYS://LARAVEL',
      title: 'LARAVEL ARCHITECTURE & SERVICES',
      hud: 'SERVICE PIPELINE // ACTIVE',
      file: 'SystemKernel.php',
      node: 'CORE-JKT-04',
      stat1: 'COMPILED',
      stat2: '2.4ms',
      stat3: 'JKT-04',
      domain: 'BACKEND ARCHITECTURE',
      code: `<?php

namespace App\\Architecture\\Services;

use App\\Models\\TelemetryDossier;
use Illuminate\\Support\\Facades\\Cache;
use Illuminate\\Http\\JsonResponse;

class PipelineController extends Controller
{
    public function dispatchMetric(string $nodeId): JsonResponse
    {
        $dossier = Cache::remember("telemetry:{$nodeId}", 3600, function () use ($nodeId) {
            return TelemetryDossier::query()
                ->where('node_identifier', $nodeId)
                ->where('is_active', true)
                ->with(['systemMetrics', 'credentials'])
                ->firstOrFail();
        });

        return response()->json([
            'status' => 'DISPATCHED_OK',
            'timestamp' => microtime(true),
            'payload' => $dossier,
        ]);
    }
}`
    },
    PHP: {
      tag: 'SYS://PHP',
      title: 'PHP 8.3 HIGH-PERFORMANCE RUNTIME',
      hud: 'ZEND RUNTIME // 120 FPS',
      file: 'SecurityEngine.php',
      node: 'CORE-JKT-02',
      stat1: 'COMPILED',
      stat2: '1.9ms',
      stat3: 'JKT-02',
      domain: 'BACKEND CORE',
      code: `<?php

declare(strict_types=1);

namespace App\\Security;

final readonly class SpatialTokenVerifier
{
    public function __construct(
        private string $publicKey,
        private int $driftAllowance = 30
    ) {}

    public function verifySessionPayload(string $signature, array $claims): bool
    {
        $encoded = hash_hmac('sha256', json_encode($claims), $this->publicKey);
        return hash_equals($encoded, $signature);
    }
}`
    },
    HTML5: {
      tag: 'SYS://HTML5',
      title: 'SEMANTIC DOM ARCHITECTURE',
      hud: 'DOM TREE // VALIDATED',
      file: 'index.semantic.html',
      node: 'EDGE-GLOBAL-01',
      stat1: 'VALIDATED',
      stat2: '0.9ms',
      stat3: 'GLOBAL-01',
      domain: 'MARKUP & STRUCTURE',
      code: `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <title>Muhammad Irfan &middot; Systems Atelier</title>
</head>
<body class="editorial-viewport">
  <main id="main-content" class="atelier-spatial-canvas" role="main">
    <section class="section section--mind" aria-labelledby="mind-heading">
      <div class="mind-stage-portal">
        <canvas id="mind-stage-canvas" width="720" height="720"></canvas>
      </div>
    </section>
  </main>
</body>
</html>`
    },
    CSS3: {
      tag: 'SYS://CSS3',
      title: 'DESIGN TOKENS & SPATIAL MATRIX',
      hud: 'STYLE MATRIX // COMPILED',
      file: '03-layout.tokens.css',
      node: 'EDGE-GLOBAL-02',
      stat1: 'COMPILED',
      stat2: '1.2ms',
      stat3: 'GLOBAL-02',
      domain: 'DISPLAY & STYLING',
      code: `:root {
  --bg-deep: #080a0e;
  --accent-copper: #c18b61;
  --transition-cinematic: cubic-bezier(0.16, 1, 0.3, 1);
}

.mind-stage-portal {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  pointer-events: none;
  z-index: 6;
}

.section--mind.has-focal .mind-stage-portal {
  opacity: 1;
  visibility: visible;
}`
    },
    JavaScript: {
      tag: 'SYS://JAVASCRIPT',
      title: 'ES6+ EVENT LOOP & CONCURRENCY',
      hud: 'V8 RUNTIME // ASYNC LOOP',
      file: 'apparatusEngine.js',
      node: 'RUN-V8-01',
      stat1: 'COMPILED',
      stat2: '2.1ms',
      stat3: 'V8-01',
      domain: 'INTERACTIVE RUNTIME',
      code: `export class SpatialCoordinator {
  #nodes = new Map();
  #rafId = null;

  constructor(rootElement) {
    this.root = rootElement;
    this.ctx = rootElement.getContext('2d');
  }

  attachTelemetryStream(streamUrl) {
    const channel = new EventSource(streamUrl);
    channel.onmessage = ({ data }) => {
      const packet = JSON.parse(data);
      this.#nodes.set(packet.id, packet);
      this.dispatchStateUpdate(packet);
    };
  }
}`
    },
    TypeScript: {
      tag: 'SYS://TYPESCRIPT',
      title: 'STRICT TYPE MATRIX & CONTRACTS',
      hud: 'TYPE CHECK // STRICT',
      file: 'types.architecture.ts',
      node: 'TS-COMPILER-5',
      stat1: 'TYPE_OK',
      stat2: '1.4ms',
      stat3: 'TS-05',
      domain: 'TYPE CONTRACTS',
      code: `export type DomainScope = 'WEB_PLATFORM' | 'SYSTEMS_CORE' | 'SPATIAL_UI';

export interface TelemetryPayload<T = unknown> {
  readonly recordId: \`SYS-\${number}\`;
  readonly timestamp: number;
  readonly scope: DomainScope;
  readonly gpa: number;
  readonly metrics: {
    readonly latencyMs: number;
    readonly verified: boolean;
  };
  readonly data: Readonly<T>;
}`
    },
    Tailwind: {
      tag: 'SYS://TAILWIND',
      title: 'UTILITY COMPILER & TOKEN MATRIX',
      hud: 'POSTCSS COMPILER // READY',
      file: 'tailwind.config.js',
      node: 'POSTCSS-RUN-01',
      stat1: 'COMPILED',
      stat2: '2.8ms',
      stat3: 'POSTCSS-01',
      domain: 'UTILITY ARCHITECTURE',
      code: `export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        canvas: "#080a0e",
        surface: "#101319",
        accent: {
          DEFAULT: "#c18b61",
          gold: "#e6b77c",
          dark: "#8a5833"
        }
      }
    }
  }
};`
    },
    Bootstrap: {
      tag: 'SYS://BOOTSTRAP',
      title: 'GRID MATRIX & FLEX COMPONENT LAYER',
      hud: '12-COL GRID // ACTIVE',
      file: 'bootstrap.custom.scss',
      node: 'SASS-COMPILER-01',
      stat1: 'COMPILED',
      stat2: '2.0ms',
      stat3: 'SASS-01',
      domain: 'RESPONSIVE FRAMEWORK',
      code: `$theme-colors: (
  "primary": #c18b61,
  "secondary": #64748b,
  "dark": #080a0e,
  "surface": #101319
);

$grid-gutter-width: 1.5rem;
$enable-cssgrid: true;

@import "bootstrap/scss/bootstrap";`
    },
    Inertia: {
      tag: 'SYS://INERTIA',
      title: 'SEAMLESS CLIENT-SERVER MONOLITH',
      hud: 'HYBRID MONOLITH // SYNC',
      file: 'app.inertia.tsx',
      node: 'MONOLITH-HYBRID',
      stat1: 'HYDRATED',
      stat2: '1.8ms',
      stat3: 'HYBRID-01',
      domain: 'CLIENT-SERVER BRIDGE',
      code: `import { createInertiaApp } from "@inertiajs/react";
import { createRoot } from "react-dom/client";

createInertiaApp({
  resolve: name => {
    const pages = import.meta.glob("./Pages/**/*.tsx", { eager: true });
    return pages[\`./Pages/\${name}.tsx\`];
  },
  setup({ el, App, props }) {
    createRoot(el).render(<App {...props} />);
  },
  progress: {
    color: "#c18b61",
    showSpinner: false,
  },
});`
    }
  };

  let tick = 0;
  let particles = [];

  function initParticles() {
    particles = [];
    for (let i = 0; i < 28; i++) {
      particles.push({
        x: (Math.random() - 0.5) * 320,
        y: (Math.random() - 0.5) * 220,
        z: Math.random() * 200 - 100,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -Math.random() * 0.8 - 0.2,
        alpha: Math.random() * 0.7 + 0.2,
        size: Math.random() * 2 + 1
      });
    }
  }

  function drawScanlines(ctx, w, h) {
    ctx.fillStyle = 'rgba(0, 0, 0, 0.08)';
    for (let y = 0; y < h; y += 4) {
      ctx.fillRect(0, y, w, 1.5);
    }
  }

  function drawRadarAndGrid(ctx, w, h) {
    ctx.fillStyle = '#080a0e';
    ctx.fillRect(0, 0, w, h);

    const grad = ctx.createRadialGradient(w / 2, h / 2 - 10, 15, w / 2, h / 2 - 10, w / 1.6);
    grad.addColorStop(0, 'rgba(193, 139, 97, 0.12)');
    grad.addColorStop(0.5, 'rgba(16, 20, 28, 0.6)');
    grad.addColorStop(1, 'rgba(8, 10, 14, 0.95)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.strokeStyle = 'rgba(193, 139, 97, 0.08)';
    ctx.lineWidth = 1;
    const horizon = 185;
    for (let x = -80; x <= w + 80; x += 32) {
      ctx.beginPath();
      ctx.moveTo(x, horizon);
      ctx.lineTo(w / 2 + (x - w / 2) * 2.8, h);
      ctx.stroke();
    }
    for (let y = horizon; y <= h; y += 14) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(w, y);
      ctx.stroke();
    }
    ctx.restore();

    const cx = w / 2;
    const cy = h / 2 - 10;

    ctx.save();
    ctx.translate(cx, cy);

    ctx.strokeStyle = 'rgba(193, 139, 97, 0.16)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, 92, 0, Math.PI * 2);
    ctx.stroke();

    ctx.strokeStyle = 'rgba(193, 139, 97, 0.09)';
    ctx.beginPath();
    ctx.arc(0, 0, 115, 0, Math.PI * 2);
    ctx.stroke();

    ctx.save();
    ctx.rotate(tick * 0.008);
    ctx.strokeStyle = 'rgba(193, 139, 97, 0.25)';
    ctx.setLineDash([3, 14]);
    ctx.beginPath();
    ctx.arc(0, 0, 104, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();

    for (let a = 0; a < 8; a++) {
      const rad = (a * Math.PI) / 4;
      const x1 = Math.cos(rad) * 88;
      const y1 = Math.sin(rad) * 88;
      const x2 = Math.cos(rad) * 96;
      const y2 = Math.sin(rad) * 96;
      ctx.strokeStyle = 'rgba(193, 139, 97, 0.28)';
      ctx.beginPath();
      ctx.moveTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();
    }

    ctx.restore();
  }

  function updateAndDrawParticles(ctx, cx, cy) {
    ctx.save();
    ctx.translate(cx, cy);
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.alpha -= 0.003;
      if (p.alpha <= 0 || p.y < -110) {
        p.x = (Math.random() - 0.5) * 260;
        p.y = 110;
        p.alpha = Math.random() * 0.6 + 0.3;
      }
      ctx.fillStyle = `rgba(193, 139, 97, ${p.alpha * 0.75})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  function drawSpatialHologram(ctx, cx, cy, tech) {
    ctx.save();
    ctx.translate(cx, cy);

    const angle = tick * 0.024;

    if (tech === 'React') {
      ctx.fillStyle = '#61dafb';
      ctx.beginPath();
      ctx.arc(0, 0, 7, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(97, 218, 251, 0.35)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(0, 0, 14, 0, Math.PI * 2);
      ctx.stroke();

      for (let i = 0; i < 3; i++) {
        ctx.save();
        ctx.rotate(angle * 0.7 + (i * Math.PI) / 3);
        ctx.strokeStyle = '#61dafb';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(0, 0, 52, 17, 0, 0, Math.PI * 2);
        ctx.stroke();

        const electronAngle = angle * 2.2 + i * 2;
        const ex = Math.cos(electronAngle) * 52;
        const ey = Math.sin(electronAngle) * 17;
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ex, ey, 3.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(97, 218, 251, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(ex, ey, 6.5, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      }
    } else if (tech === 'Laravel') {
      ctx.save();
      ctx.rotate(angle * 0.6);
      const size = 38;
      ctx.strokeStyle = '#ff2d20';
      ctx.lineWidth = 2.4;

      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const rad = (i * Math.PI) / 3;
        const px = Math.cos(rad) * size;
        const py = Math.sin(rad) * size;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.lineTo(0, -size);
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(Math.PI / 6) * size, Math.sin(Math.PI / 6) * size);
      ctx.moveTo(0, 0);
      ctx.lineTo(Math.cos(5 * Math.PI / 6) * size, Math.sin(5 * Math.PI / 6) * size);
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 45, 32, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let i = 0; i < 6; i++) {
        const rad = (i * Math.PI) / 3;
        const px = Math.cos(rad) * (size * 0.55);
        const py = Math.sin(rad) * (size * 0.55);
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, 0, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (tech === 'Figma') {
      ctx.save();
      const s = 18;
      const disks = [
        { x: -s, y: -s * 2, color: '#f24e1e' },
        { x: s, y: -s * 2, color: '#ff7262' },
        { x: -s, y: 0, color: '#a259ff' },
        { x: s, y: 0, color: '#1abcfe' },
        { x: -s, y: s * 2, color: '#0acf83' }
      ];

      disks.forEach((d, idx) => {
        const wobble = Math.sin(angle * 1.5 + idx) * 3;
        ctx.fillStyle = d.color;
        ctx.beginPath();
        ctx.arc(d.x, d.y + wobble, s * 0.85, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(d.x, d.y + wobble, s * 0.85, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.strokeStyle = 'rgba(193, 139, 97, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.setLineDash([3, 3]);
      ctx.beginPath();
      ctx.moveTo(-s * 2, -s * 3);
      ctx.lineTo(s * 2, -s * 3);
      ctx.lineTo(s * 2, s * 3);
      ctx.lineTo(-s * 2, s * 3);
      ctx.closePath();
      ctx.stroke();
      ctx.setLineDash([]);
      ctx.restore();
    } else if (tech === 'GitHub' || tech === 'Git') {
      ctx.save();
      ctx.strokeStyle = '#f05032';
      ctx.lineWidth = 3;

      ctx.beginPath();
      ctx.moveTo(-28, 35);
      ctx.lineTo(-28, -35);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(-28, 10);
      ctx.bezierCurveTo(0, 10, 0, -25, 28, -25);
      ctx.stroke();

      const nodes = [
        { x: -28, y: -35, fill: '#f05032' },
        { x: -28, y: 10, fill: '#f05032' },
        { x: -28, y: 35, fill: '#f05032' },
        { x: 28, y: -25, fill: '#38bdf8' }
      ];

      nodes.forEach((n, i) => {
        const pulse = Math.sin(angle * 2 + i) * 1.5;
        ctx.fillStyle = n.fill;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 6.5 + pulse * 0.3, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(n.x, n.y, 3, 0, Math.PI * 2);
        ctx.stroke();
      });

      const flowT = (tick * 0.02) % 1;
      const flowX = -28 + flowT * 56;
      const flowY = 10 + Math.sin(flowT * Math.PI) * -35;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(flowX, flowY, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (tech === 'MySQL') {
      ctx.save();
      const platters = [-28, 0, 28];
      platters.forEach((py, i) => {
        const isMiddle = i === 1;
        ctx.fillStyle = isMiddle ? 'rgba(0, 117, 143, 0.45)' : 'rgba(15, 23, 42, 0.8)';
        ctx.strokeStyle = '#00758f';
        ctx.lineWidth = 2;

        ctx.beginPath();
        ctx.ellipse(0, py, 48, 14, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.strokeStyle = 'rgba(0, 117, 143, 0.35)';
        ctx.beginPath();
        ctx.ellipse(0, py, 26, 7.5, 0, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.strokeStyle = '#00758f';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(-48, -28);
      ctx.lineTo(-48, 28);
      ctx.moveTo(48, -28);
      ctx.lineTo(48, 28);
      ctx.stroke();

      const laserAngle = angle * 1.8;
      const lx = Math.cos(laserAngle) * 44;
      const ly = Math.sin(laserAngle) * 12;
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(lx, ly, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, -28);
      ctx.lineTo(lx, ly);
      ctx.stroke();
      ctx.restore();
    } else if (tech === 'TypeScript' || tech === 'JavaScript') {
      ctx.save();
      ctx.rotate(angle * 0.5);
      const isTS = tech === 'TypeScript';
      const color = isTS ? '#3178c6' : '#f7df1e';

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.strokeRect(-36, -36, 72, 72);

      ctx.strokeStyle = isTS ? 'rgba(49, 120, 198, 0.4)' : 'rgba(247, 223, 30, 0.4)';
      ctx.lineWidth = 1.2;
      ctx.strokeRect(-24, -24, 48, 48);

      ctx.beginPath();
      ctx.moveTo(-36, -36);
      ctx.lineTo(-24, -24);
      ctx.moveTo(36, -36);
      ctx.lineTo(24, -24);
      ctx.moveTo(36, 36);
      ctx.lineTo(24, 24);
      ctx.moveTo(-36, 36);
      ctx.lineTo(-24, 24);
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = 'bold 22px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isTS ? 'TS' : 'JS', 0, 0);
      ctx.restore();
    } else if (tech === 'Tailwind') {
      ctx.save();
      ctx.strokeStyle = '#38bdf8';
      ctx.lineWidth = 2.4;

      for (let w = -1; w <= 1; w += 2) {
        ctx.beginPath();
        for (let t = -42; t <= 42; t += 2) {
          const waveY = (w * 14) + Math.sin(t * 0.12 + angle * 2) * 9;
          if (t === -42) ctx.moveTo(t, waveY);
          else ctx.lineTo(t, waveY);
        }
        ctx.stroke();
      }

      ctx.fillStyle = 'rgba(56, 189, 248, 0.2)';
      ctx.beginPath();
      for (let t = -42; t <= 42; t += 2) {
        const yTop = -14 + Math.sin(t * 0.12 + angle * 2) * 9;
        if (t === -42) ctx.moveTo(t, yTop);
        else ctx.lineTo(t, yTop);
      }
      for (let t = 42; t >= -42; t -= 2) {
        const yBot = 14 + Math.sin(t * 0.12 + angle * 2) * 9;
        ctx.lineTo(t, yBot);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    } else if (tech === 'HTML5' || tech === 'CSS3') {
      ctx.save();
      const isHTML = tech === 'HTML5';
      const color = isHTML ? '#e34f26' : '#1572b6';

      ctx.strokeStyle = color;
      ctx.lineWidth = 2.4;
      ctx.beginPath();
      ctx.moveTo(-32, -38);
      ctx.lineTo(32, -38);
      ctx.lineTo(24, 38);
      ctx.lineTo(0, 48);
      ctx.lineTo(-24, 38);
      ctx.closePath();
      ctx.stroke();

      ctx.strokeStyle = isHTML ? 'rgba(227, 79, 38, 0.35)' : 'rgba(21, 114, 182, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(-20, -26);
      ctx.lineTo(20, -26);
      ctx.lineTo(15, 26);
      ctx.lineTo(0, 34);
      ctx.lineTo(-15, 26);
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = color;
      ctx.font = 'bold 15px "JetBrains Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(isHTML ? '< / >' : '# { }', 0, 0);
      ctx.restore();
    } else if (tech === 'VSCode') {
      ctx.save();
      ctx.rotate(angle * 0.5);
      ctx.strokeStyle = '#007acc';
      ctx.lineWidth = 2.4;

      ctx.beginPath();
      for (let t = 0; t <= Math.PI * 2; t += 0.08) {
        const x = Math.sin(t) * 44;
        const y = Math.sin(t * 2) * 26;
        if (t === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = '#007acc';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    } else if (tech === 'Vercel') {
      ctx.save();
      ctx.rotate(angle * 0.3);
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 2.5;

      ctx.beginPath();
      ctx.moveTo(0, -42);
      ctx.lineTo(38, 28);
      ctx.lineTo(-38, 28);
      ctx.closePath();
      ctx.stroke();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(0, -24);
      ctx.lineTo(22, 16);
      ctx.lineTo(-22, 16);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();
    } else {
      ctx.save();
      ctx.rotate(angle * 0.6);
      ctx.strokeStyle = '#c18b61';
      ctx.lineWidth = 2.4;

      ctx.beginPath();
      for (let i = 0; i < 8; i++) {
        const rad = (i * Math.PI) / 4;
        const px = Math.cos(rad) * 40;
        const py = Math.sin(rad) * 40;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();

      ctx.fillStyle = '#c18b61';
      ctx.beginPath();
      ctx.arc(0, 0, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    ctx.restore();
  }

  function drawHudTelemetry(ctx, w, h, tech, data) {
    ctx.save();
    ctx.fillStyle = 'rgba(193, 139, 97, 0.85)';
    ctx.font = 'bold 7.5px "JetBrains Mono", monospace';

    ctx.fillText(`SYS.TECH // ${tech.toUpperCase()}`, 14, 18);
    ctx.fillText('STATUS: ONLINE', 14, 30);

    ctx.textAlign = 'right';
    ctx.fillText('SYS.RENDER // 120 FPS', w - 14, 18);
    ctx.fillText(`DOMAIN: ${data.domain || 'CORE SYSTEM'}`, w - 14, 30);

    ctx.textAlign = 'left';
    ctx.fillStyle = 'rgba(148, 163, 184, 0.6)';
    ctx.font = '6.5px "JetBrains Mono", monospace';
    ctx.fillText(`NODE: ${data.node}`, 14, h - 14);

    ctx.textAlign = 'right';
    const rotDeg = ((tick * 1.37) % 360).toFixed(1);
    ctx.fillText(`ROT.MATRIX: ${rotDeg}°`, w - 14, h - 14);

    ctx.restore();
  }

  function startCanvasLoop() {
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    initParticles();

    function renderFrame() {
      const w = canvas.width;
      const h = canvas.height;
      tick++;

      const data = blueprints[activeTech] || blueprints.React;

      drawRadarAndGrid(ctx, w, h);
      updateAndDrawParticles(ctx, w / 2, h / 2 - 10);
      drawSpatialHologram(ctx, w / 2, h / 2 - 10, activeTech);
      drawHudTelemetry(ctx, w, h, activeTech, data);
      drawScanlines(ctx, w, h);

      animId = requestAnimationFrame(renderFrame);
    }

    if (animId) cancelAnimationFrame(animId);
    animId = requestAnimationFrame(renderFrame);
  }

  function typewriteCode(fullText) {
    if (typeTimer) clearInterval(typeTimer);
    if (!codeEl) return;

    codeEl.textContent = '';
    let charIdx = 0;
    const speed = fullText.length > 300 ? 5 : 8;

    typeTimer = setInterval(() => {
      if (charIdx < fullText.length) {
        codeEl.textContent += fullText[charIdx];
        charIdx++;
        codeEl.parentElement.scrollTop = codeEl.parentElement.scrollHeight;
      } else {
        clearInterval(typeTimer);
      }
    }, speed);
  }

  function startTelemetryFluctuation() {
    if (telemetryTimer) clearInterval(telemetryTimer);
    telemetryTimer = setInterval(() => {
      if (latencyEl) {
        const ping = (1.8 + Math.random() * 2.2).toFixed(1);
        latencyEl.textContent = `${ping}ms`;
      }
    }, 2400);
  }

  function openSimulation(techKey) {
    const data = blueprints[techKey] || blueprints.React;
    activeTech = techKey;

    if (tagBadge) tagBadge.textContent = data.tag;
    if (titleEl) titleEl.textContent = data.title;
    if (filenameEl) filenameEl.textContent = data.file;
    if (nodeEl) nodeEl.textContent = data.stat3 || data.node;
    if (latencyEl) latencyEl.textContent = data.stat2 || '3.2ms';
    if (hudBadge) hudBadge.textContent = data.hud;

    const statLabelEl = document.querySelector('.terminal-telemetry-bar .telemetry-stat:first-child .stat-label');
    const statValEl = document.querySelector('.terminal-telemetry-bar .telemetry-stat:first-child .stat-val');
    if (statLabelEl) statLabelEl.textContent = 'STATUS';
    if (statValEl) statValEl.textContent = data.stat1 || 'COMPILED 100%';

    dialog.showModal();
    document.body.classList.add('dialog-open');

    startCanvasLoop();
    typewriteCode(data.code);
    startTelemetryFluctuation();

    if (closeBtn) closeBtn.focus();
  }

  function closeSimulation() {
    if (animId) {
      cancelAnimationFrame(animId);
      animId = null;
    }
    if (typeTimer) clearInterval(typeTimer);
    if (telemetryTimer) clearInterval(telemetryTimer);

    dialog.close();
    document.body.classList.remove('dialog-open');

    if (lastFocusedEl) {
      lastFocusedEl.focus();
      lastFocusedEl = null;
    }
  }

  tags.forEach(tag => {
    const tech = tag.getAttribute('data-tech') || tag.textContent.trim();
    tag.addEventListener('click', () => {
      lastFocusedEl = tag;
      openSimulation(tech);
    });

    tag.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        lastFocusedEl = tag;
        openSimulation(tech);
      }
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeSimulation);
  }

  dialog.addEventListener('click', e => {
    const rect = dialog.getBoundingClientRect();
    const isInDialog = (
      rect.top <= e.clientY &&
      e.clientY <= rect.top + rect.height &&
      rect.left <= e.clientX &&
      e.clientX <= rect.left + rect.width
    );
    if (!isInDialog) {
      closeSimulation();
    }
  });

  dialog.addEventListener('cancel', e => {
    e.preventDefault();
    closeSimulation();
  });
}
