import fs from 'fs';
import path from 'path';

// --- Color Palette (Tailwind & Custom) ---
const C = {
    white: '#ffffff',
    slate50: '#f8fafc',
    slate100: '#f1f5f9',
    slate200: '#e2e8f0',
    slate300: '#cbd5e1',
    slate400: '#94a3b8',
    slate500: '#64748b',
    slate600: '#475569',
    slate700: '#334155',
    slate800: '#1e293b',
    slate900: '#0f172a',

    blue50: '#eff6ff',
    blue400: '#60a5fa',
    blue500: '#3b82f6',
    blue600: '#2563eb',

    indigo500: '#6366f1',
    pink600: '#db2777',
    orange500: '#f97316',
    orange600: '#ea580c',

    // VS Code Theme
    ideBg: '#1e1e1e',
    ideSidebar: '#252526',
    ideActivityBar: '#2d2d2d',
    ideStatus: '#007acc',
    ideText: '#cccccc',
    ideBlue: '#9cdcfe',
    ideYellow: '#dcdcaa',
    ideOrange: '#ce9178',
    idePurple: '#c586c0',
    ideGreen: '#4ec9b0',
    ideGray: '#858585',
    ideBorder: '#1e1e1e'
};

// --- Icons (Simplified SVG Paths) ---
const ICONS = {
    folder: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z",
    search: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z",
    grid: "M3 3h7v7H3V3zm11 0h7v7h-7V3zm0 11h7v7h-7v-7zM3 14h7v7H3v-7z", // 4 squares
    users: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
    settings: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z",
    layout: "M3 3h18v18H3V3zm18 0H3v18h18V3z M5 5h5v5H5V5zm7 0h7v5h-7V5zm0 7h7v7h-7v-7zM5 12h5v7H5v-7z", // Simulated layout
    chevronDown: "M6 9l6 6 6-6",
    arrowLeft: "M19 12H5m7 7l-7-7 7-7",
    plus: "M12 4v16m8-8H4",
    bell: "M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9",
    list: "M4 6h16M4 12h16M4 18h16"
};

// --- SVG Builder Helper ---
class SvgBuilder {
    private elements: string[] = [];
    private width: number;
    private height: number;

    constructor(width: number, height: number, bgColor: string = '#ffffff') {
        this.width = width;
        this.height = height;
        // Background
        this.rect(0, 0, width, height, bgColor);
    }

    rect(x: number, y: number, w: number, h: number, fill: string, stroke?: string, strokeWidth?: number, rx?: number, opacity?: number) {
        let attrs = `x="${x}" y="${y}" width="${w}" height="${h}" fill="${fill}"`;
        if (stroke) attrs += ` stroke="${stroke}" stroke-width="${strokeWidth || 1}"`;
        if (rx) attrs += ` rx="${rx}"`;
        if (opacity !== undefined) attrs += ` opacity="${opacity}"`;
        this.elements.push(`<rect ${attrs} />`);
        return this;
    }

    circle(cx: number, cy: number, r: number, fill: string, stroke?: string, opacity?: number) {
        let attrs = `cx="${cx}" cy="${cy}" r="${r}" fill="${fill}"`;
        if (stroke) attrs += ` stroke="${stroke}"`;
        if (opacity !== undefined) attrs += ` opacity="${opacity}"`;
        this.elements.push(`<circle ${attrs} />`);
        return this;
    }

    text(x: number, y: number, content: string, fontSize: number = 12, fill: string = '#000000', fontWeight: string = 'normal', opacity?: number, align: 'start' | 'middle' | 'end' = 'start') {
        const safeContent = content.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        let attrs = `x="${x}" y="${y}" font-family="Inter, sans-serif" font-size="${fontSize}" fill="${fill}" font-weight="${fontWeight}" text-anchor="${align}"`;
        if (opacity !== undefined) attrs += ` opacity="${opacity}"`;
        this.elements.push(`<text ${attrs}>${safeContent}</text>`);
        return this;
    }

    // New: Path support for icons
    path(d: string, fill: string = 'none', stroke: string = 'none', strokeWidth: number = 0, transform?: string) {
        let attrs = `d="${d}" fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"`;
        if (transform) attrs += ` transform="${transform}"`;
        this.elements.push(`<path ${attrs} />`);
        return this;
    }

    // Helper to draw an icon centrally in a box
    icon(name: keyof typeof ICONS, x: number, y: number, size: number, color: string, fill: boolean = false) {
        // Simple centering hack for standard icons (assuming ~24x24 viewBox originally)
        const scale = size / 24;
        // We translate to x,y then scale
        const transform = `translate(${x}, ${y}) scale(${scale})`;
        // Most Lucide icons are strokes, but we can support fills
        if (fill) {
            this.path(ICONS[name], color, 'none', 0, transform);
        } else {
            this.path(ICONS[name], 'none', color, 2, transform);
        }
        return this;
    }

    toString() {
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${this.width} ${this.height}">
<style>@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');</style>
${this.elements.join('\n')}
</svg>`;
    }
}

// --- High Fidelity Generators ---

function generateFigmaLayout(): string {
    const w = 1440, h = 900;
    const svg = new SvgBuilder(w, h, '#fcfcfc');

    // Sidebar
    svg.rect(0, 0, 260, h, C.white, C.slate200, 1);

    // Team Header
    svg.rect(16, 16, 24, 24, '#000000', undefined, undefined, 4);
    svg.text(23, 33, "A", 14, C.white, 'bold', undefined, 'middle');
    svg.text(52, 33, "Antonio's Team", 14, C.slate900, 'bold');
    svg.icon('chevronDown', 220, 20, 16, C.slate400);

    // Sidebar items
    const menuY = 60;
    svg.rect(12, menuY, 236, 32, C.blue50, undefined, undefined, 4);
    svg.text(48, menuY + 20, "Recents", 14, C.blue600, '500');
    svg.icon('layout', 24, menuY + 8, 16, C.blue600); // Clock substitute

    svg.text(48, menuY + 52, "Drafts", 14, C.slate600);
    svg.icon('layout', 24, menuY + 40, 16, C.slate600); // Monitor sub

    // Main
    svg.text(300, 50, "Recently viewed", 20, C.slate900, '500');

    // Grid
    const cards = [
        "Payer Platform Architecture", "Claims Processing Flow",
        "Identity Management", "AWS Infrastructure"
    ];

    cards.forEach((title, i) => {
        const cx = 300 + (i * 280);
        const cy = 80;
        // Card Body
        svg.rect(cx, cy, 260, 200, C.slate100, C.slate200, 1, 8);
        // Preview Box
        svg.rect(cx + 20, cy + 20, 220, 120, C.white, C.slate200, 1, 4, 0.8);
        // Icon
        svg.icon('layout', cx + 118, cy + 70, 24, C.slate300);

        // Footer Text
        svg.text(cx, cy + 220, title, 14, C.slate900, '500');
        svg.text(cx, cy + 238, "2 mins ago", 12, C.slate500);
    });

    return svg.toString();
}

function generateMuralLayout(): string {
    const w = 1440, h = 900;
    const svg = new SvgBuilder(w, h, '#fdfdfd');

    // Navbar
    svg.rect(0, 0, w, 64, C.white, C.slate200, 1);
    svg.text(24, 40, "Arkhitekton", 18, C.pink600, 'bold');
    svg.text(140, 38, "Home", 14, C.slate900, '500');
    svg.text(200, 38, "Templates", 14, C.slate600, '500');

    // Search
    svg.rect(w - 400, 16, 250, 32, C.slate100, undefined, undefined, 8);
    svg.icon('search', w - 390, 20, 16, C.slate400);
    svg.text(w - 360, 37, "Search murals...", 14, C.slate400);

    // Button
    svg.rect(w - 130, 16, 100, 32, C.pink600, undefined, undefined, 6);
    svg.text(w - 80, 37, "+ New mural", 13, C.white, '500', undefined, 'middle');

    // Hero
    svg.text(60, 140, "Good morning, Antonio", 32, C.slate800, '300');

    // Template Row
    const templates = [
        { c: '#fef9c3', t: 'Engineering', i: 'layout' },
        { c: '#dcfce7', t: 'Strategy', i: 'grid' },
        { c: '#f3e8ff', t: 'Design', i: 'users' },
    ];

    templates.forEach((t, i) => {
        const x = 60 + (i * 220);
        svg.rect(x, 200, 200, 120, t.c, undefined, undefined, 8);
        svg.icon(t.i as any, x + 20, 220, 24, C.slate800);
        svg.text(x + 20, 300, t.t, 16, C.slate800, '600');
    });

    return svg.toString();
}

function generateMiroLayout(): string {
    const w = 1440, h = 900;
    const svg = new SvgBuilder(w, h, C.white);

    // Sidebar Deep
    svg.rect(0, 0, 70, h, '#050038');
    // Team Icon
    svg.rect(14, 20, 42, 42, C.blue600, undefined, undefined, 8);
    svg.text(35, 46, "A", 20, C.white, 'bold', undefined, 'middle');
    // Plus
    svg.rect(18, 80, 34, 34, 'none', C.white, 1, 8, 0.3);
    svg.icon('plus', 23, 85, 24, C.slate400);

    // Left Panel
    svg.rect(70, 0, 260, h, C.slate50, C.slate200, 1);
    svg.text(90, 40, "Arkhitekton", 16, C.slate800, 'bold');

    // Menu
    svg.rect(82, 70, 236, 32, C.blue50, undefined, undefined, 6); // Active
    svg.text(118, 91, "All boards", 14, '#1d4ed8', '500'); // blue-700
    svg.icon('layout', 90, 74, 16, '#1d4ed8');

    svg.text(118, 131, "Starred", 14, C.slate600);
    svg.icon('plus', 90, 114, 16, C.slate600); // Used plus as star placeholder

    // Main
    const mx = 360;
    // Search
    svg.rect(mx, 20, 600, 44, C.white, C.slate300, 1, 6);
    svg.icon('search', mx + 12, 30, 20, C.slate400);
    svg.text(mx + 44, 47, "Search boards...", 14, C.slate400);

    // Grid
    svg.text(mx, 120, "Recent Boards", 18, C.slate900, 'bold');

    [0, 1, 2].forEach(i => {
        const x = mx + (i * 260);
        const y = 150;
        svg.rect(x, y, 240, 180, C.white, C.slate200, 1, 4);
        svg.rect(x, y, 240, 120, '#fefce8'); // Yellow preview
        svg.text(x + 16, y + 150, `Board ${i + 1}`, 14, C.slate900, '500');
        svg.text(x + 16, y + 168, "Modified yesterday", 12, C.slate500);
    });

    return svg.toString();
}

function generateEnterpriseLayout(): string {
    const w = 1440, h = 900;
    const svg = new SvgBuilder(w, h, C.slate50);

    // Header
    svg.rect(0, 0, w, 64, C.white, C.slate200, 1);
    svg.rect(24, 20, 24, 24, "url(#grad1)", undefined, undefined, 4);
    // Gradient def would be nice, simulating with solid orange
    svg.rect(24, 20, 24, 24, C.orange600, undefined, undefined, 4);

    svg.text(60, 38, "ARKHITEKTON", 18, C.slate900, 'bold');

    ['Dashboard', 'Governance', 'Catalog'].forEach((t, i) => {
        svg.text(200 + (i * 100), 38, t, 14, i === 0 ? C.orange600 : C.slate500, '500');
    });

    // Content
    const cx = 40;
    // Stats Cards
    [
        { l: 'My Active Models', v: '12', c: C.slate900 },
        { l: 'Pending Reviews', v: '3', c: C.orange600 },
        { l: 'Policy Violations', v: '1', c: C.pink600 }
    ].forEach((s, i) => {
        const x = cx + (i * 320);
        const y = 100;
        svg.rect(x, y, 300, 120, C.white, C.slate200, 1, 8);
        svg.text(x + 24, y + 40, s.l, 14, C.slate500);
        svg.text(x + 24, y + 90, s.v, 36, s.c, 'bold');
    });

    // Large Activity Table
    svg.rect(cx, 260, 940, 500, C.white, C.slate200, 1, 8);
    svg.text(cx + 24, 300, "Recent Activity", 18, C.slate900, 'bold');

    [0, 1, 2, 3].forEach(i => {
        const y = 340 + (i * 70);
        svg.rect(cx, y, 940, 1, C.slate100); // Divider
        svg.icon('layout', cx + 24, y + 20, 20, C.blue600);
        svg.text(cx + 60, y + 35, `Architecture Update ${i + 101}`, 14, C.slate900, '500');
        svg.rect(cx + 800, y + 16, 80, 24, C.slate100, undefined, undefined, 12);
        svg.text(cx + 840, y + 32, "System", 12, C.slate600, 'normal', undefined, 'middle');
    });

    return svg.toString();
}

function generateHybridLayout(): string {
    const w = 1440, h = 900;
    const svg = new SvgBuilder(w, h, '#f9f9fa');

    // Hero Background
    svg.rect(0, 0, w, 320, C.white, C.slate100, 1);

    // Center Content
    const mx = (w / 2);
    svg.text(mx, 100, "What are you building today?", 32, C.slate800, '600', undefined, 'middle');

    // Search Bar
    const sx = mx - 300;
    svg.rect(sx, 140, 600, 64, C.white, C.slate100, 1, 32);
    // Shadow effect simulation
    svg.rect(sx, 144, 600, 64, '#000000', undefined, undefined, 32, 0.05); // Shadow

    svg.icon('search', sx + 24, 160, 24, C.slate400);
    svg.text(sx + 64, 177, "Search diagrams, objects, or people...", 16, C.slate400);

    // Grid
    const gx = 100;
    svg.text(gx, 400, "Your Work", 20, C.slate800, '600');

    // Add New Card
    svg.rect(gx, 440, 300, 200, 'none', C.slate300, 2, 16, 1); // Dashed stroke not supported in builder easily, using solid
    svg.icon('plus', gx + 135, 525, 30, C.indigo500);
    svg.text(gx + 150, 560, "Create new diagram", 16, C.slate500, '500', undefined, 'middle');

    const cards = [
        { t: "Payer Platform", c: C.blue400 },
        { t: "Claims Processing", c: C.indigo500 },
        { t: "Identity Service", c: C.orange500 }
    ];

    cards.forEach((c, i) => {
        const x = gx + 340 + (i * 340);
        const y = 440;
        if (x + 300 > w) return;

        svg.rect(x, y, 300, 200, C.white, C.slate100, 1, 16);
        // Color top decorative
        svg.rect(x, y, 300, 120, C.slate50, undefined, undefined, 16); // Clip?

        // Mock content
        svg.rect(x + 30, y + 30, 240, 60, C.white, undefined, undefined, 4, 0.8);

        svg.text(x + 20, y + 150, c.t, 16, C.slate900, '600');
        svg.circle(x + 26, y + 175, 4, c.c);
        svg.text(x + 38, y + 179, "Updated recently", 12, C.slate500);
    });

    return svg.toString();
}

function generateIdeLayout(): string {
    const w = 1440, h = 900;
    const svg = new SvgBuilder(w, h, C.ideBg);

    // Activity Bar
    const abW = 48;
    svg.rect(0, 0, abW, h, C.ideActivityBar, C.ideBorder, 1);
    [20, 70, 120, 170].forEach((y, i) => {
        const icon = ['folder', 'search', 'grid', 'users'][i];
        // Using white/gray based on active state
        svg.icon(icon as any, 12, y, 24, i === 0 ? C.white : C.ideGray);
        if (i === 0) svg.rect(0, y - 4, 2, 32, C.white); // Active indicator
    });
    svg.icon('settings', 12, h - 50, 24, C.ideGray);

    // Sidebar
    const sbW = 260;
    const sbX = abW;
    svg.rect(sbX, 0, sbW, h, C.ideSidebar, C.ideBorder, 1);
    svg.text(sbX + 20, 30, "EXPLORER", 11, C.ideGray, 'bold');

    // File Tree
    const ftY = 60;
    svg.icon('chevronDown', sbX + 10, ftY - 10, 16, C.ideText);
    svg.text(sbX + 26, ftY, "ARKHITEKTON-CORE", 12, C.ideText, 'bold');

    const folders = ['models', 'diagrams', 'docs', 'src'];
    folders.forEach((f, i) => {
        const y = ftY + 30 + (i * 24);
        svg.icon('chevronDown', sbX + 20, y - 10, 14, C.ideGray);
        svg.icon('folder', sbX + 38, y - 10, 14, C.blue400); // Blue folder
        svg.text(sbX + 60, y + 2, f, 13, C.ideText);
    });

    const files = ["payer_platform.arch", "identity_mgmt.arch", "claims.arch"];
    files.forEach((f, i) => {
        const y = ftY + 130 + (i * 24);
        svg.icon('layout', sbX + 38, y - 10, 14, C.ideYellow);
        svg.text(sbX + 60, y + 2, f, 13, i === 0 ? C.white : C.ideText); // Active file highlighting
        if (i === 0) svg.rect(sbX, y - 16, sbW, 24, '#37373d', undefined, undefined, 0); // Active bg
    });

    // Main Editor
    const edX = sbX + sbW;
    const edW = w - edX;

    // Tabs
    svg.rect(edX, 0, edW, 35, C.ideSidebar);
    // Active Tab
    svg.rect(edX, 0, 180, 35, C.ideBg, undefined, undefined);
    svg.rect(edX, 0, 180, 2, C.ideStatus); // Top blue line
    svg.icon('layout', edX + 10, 10, 14, C.ideYellow);
    svg.text(edX + 32, 22, "payer_platform.arch", 13, C.white);
    svg.text(edX + 160, 22, "x", 12, C.ideGray);

    // Inactive Tab
    svg.rect(edX + 180, 0, 180, 35, '#2d2d2d');
    svg.icon('layout', edX + 190, 10, 14, C.ideYellow);
    svg.text(edX + 212, 22, "identity_mgmt.arch", 13, C.ideGray);

    // Breadcrumbs
    svg.rect(edX, 35, edW, 26, C.ideBg);
    svg.text(edX + 16, 52, "arkhitekton-core > diagrams > payer_platform.arch", 12, C.ideGray);

    // Editor Content (Code)
    const codeY = 90;
    const lh = 24; // line height

    // Grid bg
    // dots pattern simulation
    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 20; j++) {
            svg.circle(edX + 50 + (i * 40), codeY + 50 + (j * 40), 1, C.ideGray, undefined, 0.2);
        }
    }

    const codeLines = [
        { t: "service PayerPortal {", c: C.idePurple },
        { t: "  type: 'frontend'", c: C.ideBlue },
        { t: "  connects_to: [", c: C.ideOrange },
        { t: "    IdentityService,", c: C.ideGreen },
        { t: "    ClaimsDB", c: C.ideGreen },
        { t: "  ]", c: C.ideOrange },
        { t: "}", c: C.idePurple }
    ];

    codeLines.forEach((l, i) => {
        svg.text(edX + 40, codeY + (i * lh), l.t, 14, l.c, 'normal', undefined, 'start'); // Monospace font? Inter works okay
    });

    // Bottom Panel (Terminal)
    const termH = 200;
    const termY = h - 22 - termH;
    svg.rect(edX, termY, edW, termH, C.ideSidebar, C.ideBorder, 1);

    // Panel Tabs
    svg.text(edX + 20, termY + 24, "PROBLEMS  OUTPUT  TERMINAL", 12, C.ideGray, 'bold');
    svg.rect(edX + 150, termY + 30, 60, 2, C.white); // Terminal underline

    // Terminal Text
    svg.text(edX + 20, termY + 60, "[Info] Arkhitekton Language Server initialized", 13, C.ideText, 'normal', undefined, 'start');
    svg.text(edX + 20, termY + 80, "> Compiling architectural models...", 13, C.ideText);
    svg.text(edX + 20, termY + 100, "> Success. 0 Errors.", 13, C.ideGreen);

    // Footer (Status bar)
    svg.rect(0, h - 22, w, 22, C.ideStatus);
    svg.icon('x', 10, h - 12, 12, C.white); // Simulating error icon
    svg.text(30, h - 7, "0", 12, C.white);
    svg.text(w - 100, h - 7, "ArchScript", 12, C.white);

    return svg.toString();
}

// --- Execution ---
const artifactsDir = '/Users/antonio.d.jones/.gemini/antigravity/brain/9f72a56e-2313-4a65-841e-9a3e0d51fc65';

const layouts = [
    { name: 'ARKDL-00001_Figma_Style', fn: generateFigmaLayout },
    { name: 'ARKDL-00002_Mural_Style', fn: generateMuralLayout },
    { name: 'ARKDL-00003_Miro_Style', fn: generateMiroLayout },
    { name: 'ARKDL-00004_Enterprise_Style', fn: generateEnterpriseLayout },
    { name: 'ARKDL-00005_Hybrid_Style', fn: generateHybridLayout },
    { name: 'ARKDL-00006_IDE_Style', fn: generateIdeLayout },
];

console.log("Generating High-Fidelity SVGS...");
layouts.forEach(layout => {
    try {
        const svgContent = layout.fn();
        const filePath = path.join(artifactsDir, `${layout.name}.svg`);
        fs.writeFileSync(filePath, svgContent);
        console.log(`Generated: ${filePath}`);
    } catch (e) {
        console.error(`Error generating ${layout.name}:`, e);
    }
});
console.log("Done.");
