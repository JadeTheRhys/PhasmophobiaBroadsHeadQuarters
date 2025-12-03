# Phasmophobia Broads HQ - Design Guidelines

## Design Approach
**System**: Custom cyberpunk paranormal theme (inspired by sci-fi command centers, paranormal investigation equipment, and retro-futuristic HUDs)
- This is a utility-focused real-time dashboard, not a marketing site
- Prioritize information density and functional clarity over decorative elements
- Embrace the paranormal investigation aesthetic with neon accents and dark atmospheric backgrounds

## Core Design Principles
1. **High-tech surveillance aesthetic** - Command center monitoring interface
2. **Information clarity** - Multiple data streams must be readable simultaneously
3. **Real-time feedback** - Visual indicators for ghost activity and squad status
4. **Atmospheric immersion** - Dark theme with glowing accents creates tension

## Typography

**Font Families:**
- Headers/Titles: **Orbitron** (600, 800 weights) - Futuristic, technical feel
- Data/Logs/Code: **JetBrains Mono** (400, 700 weights) - Monospace for technical readability
- Body text where needed: JetBrains Mono as default

**Hierarchy:**
- Main title: text-6xl, font-extrabold, uppercase, tracking-widest (Orbitron)
- Section titles (h2): text-xl, font-semibold (Orbitron) 
- Subtitles: text-lg (Orbitron)
- Body/logs: text-sm to text-base (JetBrains Mono)
- Metadata/timestamps: text-xs (JetBrains Mono)

## Layout System

**Spacing Units:** Use Tailwind spacing: 2, 4, 6, 8, 10, 12, 16, 24 for consistency
- Card padding: p-6 (24px)
- Section gaps: space-y-6 or gap-6
- Inner component spacing: space-y-3, space-x-3
- Log entries: space-y-1 for density

**Grid Structure:**
- Max container width: max-w-7xl
- Two-column layout on desktop: grid-cols-1 lg:grid-cols-2
- Single column on mobile (all sections stack)
- Consistent gap-6 between major sections

**Vertical Flow:**
- Full-width header (centered content)
- Two equal-height columns for main panels
- Left: Ghost Activity Monitor + Activity Log (flex-col)
- Right: Tabbed Data Terminal + Squad Status (flex-col)

## Component Library

### Cards (`.phasmo-card`)
- Background: rgba(255, 255, 255, 0.05) - semi-transparent white
- Border: 1px solid neon purple (#b71cff)
- Border radius: 16px
- Padding: 24px
- Box shadow: Dual layer (outer neon glow + subtle inner highlight)
- All content containers use this card treatment

### Buttons (`.phasmo-btn`)
- Base: Dark background with neon purple border
- Border radius: 8px
- Padding: py-3 px-4 or py-2 px-4 for smaller variants
- Font: Orbitron, uppercase text-sm for primary actions
- Hover state: Border shifts to cyan, scale(1.02), enhanced glow
- Special variant: Red theme for danger actions (hunt triggers)

### Tabs
- Container: Flex wrap with gap-2, centered
- Inactive tabs: Dark bg, purple border, cyan text
- Active tab: Purple background, white text, cyan border, glowing shadow
- Icon + label pattern for all tabs
- Font: Orbitron, text-sm, font-semibold

### Log Containers
- Background: rgba(0, 0, 0, 0.3) - darker than cards
- Border: 1px solid rgba(183, 28, 255, 0.3) - faint purple
- Border radius: 8px
- Padding: 12-16px
- Used for chat, activity logs, evidence displays

### Status Indicators
- EMF Bar: Container with cyan border, progress bar fills horizontally
- Squad Status Cards: Flex layout, avatar + info + status icon
- Border color indicates alive (green) vs dead (red)
- Icons: Font Awesome (fa-heartbeat, fa-skull, fa-map-marker-alt)

### Input Fields
- Dark background (#1f2937 or deep-black)
- 2px neon purple border
- Focus: cyan border and ring
- Cyan text color for visibility
- Rounded-lg corners
- Full width in containers

### Modals
- Backdrop: rgba(0, 0, 0, 0.90) with backdrop-filter blur(8px)
- Content: 3px cyan border, large glow shadow
- Border radius: 18px
- Image display with title and description text

## Visual Effects

**Glow Effects:**
- Titles: Cyan text-shadow (0 0 8px)
- Subtitles: Purple text-shadow (0 0 5px)
- Cards: Purple outer glow on borders
- Buttons: Enhanced glow on hover

**Event Animations (Minimal):**
- Flicker: 0.25s opacity flash (4 iterations) for paranormal events
- Shake: 0.5s transform shake for hunt/slam events
- Apply to body element, not individual components
- No continuous animations - only triggered by events

**Hover States:**
- Buttons: Scale 1.02, enhanced glow, border color shift
- Gallery images: Border color shift purple → cyan
- Cursor: Use crosshair for buttons (thematic touch)

## Color Application (Reference Only)
The existing color system is well-defined - maintain consistency:
- Primary accent: Neon purple for borders, highlights
- Secondary accent: Soft cyan for text emphasis, glows
- Background: Deep black with subtle texture pattern
- Text: Off-white (#e0e0e0) for readability
- Danger/events: Red tones (#ff5d5d)
- Success/alive: Green tones

## Images

**Case Files Gallery:**
- Grid of 6 case file images (2-3 columns responsive)
- Each: w-full h-32 object-cover
- Border: 2px neon purple, hover shifts to cyan
- Rounded-lg corners
- Click opens modal with full-size image + metadata

**Map Display:**
- Single large image showing current investigation location
- Border: 2px cyan with glow shadow
- Rounded corners (12px)
- Updates dynamically based on squad location data

**Profile Avatars:**
- Small circular avatars (w-7 h-7 to w-10 h-10)
- Border: 1px cyan for identity
- Used in chat, squad status, profile selector

**No Hero Section:** This is a dashboard application - full command center layout on load

## Content Strategy
- **Information density is key** - multiple data streams visible simultaneously
- **Tab organization** - Group related features (Chat, Evidence, Ghost Database, Cases, Squad, Profile)
- **Real-time updates** - Log containers auto-scroll to newest entries
- **Command palette** - Chat input doubles as command interface with help text visible
- **Status awareness** - EMF levels, squad vitals, map location always visible

## Accessibility Notes
- Maintain high contrast (cyan/purple on dark backgrounds)
- Monospace fonts ensure consistent data alignment
- Clear visual hierarchy for scanning information quickly
- Form inputs have visible focus states (cyan ring)
- Modal has proper backdrop and clear close affordance