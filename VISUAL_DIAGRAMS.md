# 📐 UI/UX Component Diagrams

## Layout Architecture Diagram

```
╔════════════════════════════════════════════════════════════════════════════╗
║                           EDITOR CONTAINER                                ║
║ (display: flex, flex-direction: column, height: 100vh)                    ║
║                                                                            ║
║ ┌─────────────────────────────────────────────────────────────────────┐   ║
║ │  EDITOR HEADER (height: 60px, flex-shrink: 0)                      │   ║
║ │  (display: flex, justify-content: space-between)                   │   ║
║ │                                                                     │   ║
║ │  ┌─────────────────────────┬────────────────────┬────────────────┐ │   ║
║ │  │ Header Left             │ Session Info      │ Header Right   │ │   ║
║ │  │ (display: flex, gap: 16)│ (display: flex)  │ (display: flex)│ │   ║
║ │  │                         │                    │               │ │   ║
║ │  │ • Branding              │ • Session Label   │ • Lang Select │ │   ║
║ │  │   - Code Icon           │ • Session Title   │ • Execute Btn │ │   ║
║ │  │   - "CodeCrafter"       │   (truncated)     │ • Participant │ │   ║
║ │  │                         │                    │   Badge       │ │   ║
║ │  │ • Connection Status     │                    │               │ │   ║
║ │  │   - Indicator (● or ○)  │                    │               │ │   ║
║ │  │   - "Connected/Disc"    │                    │               │ │   ║
║ │  └─────────────────────────┴────────────────────┴────────────────┘ │   ║
║ └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                            ║
║ ┌─────────────────────────────────────────────────────────────────────┐   ║
║ │  EDITOR MAIN (flex: 1, display: flex, overflow: hidden)            │   ║
║ │                                                                     │   ║
║ │  ┌──────────┬──────────────────────────┬────────────────────────┐  │   ║
║ │  │ SIDEBAR  │ EDITOR PANEL             │ OUTPUT PANEL          │  │   ║
║ │  │ (50px)   │ (flex: 1.5)              │ (flex: 1)             │  │   ║
║ │  │          │                          │                       │  │   ║
║ │  │ Icons:   │ ┌──────────────────────┐ │ ┌────────────────────┐ │  │   ║
║ │  │ • Link   │ │ Panel Header (38px)  │ │ │ Panel Header (38px)│ │  │   ║
║ │  │ • Users  │ │ "Code Editor" | js  │ │ │ "Output"           │ │  │   ║
║ │  │ • Folder │ └──────────────────────┘ │ └────────────────────┘ │  │   ║
║ │  │ • Chat   │                          │                       │  │   ║
║ │  │ • Clock  │ ┌──────────────────────┐ │ ┌────────────────────┐ │  │   ║
║ │  │          │ │                      │ │ │                    │ │  │   ║
║ │  │ Toggle   │ │  Monaco Editor       │ │ │  Output Content   │ │  │   ║
║ │  │ ◄/►      │ │  (flex: 1)           │ │ │  (flex: 1)        │ │  │   ║
║ │  │          │ │                      │ │ │                    │ │  │   ║
║ │  │          │ │  • Syntax Highlight │ │ │  (monospace text)  │ │  │   ║
║ │  │          │ │  • 100+ Languages   │ │ │                    │ │  │   ║
║ │  │          │ │  • Auto-Complete    │ │ │                    │ │  │   ║
║ │  │          │ └──────────────────────┘ │ └────────────────────┘ │  │   ║
║ │  │          │                          │                       │  │   ║
║ │  │          │                          │ ┌────────────────────┐ │  │   ║
║ │  │          │                          │ │ Execution Meta     │ │  │   ║
║ │  │          │                          │ │ • Time: XXXms      │ │  │   ║
║ │  │          │                          │ │ • Errors (if any)  │ │  │   ║
║ │  │          │                          │ └────────────────────┘ │  │   ║
║ │  └──────────┴──────────────────────────┴────────────────────────┘  │   ║
║ └─────────────────────────────────────────────────────────────────────┘   ║
║                                                                            ║
╚════════════════════════════════════════════════════════════════════════════╝
```

## Sidebar Panel System

```
┌─ SIDEBAR (width: auto, flex-direction: column) ─┐
│                                                  │
│  ┌─ ICONS (50px wide, display: flex) ─────────┐ │
│  │                                              │ │
│  │  [  🔗  ]  ← Sessions (active: blue bar)    │ │
│  │  [  👥  ]  ← Participants                   │ │
│  │  [  📁  ]  ← Explorer                       │ │
│  │  [  💬  ]  ← Chat                           │ │
│  │  [  ⏱️  ]  ← History                       │ │
│  │                                              │ │
│  │  ─────────── divider ───────────             │ │
│  │                                              │ │
│  │  [  ◄   ]  ← Collapse Button (bottom)       │ │
│  │                                              │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
│  ┌─ PANEL CONTENT (250-350px, flex: 1) ───────┐ │
│  │                                              │ │
│  │  ┌──────────────────────────────────────┐   │ │
│  │  │ Panel Header (38px)                 │   │ │
│  │  │ "🔗 Sessions"        [🔄 Refresh]   │   │ │
│  │  └──────────────────────────────────────┘   │ │
│  │                                              │ │
│  │  ┌──────────────────────────────────────┐   │ │
│  │  │ Sessions List                        │   │ │
│  │  │                                      │   │ │
│  │  │ ┌─────────────────────────────────┐  │   │ │
│  │  │ │ Session Title                  │  │   │ │
│  │  │ │ js    👥 3    [Public]        │  │   │ │
│  │  │ │ (left border: accent if active)  │  │   │ │
│  │  │ └─────────────────────────────────┘  │   │ │
│  │  │                                      │   │ │
│  │  │ ┌─────────────────────────────────┐  │   │ │
│  │  │ │ Another Session                 │  │   │ │
│  │  │ │ python  👥 2                   │  │   │ │
│  │  │ └─────────────────────────────────┘  │   │ │
│  │  │                                      │   │ │
│  │  └──────────────────────────────────────┘   │ │
│  │                                              │ │
│  │  ┌──────────────────────────────────────┐   │ │
│  │  │ Panel Footer (12px padding)         │   │ │
│  │  │ [+ New Session]                    │   │ │
│  │  └──────────────────────────────────────┘   │ │
│  │                                              │ │
│  └──────────────────────────────────────────────┘ │
│                                                  │
└──────────────────────────────────────────────────┘
```

## Participants Panel Structure

```
┌─ PARTICIPANTS PANEL ──────────────────┐
│                                       │
│ ┌─────────────────────────────────┐   │
│ │ Panel Header                    │   │
│ │ "👥 Participants"      [3]      │   │
│ └─────────────────────────────────┘   │
│                                       │
│ ┌─────────────────────────────────┐   │
│ │ Participants List               │   │
│ │                                 │   │
│ │ ┌───────────────────────────┐   │   │
│ │ │ [A]  Alice          | 👑  │   │   │
│ │ │ avatar (color)│         (Owner)                │   │
│ │ │              └────────────┘   │   │
│ │ │ (online status: ● or ○)    │   │
│ │ ├───────────────────────────┤   │   │
│ │ │ [B]  Bob            | ✏️  │   │   │
│ │ │ avatar (color)│ Editor   │   │   │
│ │ │              └────────────┘   │   │
│ │ └───────────────────────────┘   │   │
│ │ ┌───────────────────────────┐   │   │
│ │ │ [C]  Charlie        | 👁️  │   │   │
│ │ │ avatar (color)│ Viewer   │   │   │
│ │ │              └────────────┘   │   │
│ │ └───────────────────────────┘   │   │
│ │                                 │   │
│ └─────────────────────────────────┘   │
│                                       │
│ ┌─────────────────────────────────┐   │
│ │ Panel Footer (Legend)           │   │
│ │                                 │   │
│ │ Role Legend:                    │   │
│ │ 👑 Owner - Full control        │   │
│ │ ✏️ Editor - Can edit code       │   │
│ │ 👁️ Viewer - Read-only           │   │
│ └─────────────────────────────────┘   │
│                                       │
└───────────────────────────────────────┘
```

## Header Control Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  HEADER (60px)                                                  │
│                                                                │
│  ┌─ LEFT ────────────────────────┬─ RIGHT ─────────────────┐  │
│  │                                │                         │  │
│  │ ┌──────────────────────────┐  │ ┌──────────────────────┐│  │
│  │ │ Branding                 │  │ │ Language Selector    ││  │
│  │ │                          │  │ │ <select>             ││  │
│  │ │ [Code Icon] CodeCrafter  │  │ │ JavaScript           ││  │
│  │ │                          │  │ │ Python               ││  │
│  │ └──────────────────────────┘  │ │ ...                  ││  │
│  │                                │ └──────────────────────┘│  │
│  │ ┌──────────────────────────┐  │                         │  │
│  │ │ Status Indicator         │  │ ┌──────────────────────┐│  │
│  │ │                          │  │ │ Execute Button       ││  │
│  │ │ ● Connected (pulse)      │  │ │                      ││  │
│  │ │ ○ Disconnected           │  │ │ [Play Icon] Execute  ││  │
│  │ └──────────────────────────┘  │ │ (hover: lift + glow) ││  │
│  │                                │ │ (loading: "Running...")││  │
│  │ ┌──────────────────────────┐  │ └──────────────────────┘│  │
│  │ │ Session Info             │  │                         │  │
│  │ │                          │  │ ┌──────────────────────┐│  │
│  │ │ Session: IntroSession    │  │ │ Participants Count   ││  │
│  │ │ (truncated if long)      │  │ │                      ││  │
│  │ │ Accent color for name    │  │ │ [Users Icon] 4       ││  │
│  │ └──────────────────────────┘  │ │ (accent background)  ││  │
│  │                                │ └──────────────────────┘│  │
│  └─────────────────────────────┬──────────────────────────┘  │
│                                │                              │
└────────────────────────────────┴──────────────────────────────┘
```

## Editor & Output Panel Details

```
EDITOR PANEL (1.5x flex)          OUTPUT PANEL (1x flex)
┌──────────────────────────────┐  ┌──────────────────────────┐
│ Panel Header (38px)          │  │ Panel Header (38px)      │
│ "Code Editor"  [js]          │  │ "Output"                 │
├──────────────────────────────┤  ├──────────────────────────┤
│                              │  │                          │
│  ┌──────────────────────┐    │  │ ┌────────────────────┐   │
│  │                      │    │  │ │                    │   │
│  │   Monaco Editor      │    │  │ │   Output Content   │   │
│  │                      │    │  │ │   (monospace)      │   │
│  │   • Syntax Highlight │    │  │ │                    │   │
│  │   • Auto-Complete    │    │  │ │  Line 1: result    │   │
│  │   • Line Numbers     │    │  │ │  Line 2: ...       │   │
│  │   • Gutter Icons     │    │  │ │  (scrollable)      │   │
│  │   • Theme: Dark      │    │  │ │                    │   │
│  │                      │    │  │ │                    │   │
│  │ Code Example:        │    │  │ └────────────────────┘   │
│  │                      │    │  │                          │
│  │ 1 | console.log(...) │    │  │  ┌────────────────────┐  │
│  │ 2 | const x = 5      │    │  │  │ Execution Meta     │  │
│  │ 3 | return x         │    │  │  │ ⏱️ 123ms           │  │
│  │                      │    │  │  │ ❌ Error: ReferenceError
│  │                      │    │  │  └────────────────────┘  │
│  │                      │    │  │                          │
│  └──────────────────────┘    │  │  ┌────────────────────┐  │
│                              │  │  │ Error Alert        │  │
│                              │  │  │ ⚠️ Execution failed│  │
│                              │  │  │ Check console      │  │
│                              │  │  └────────────────────┘  │
└──────────────────────────────┘  └──────────────────────────┘
```

## Responsive Breakpoints

```
DESKTOP (1200px+)                TABLET (768px - 1200px)
┌────────────────────────────┐   ┌────────────────────┐
│ Header (full width)        │   │ Header (full width)│
├────┬─────────┬─────────┤   ├──┬──────────────┤
│ 50 │ Editor  │ Output  │   │50│  Editor      │
│ px │ (1.5x)  │ (1x)    │   │px│ (full width)│
│    │         │         │   │  │              │
│    │         │         │   ├──┴──────────────┤
│    │         │         │   │50│              │
│    │         │         │   │px│   Output     │
│    │         │         │   │  │  (below)     │
└────┴─────────┴─────────┘   └──┴──────────────┘

MOBILE (< 768px)
┌───────────────────────┐
│ Header (stacked)      │
├───────────────────────┤
│ Code Editor           │
│ (full width)          │
├───────────────────────┤
│ Output                │
│ (scrollable)          │
├───────────────────────┤
│ Sidebar (toggle)      │
│ [☰ Menu]              │
└───────────────────────┘
```

## Color Palette Visualization

```
BACKGROUNDS                  TEXT                      ACCENTS
┌─────────────────────┐     ┌──────────────────┐    ┌──────────────┐
│ Primary             │     │ Primary          │    │ Accent Blue  │
│ #1e1e1e             │     │ #d4d4d4          │    │ #007acc      │
│ (main app bg)       │     │ (headers, body)  │    │ (buttons)    │
└─────────────────────┘     └──────────────────┘    └──────────────┘

┌─────────────────────┐     ┌──────────────────┐    ┌──────────────┐
│ Secondary           │     │ Secondary        │    │ Success      │
│ #252526             │     │ #858585          │    │ #51cf66      │
│ (panels, cards)     │     │ (labels, hints)  │    │ (execute)    │
└─────────────────────┘     └──────────────────┘    └──────────────┘

┌─────────────────────┐     ┌──────────────────┐    ┌──────────────┐
│ Tertiary            │     │ Tertiary         │    │ Error        │
│ #2d2d30             │     │ #6a6a6a          │    │ #f48771      │
│ (headers, inputs)   │     │ (disabled text)  │    │ (errors)     │
└─────────────────────┘     └──────────────────┘    └──────────────┘
```

---

**Visual Design Complete** ✅
All layouts are CSS-based and responsive.
