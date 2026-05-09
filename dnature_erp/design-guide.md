# DNAture ERP — UI/UX Design Guide

> **Audience:** Frontend developers building new components and pages in this React + Material UI codebase.  
> **Purpose:** Define a consistent, accessible, scalable visual design system for all current and future UI work.  
> **Stack:** React 19, Material UI v9, TypeScript, Vite, React Router v7.

---

## Table of Contents

1. [Design Principles](#1-design-principles)
2. [Theme System](#2-theme-system)
3. [Typography](#3-typography)
4. [Layout and Spacing](#4-layout-and-spacing)
5. [Semantic HTML and Accessibility](#5-semantic-html-and-accessibility)
6. [Component Design Guidelines](#6-component-design-guidelines)
7. [Forms](#7-forms)
8. [Buttons and Actions](#8-buttons-and-actions)
9. [Responsive Design](#9-responsive-design)
10. [Interaction States](#10-interaction-states)
11. [Iconography](#11-iconography)
12. [Motion and Animation](#12-motion-and-animation)
13. [Content and Microcopy](#13-content-and-microcopy)
14. [Example Implementation](#14-example-implementation)
15. [Do and Don't Checklist](#15-do-and-dont-checklist)

---

## 1. Design Principles

These principles govern every visual and interaction decision in the application.

### Clarity Over Decoration

Every visual element must serve a purpose. Decorative elements that add complexity without improving comprehension should be removed. If something can be simplified, simplify it.

### Consistency Across Screens

Users build mental models from patterns. Use the same component for the same purpose across all screens. Never solve the same problem in two different ways.

### Accessibility by Default

Accessibility is not an add-on. Semantic HTML, keyboard navigation, sufficient color contrast, and screen reader support are required in every component from the start — not retrofitted later.

### Mobile-First Responsiveness

Design and build for small screens first. Add complexity for larger viewports using MUI breakpoints. Never assume desktop.

### Predictable Interaction Patterns

Users should always know what an element does before interacting with it. Buttons look like buttons. Links look like links. Hover states confirm affordances.

### Clear Visual Hierarchy

Guide the user's attention with size, weight, color, and spacing. The most important content on a page should be visually dominant. Secondary content should recede.

### Minimal Cognitive Load

Reduce the number of decisions a user must make at any one time. Progressive disclosure, sensible defaults, and well-labeled actions all reduce friction.

### Trust and Professionalism

This is a production business tool. The visual tone should be calm, neutral, and professional. Avoid playful or experimental design choices that could undermine user confidence.

---

## 2. Theme System

### Strategy

Use Material UI's `createTheme` to define a single source of truth for all visual tokens. The theme must support both **light mode** and **dark mode** via `palette.mode`. No hardcoded color values in components.

### Color Palette

The brand color is a deep forest green, communicating trust, sustainability, and precision.

| Token | Light Mode | Dark Mode | Usage |
|---|---|---|---|
| `primary.main` | `#17352c` | `#4caf80` | Primary actions, active states, brand identity |
| `primary.light` | `#2e5c4a` | `#80cba8` | Hover on primary, secondary accents |
| `primary.dark` | `#0c1f19` | `#2e8b5f` | Pressed state |
| `primary.contrastText` | `#ffffff` | `#000000` | Text on primary color |
| `secondary.main` | `#5c8a7a` | `#a8d5bf` | Secondary actions, chips, less critical highlights |
| `background.default` | `#f5f7f6` | `#0f1a16` | Page background |
| `background.paper` | `#ffffff` | `#1a2e26` | Cards, dialogs, drawers, paper surfaces |
| `text.primary` | `#111827` | `#e8f5f0` | Main body text, headings |
| `text.secondary` | `#4b5563` | `#9ab8ac` | Helper text, captions, labels, metadata |
| `text.disabled` | `#9ca3af` | `#4a6b5e` | Disabled fields and labels |
| `divider` | `#e5e7eb` | `#2a4a3e` | Separators, borders, outlined card borders |
| `success.main` | `#2e7d32` | `#66bb6a` | Validation passed, positive status badges |
| `warning.main` | `#ed6c02` | `#ffa726` | Warnings, partial validation, caution states |
| `error.main` | `#d32f2f` | `#f44336` | Field errors, destructive confirmations |
| `info.main` | `#0288d1` | `#29b6f6` | Informational banners, neutral notifications |

### When to Use Each Color

- **Primary:** Reserved for the single most important action on a page (e.g., "Save", "Continue"). Use sparingly.
- **Secondary:** Supporting actions, status chips, selected item highlights.
- **Background.default:** The outermost page canvas — never use `paper` as a page background.
- **Background.paper:** All raised surfaces: cards, modals, sidebars, data tables.
- **Text.secondary:** Helper text, labels below inputs, timestamps, metadata.
- **Error:** Only for actual errors. Do not use red for warnings.
- **Warning:** Caution states that don't block the user but need attention.
- **Success:** Completion states, validated fields, confirmed operations.
- **Info:** Neutral contextual information that requires no action.

### Theme Configuration

```ts
// src/theme/theme.ts
import { createTheme, PaletteMode } from '@mui/material'

export function buildTheme(mode: PaletteMode) {
  return createTheme({
    palette: {
      mode,
      primary: {
        main: mode === 'light' ? '#17352c' : '#4caf80',
        light: mode === 'light' ? '#2e5c4a' : '#80cba8',
        dark: mode === 'light' ? '#0c1f19' : '#2e8b5f',
        contrastText: mode === 'light' ? '#ffffff' : '#000000',
      },
      secondary: {
        main: mode === 'light' ? '#5c8a7a' : '#a8d5bf',
      },
      background: {
        default: mode === 'light' ? '#f5f7f6' : '#0f1a16',
        paper: mode === 'light' ? '#ffffff' : '#1a2e26',
      },
      text: {
        primary: mode === 'light' ? '#111827' : '#e8f5f0',
        secondary: mode === 'light' ? '#4b5563' : '#9ab8ac',
        disabled: mode === 'light' ? '#9ca3af' : '#4a6b5e',
      },
      divider: mode === 'light' ? '#e5e7eb' : '#2a4a3e',
      success: { main: mode === 'light' ? '#2e7d32' : '#66bb6a' },
      warning: { main: mode === 'light' ? '#ed6c02' : '#ffa726' },
      error: { main: mode === 'light' ? '#d32f2f' : '#f44336' },
      info: { main: mode === 'light' ? '#0288d1' : '#29b6f6' },
    },
  })
}
```

### Rules

- Never use hardcoded hex values inside component `sx` props or `styled` calls.
- Always reference colors via `theme.palette.*` or MUI's semantic token names.
- Use `alpha()` from `@mui/material/styles` for transparency variants, not hardcoded `rgba()`.

```ts
// Good
sx={{ backgroundColor: 'background.paper', color: 'text.primary' }}

// Bad
sx={{ backgroundColor: '#ffffff', color: '#111827' }}
```

---

## 3. Typography

### Font Stack

| Role | Font | Fallback | Usage |
|---|---|---|---|
| Headings / UI Emphasis | **Inter** | system-ui, sans-serif | Titles, labels, buttons, navigation |
| Body / Reading | **Source Sans 3** | Georgia, serif | Body copy, form text, descriptions |

Load from Google Fonts in `index.html`:

```html
<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Source+Sans+3:wght@400;600&display=swap"
  rel="stylesheet"
/>
```

### Variant Reference

| Variant | Font | Weight | Size | Line Height | Usage |
|---|---|---|---|---|---|
| `h1` | Inter | 800 | 2.5rem | 1.2 | Page-level hero titles (rare in dashboards) |
| `h2` | Inter | 700 | 2rem | 1.25 | Major section headings |
| `h3` | Inter | 700 | 1.5rem | 1.3 | Card/panel headings, wizard step titles |
| `h4` | Inter | 800 | 1.25rem | 1.35 | Sub-section titles, modal headings |
| `h5` | Inter | 700 | 1.125rem | 1.4 | Item group titles, form section headings |
| `h6` | Inter | 600 | 1rem | 1.4 | Minor labels with heading semantics |
| `subtitle1` | Inter | 600 | 1rem | 1.5 | Supporting context beneath headings |
| `subtitle2` | Inter | 600 | 0.875rem | 1.5 | Secondary labels, column headers |
| `body1` | Source Sans 3 | 400 | 1rem | 1.6 | Primary body text, descriptions, form content |
| `body2` | Source Sans 3 | 400 | 0.875rem | 1.5 | Secondary body, helper text, compact lists |
| `caption` | Source Sans 3 | 400 | 0.75rem | 1.4 | Timestamps, metadata, fine print |
| `button` | Inter | 600 | 0.875rem | 1 | All button text (uppercase optional, keep readable) |
| `overline` | Inter | 600 | 0.75rem | 2.66 | Section labels above headings (e.g., "Factura digital") |

### Typography Theme Configuration

```ts
typography: {
  fontFamily: '"Inter", system-ui, sans-serif',
  h1: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 800, fontSize: '2.5rem' },
  h2: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 700, fontSize: '2rem' },
  h3: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 700, fontSize: '1.5rem' },
  h4: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 800, fontSize: '1.25rem' },
  h5: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 700, fontSize: '1.125rem' },
  h6: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 600, fontSize: '1rem' },
  subtitle1: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 600 },
  subtitle2: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 600 },
  body1: { fontFamily: '"Source Sans 3", Georgia, serif', fontWeight: 400, fontSize: '1rem' },
  body2: { fontFamily: '"Source Sans 3", Georgia, serif', fontWeight: 400, fontSize: '0.875rem' },
  caption: { fontFamily: '"Source Sans 3", Georgia, serif', fontWeight: 400, fontSize: '0.75rem' },
  button: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 600, textTransform: 'none' },
  overline: { fontFamily: '"Inter", system-ui, sans-serif', fontWeight: 600, letterSpacing: '0.1em' },
},
```

> Set `textTransform: 'none'` on `button` to prevent MUI's default ALL-CAPS styling, which reduces readability.

### Rules

- Never mix heading variants on the same content level. Each heading level appears once per semantic section.
- Do not use `h1`–`h3` for emphasis inside body text. Use `fontWeight` on `body1` instead.
- Use `overline` as the eyebrow label above `h4`/`h5` section titles — it provides context without competing with the heading.

---

## 4. Layout and Spacing

### Spacing System

MUI's default spacing unit is `8px`. Use multiples of this unit for all spacing decisions.

| Value | px | Usage |
|---|---|---|
| `0.5` | 4px | Icon-to-label gaps, tight inline spacing |
| `1` | 8px | Component internal padding (dense), inline gaps |
| `2` | 16px | Card padding (mobile), stack item gaps |
| `3` | 24px | Card padding (desktop), section gaps (small) |
| `4` | 32px | Section spacing, dialog padding |
| `5` | 40px | Page vertical padding (mobile) |
| `6` | 48px | Page vertical padding (desktop) |
| `8` | 64px | Major section separation |

Never use arbitrary `px` values in `sx` unless there is a documented reason (e.g., precise icon alignment). Always use theme spacing multiples.

```ts
// Good
sx={{ p: 3, mt: 2, gap: 1 }}

// Bad
sx={{ padding: '22px', marginTop: '18px' }}
```

### Page Containers

- Wrap all page content in `<Container maxWidth="lg">` (1200px max) for standard pages.
- Use `maxWidth="md"` (900px) for focused flows: wizards, forms, settings.
- Use `maxWidth="xl"` only for full-width data tables or dashboards that genuinely need the space.
- Add `py={{ xs: 3, md: 5 }}` to the top-level container for vertical breathing room.

```tsx
<Container maxWidth="lg">
  <Box sx={{ py: { xs: 3, md: 5 } }}>
    {/* page content */}
  </Box>
</Container>
```

### Section Spacing

```tsx
<Stack spacing={4}>
  <section aria-labelledby="section-heading">
    <Typography id="section-heading" variant="h3">Section Title</Typography>
    {/* section content */}
  </section>
  <section aria-labelledby="another-heading">
    ...
  </section>
</Stack>
```

### Card Padding

```tsx
// Standard card
<Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }} variant="outlined">

// Data-dense card (tables, lists)
<Paper sx={{ p: { xs: 1, md: 2 }, borderRadius: 2 }} variant="outlined">

// Dialog / focused action card
<Paper sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
```

### Grid Layouts

Use MUI `Grid2` (v2 API) for responsive grid layouts:

```tsx
import Grid from '@mui/material/Grid2'

<Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 6 }}>
    <MetricCard />
  </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
    <MetricCard />
  </Grid>
</Grid>
```

- Default column gap: `spacing={3}` (24px)
- Row gap: same as column gap unless layout requires otherwise
- Always start with `xs: 12` (full width on mobile) and add breakpoint overrides

### Breakpoints

| Breakpoint | Value | Design target |
|---|---|---|
| `xs` | 0px+ | Phones (default/mobile-first) |
| `sm` | 600px+ | Large phones, small tablets |
| `md` | 900px+ | Tablets, laptop |
| `lg` | 1200px+ | Desktop |
| `xl` | 1536px+ | Wide desktop |

### Dashboard Layouts

For dashboard-style pages with a sidebar:

```tsx
<Box sx={{ display: 'flex', minHeight: '100vh' }}>
  <Box component="nav" sx={{ width: { md: 260 }, flexShrink: 0 }}>
    {/* sidebar navigation */}
  </Box>
  <Box component="main" sx={{ flex: 1, overflow: 'auto', p: { xs: 2, md: 4 } }}>
    {/* main content */}
  </Box>
</Box>
```

---

## 5. Semantic HTML and Accessibility

### Core Rules

- Every page must have exactly **one** `<main>` landmark.
- Heading hierarchy must be strictly sequential: `h1 → h2 → h3`. Never skip levels.
- Use `<section>` for thematically distinct page regions. Always label with `aria-labelledby` pointing to the section's heading.
- Use `<article>` for self-contained content that makes sense independently (e.g., an invoice card).
- Use `<nav>` for navigation regions. Label multiple `<nav>` elements with `aria-label`.
- Use `<aside>` for supplementary content that isn't part of the main flow.
- Use `<header>` and `<footer>` for their semantic landmark roles.

### Avoid Div Overuse

```tsx
// Bad — meaningless nesting
<div className="wrapper">
  <div className="inner">
    <div onClick={handleClick}>Click me</div>
  </div>
</div>

// Good
<section aria-labelledby="section-id">
  <Typography id="section-id" variant="h3">Section Title</Typography>
  <Button onClick={handleClick}>Click me</Button>
</section>
```

### Buttons vs Links

| Element | When to use |
|---|---|
| `<Button>` / `<button>` | Performs an action: submit, open modal, toggle, delete |
| `<Link>` / `<a>` | Navigates to a new URL or route |

Never attach `onClick` to a `<div>`, `<span>`, or `<Typography>` for interactive behavior.

### Forms

```tsx
// Good — label is associated with the input
<FormControl>
  <InputLabel htmlFor="invoice-number">Número de factura</InputLabel>
  <OutlinedInput id="invoice-number" name="invoiceNumber" />
</FormControl>

// Bad — label is not associated
<Typography>Número de factura</Typography>
<OutlinedInput />
```

### Keyboard Navigation

- All interactive elements must be reachable and operable via keyboard.
- Tab order must follow the visual flow of the page (top-to-bottom, left-to-right).
- Modal dialogs must trap focus when open and return focus to the trigger element when closed. MUI `Dialog` handles this automatically.
- Custom interactive components that are not native elements must use appropriate ARIA roles and keyboard event handlers.

### Focus States

Never do this:

```css
/* Never remove focus outlines globally */
*:focus { outline: none; }
```

If the default focus ring conflicts with the design, replace it — do not remove it:

```ts
// In the theme
components: {
  MuiButtonBase: {
    styleOverrides: {
      root: {
        '&:focus-visible': {
          outline: `3px solid ${theme.palette.primary.main}`,
          outlineOffset: '2px',
        },
      },
    },
  },
},
```

### ARIA Rules

Use ARIA only when no semantic HTML element covers the need.

```tsx
// Good — semantic HTML
<button type="submit">Save invoice</button>

// Acceptable — custom component needs role
<Box role="alert" aria-live="polite">
  {errorMessage}
</Box>

// Bad — adding ARIA to already-semantic elements
<button role="button">Save invoice</button>
```

### Color Contrast

- Body text on background: minimum **4.5:1** contrast ratio (WCAG AA).
- Large text (18px+ or 14px bold): minimum **3:1**.
- UI components and focus indicators: minimum **3:1**.
- The defined palette meets these requirements. Do not introduce custom color combinations without checking contrast.

### Screen Reader Support

- All images must have meaningful `alt` text, or `alt=""` if purely decorative.
- Icon-only buttons must have `aria-label` or a visually hidden `<span>` with descriptive text.
- Dynamic content that updates without a page reload should use `aria-live` regions.

---

## 6. Component Design Guidelines

### Buttons

**When to use:** Any user-triggered action that doesn't navigate to a new URL.

- Use `variant="contained"` for the primary action on a screen.
- Use `variant="outlined"` for secondary actions alongside a primary.
- Use `variant="text"` for tertiary actions (e.g., "Back", "Cancel").
- Never place two `contained` buttons side-by-side. Exactly one dominant action per context.

**Accessibility:** Buttons must have descriptive text. "Submit" is acceptable only when the form context makes the action unambiguous. Prefer "Save invoice" or "Continue to review".

**Common mistakes:**
- Using `disabled` without communicating why it's disabled.
- Using `onClick` on `<Typography>` or `<Box>` instead of `<Button>`.

---

### Text Fields

**When to use:** Single-line text input. Use `multiline` prop for multi-line input.

- Use `variant="outlined"` for all form fields (consistent and accessible).
- Always provide a `label` that describes the expected input.
- Use `helperText` for format hints, not for error messages (use `error` + `helperText` for errors).
- Keep placeholder text minimal — the label should carry the meaning.

**Accessibility:** The `label` must always be present and correctly associated. Never rely solely on `placeholder` as a label.

**Common mistakes:**
- Using `placeholder` instead of `label`.
- Removing the label to save visual space and replacing with placeholder text only.

---

### Selects

**When to use:** Choosing one option from a known, finite list of 3–12 options.

- For fewer than 3 options, use Radio buttons.
- For more than 12 options, consider a searchable Autocomplete.
- Always use `<InputLabel>` with a matching `labelId` on the `<Select>`.

```tsx
<FormControl fullWidth>
  <InputLabel id="status-label">Estado</InputLabel>
  <Select labelId="status-label" label="Estado" value={status} onChange={handleChange}>
    <MenuItem value="pending">Pendiente</MenuItem>
    <MenuItem value="approved">Aprobado</MenuItem>
  </Select>
</FormControl>
```

---

### Cards

**When to use:** Grouping related content or actions into a single unit.

- Use `Paper variant="outlined"` for cards that sit on `background.default`.
- Use `Paper elevation={1}` or `elevation={2}` only in dark mode or when layered surfaces need visual separation.
- Standard card padding: `p={{ xs: 2, md: 3 }}`.
- Use `borderRadius: 2` (16px) for a modern, clean look.
- Cards must have a clear visual heading or label.

**Common mistakes:**
- Nesting `elevation` cards inside other `elevation` cards — use `outlined` for the inner card.
- Using cards for layout when a `Box` or `Stack` would be sufficient.

---

### Modals / Dialogs

**When to use:** Blocking actions requiring immediate attention — confirmations, quick forms, alerts.

- Use MUI `Dialog` for all modal overlays.
- Include a `DialogTitle` with a descriptive heading.
- Include a `DialogContent` for the body.
- Include `DialogActions` with clear, labeled action buttons.
- Destructive confirmations must include the specific item being destroyed in the dialog text.
- Do not use dialogs for content that could live on a page.

**Accessibility:** MUI `Dialog` handles focus trapping and `aria-modal`. Do not override `aria-modal` or `role` on the dialog container.

---

### Tables

**When to use:** Displaying structured tabular data with multiple related attributes per row.

- Always use `<table>`, `<thead>`, `<tbody>`, `<th>`, `<td>` semantics (MUI `Table*` components do this).
- `<th>` elements must have `scope="col"` or `scope="row"`.
- On mobile, prefer collapsing table rows to a card-like layout rather than horizontal scrolling.
- Avoid tables for layout.

---

### Lists

**When to use:** Sequential or unordered groupings of similar items.

- Use MUI `List` + `ListItem` for styled item lists.
- For navigation menus, use `<nav>` wrapping a `List`.
- Avoid custom `div`-based list implementations.

---

### Navigation

- Top-level navigation: use `AppBar` + `Toolbar` for the main header.
- Side navigation: use `Drawer` with `variant="permanent"` on desktop and `variant="temporary"` on mobile.
- Active route: highlight with `color="primary"` text and a left border or background tint — not bold alone.
- Navigation items must be `<a>` elements or `Link` from React Router.

---

### Alerts / Snackbars

| Component | When to use |
|---|---|
| `Alert` | Inline, persistent status messages tied to specific page context |
| `Snackbar` | Transient, global feedback for operations (saved, deleted, failed) |

- `Alert severity="error"` for blocking errors.
- `Alert severity="warning"` for non-blocking cautions.
- `Alert severity="success"` for operation completion.
- `Alert severity="info"` for neutral guidance.
- Snackbars should auto-dismiss after 4–6 seconds for success/info. Error snackbars should require manual dismissal.

---

### Empty States

Every list, table, or content area that can be empty must have an explicit empty state.

```tsx
{invoices.length === 0 && (
  <Box sx={{ py: 8, textAlign: 'center' }}>
    <Typography variant="h6" color="text.secondary">
      No hay facturas registradas
    </Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
      Comienza cargando tu primera factura digital.
    </Typography>
    <Button variant="contained" sx={{ mt: 3 }} onClick={handleNew}>
      Cargar factura
    </Button>
  </Box>
)}
```

---

### Loading States

- Use `CircularProgress` for page-level or section-level loading.
- Use `Skeleton` for content that has a known shape (lists, cards, table rows).
- Never show a blank screen while loading. Always show a skeleton or spinner.
- Buttons in a loading state must use `disabled` + a `CircularProgress` inside to prevent double submission.

---

### Error States

- Inline field errors: use `error` prop + `helperText` on `TextField`.
- Section-level errors: use `<Alert severity="error">` above the relevant content.
- Page-level errors (e.g., failed data fetch): replace the content area with an `Alert` + retry action.

---

## 7. Forms

### Required Fields

Mark required fields with an asterisk (*) in the label via the `required` prop on `TextField`. Add a note at the top of the form: "Fields marked with * are required."

```tsx
<TextField label="Número de factura" required fullWidth />
```

### Validation

- Validate on blur (field exit) for long forms. Validate on submit for short forms.
- Never validate only on submit for forms with more than 4 fields — it creates a poor experience.
- Show one error message per field. The most specific error takes priority.

### Error Messages

Error messages must explain what went wrong **and** how to fix it.

```
// Bad
"Invalid value"

// Good
"El número de factura debe tener entre 5 y 20 caracteres."
```

Use `helperText` on `TextField` to display field-level errors. Set `error={true}` to color the field and message red.

```tsx
<TextField
  label="RUC"
  error={!!errors.ruc}
  helperText={errors.ruc ?? 'Ejemplo: 20123456789'}
/>
```

### Helper Text

- Use `helperText` for format hints on complex fields (RUC, dates, phone numbers).
- Do not use `helperText` for generic instructions — place those in a visible label or description above the field.
- Helper text disappears when `error` is set to `true`. This is expected behavior.

### Disabled States

- Disabled fields must have `disabled={true}` — never use `readOnly` as a substitute for `disabled`.
- If a field is disabled due to a user-controllable condition, explain why nearby.

### Loading/Submitting States

```tsx
<Button
  type="submit"
  variant="contained"
  disabled={isSubmitting}
  startIcon={isSubmitting ? <CircularProgress size={16} color="inherit" /> : null}
>
  {isSubmitting ? 'Guardando...' : 'Guardar factura'}
</Button>
```

### Field Grouping

Group related fields under a visible section heading or `FormLabel`. Separate unrelated groups with `Divider` or `mt: 4` spacing.

```tsx
<Stack spacing={3}>
  <Typography variant="h6">Datos del emisor</Typography>
  <TextField label="Razón social" fullWidth />
  <TextField label="RUC" fullWidth />

  <Divider />

  <Typography variant="h6">Datos del receptor</Typography>
  <TextField label="Razón social del cliente" fullWidth />
</Stack>
```

### Mobile-Friendly Layouts

- All fields must be `fullWidth` on mobile.
- Multi-column form layouts (`Grid`) should collapse to single-column at `xs`.

```tsx
<Grid container spacing={2}>
  <Grid size={{ xs: 12, md: 6 }}>
    <TextField label="Nombre" fullWidth />
  </Grid>
  <Grid size={{ xs: 12, md: 6 }}>
    <TextField label="Apellido" fullWidth />
  </Grid>
</Grid>
```

---

## 8. Buttons and Actions

### Action Hierarchy

| Level | Variant | Color | Use case |
|---|---|---|---|
| Primary | `contained` | `primary` | The one main action per screen/section |
| Secondary | `outlined` | `primary` | Supporting action next to primary |
| Tertiary | `text` | `primary` | Low-emphasis action: "Back", "Cancel" |
| Destructive | `outlined` or `contained` | `error` | Delete, remove, irreversible actions |
| Icon button | `IconButton` | `default` | Toolbar actions with icons only |

### Rules

- Each screen or modal should have **exactly one** `contained` primary action.
- Destructive actions (`color="error"`) must always be preceded by a confirmation dialog.
- Disabled buttons must not hide tooltips explaining why they are disabled. Use `title` or a `Tooltip` wrapping the button.

```tsx
// Disabled button with explanation
<Tooltip title="Complete all required fields to continue">
  <span> {/* span is needed for Tooltip to work on disabled buttons */}
    <Button variant="contained" disabled>
      Continue
    </Button>
  </span>
</Tooltip>
```

### Loading Buttons

```tsx
<Button
  variant="contained"
  disabled={loading}
  startIcon={loading && <CircularProgress size={16} color="inherit" />}
>
  {loading ? 'Processing...' : 'Submit'}
</Button>
```

### Icon Buttons

All `IconButton` elements must have an `aria-label`:

```tsx
<IconButton aria-label="Delete invoice" onClick={handleDelete}>
  <DeleteIcon />
</IconButton>
```

---

## 9. Responsive Design

### Mobile-First Rule

Write all styles for mobile first, then override for larger screens. Use MUI's responsive `sx` object syntax:

```tsx
// Good — mobile first
sx={{ p: { xs: 2, md: 4 }, fontSize: { xs: '0.875rem', md: '1rem' } }}

// Avoid — desktop first
sx={{ p: 4, '@media (max-width: 600px)': { p: 2 } }}
```

### Touch Target Sizes

Minimum touch target size is **44×44px** (WCAG 2.5.5 recommendation). MUI buttons meet this by default. Custom interactive elements must be sized accordingly.

```tsx
// Ensure minimum size for icon buttons
<IconButton sx={{ minWidth: 44, minHeight: 44 }} aria-label="Edit">
  <EditIcon />
</IconButton>
```

### Navigation on Small Screens

- Hide the permanent sidebar (`Drawer variant="permanent"`) below `md`.
- Show a hamburger button in the `AppBar` on mobile that opens a temporary `Drawer`.
- Bottom navigation (`BottomNavigation`) is appropriate for apps with fewer than 5 top-level routes.

### Tables on Mobile

- Use `sx={{ overflowX: 'auto' }}` on the `Paper` wrapping a `Table` for minimal horizontal scroll when necessary.
- For important tables, provide a card-based alternative layout on `xs` that swaps the `Table` for a list of `Card` items.

### Cards and Grids

- Cards in a grid: `xs: 12`, `sm: 6`, `lg: 4` is the most common responsive pattern.
- Never use fixed widths on cards inside grids.

### Avoiding Horizontal Scrolling

- Use `Container` with `maxWidth` to constrain content width.
- Use `word-break: 'break-word'` on text that might overflow (long URLs, invoice numbers).
- Test all pages at 320px width (minimum mobile viewport).

---

## 10. Interaction States

### State Reference

| State | Visual treatment | Accessibility |
|---|---|---|
| **Default** | No decoration | Baseline |
| **Hover** | Subtle background tint (`action.hover`) | Sufficient — not required to be keyboard-visible |
| **Focus** | Visible 2–3px outline in `primary.main` | Required — must be clearly visible |
| **Active / Pressed** | Darker background, slight scale-down | Communicated via `aria-pressed` if toggle |
| **Selected** | `primary.main` tint background + primary text | `aria-selected="true"` on list items |
| **Disabled** | `text.disabled` color, no pointer interaction | `disabled` attribute or `aria-disabled="true"` |
| **Loading** | Spinner replaces or accompanies label, element disabled | `aria-busy="true"` |
| **Error** | `error.main` border, helper text in `error.main` | `aria-invalid="true"` on the input |
| **Success** | `success.main` checkmark or confirmation text | `aria-live="polite"` for dynamic updates |
| **Empty** | Illustrated or text empty state, action to populate | No special ARIA needed |

### Focus Visibility

Focus must always be visible. The default MUI focus ring is acceptable. If it is removed for any reason, it must be replaced with an equally visible alternative:

```ts
// Custom focus style in theme
components: {
  MuiButtonBase: {
    styleOverrides: {
      root: {
        '&:focus-visible': {
          outline: '2px solid',
          outlineColor: 'primary.main',
          outlineOffset: '2px',
        },
      },
    },
  },
},
```

---

## 11. Iconography

### Source

Use `@mui/icons-material` exclusively. Do not introduce a second icon library.

### Rules

- Icons support meaning — they do not replace text in interactive elements.
- Icon buttons require `aria-label`. Icon + text buttons do not need additional ARIA.
- Use consistent sizing: `fontSize="small"` for dense UI, `fontSize="medium"` (default) for standard UI, `fontSize="large"` for empty states or illustrations.
- Do not mix filled and outlined icon styles in the same view.
- Limit icons to one per button or label unless the second icon has a distinct role (e.g., a sort direction arrow).

```tsx
// Good — icon supports the text
<Button startIcon={<UploadFileIcon />} variant="contained">
  Cargar factura
</Button>

// Good — icon button with accessible label
<IconButton aria-label="Upload file">
  <UploadFileIcon />
</IconButton>

// Bad — icon alone with no accessible label
<IconButton>
  <UploadFileIcon />
</IconButton>
```

### Decorative Icons

Icons used purely for decoration (no meaning) must have `aria-hidden="true"`:

```tsx
<CheckCircleIcon aria-hidden="true" color="success" />
<Typography>Validación completada</Typography>
```

---

## 12. Motion and Animation

### Principles

Animations must serve the user, not entertain them. Transitions help users understand what changed, where content came from, and what is happening. All other movement should be removed.

### Approved Animation Patterns

| Pattern | Implementation | Duration |
|---|---|---|
| Page transitions | Fade in via MUI `Fade` | 200ms |
| Modal open/close | MUI `Dialog` default slide | 200ms |
| Accordion expand | MUI `Collapse` default | 200ms |
| Loading indicators | `CircularProgress` | Continuous |
| Skeleton loading | MUI `Skeleton` | Pulse (default) |
| Alert/snackbar appear | MUI `Slide` | 200ms |

### Duration Guidelines

- Micro-interactions (hover, press): 100–150ms
- Component transitions (open, close, expand): 200ms
- Page-level transitions: 200–300ms
- Never exceed 400ms for any UI animation

### `prefers-reduced-motion`

Respect the user's system preference to reduce motion:

```ts
// In theme
components: {
  MuiCollapse: {
    defaultProps: {
      timeout: 'auto',
    },
  },
},
```

```css
/* In global CSS */
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### What to Avoid

- Parallax scrolling effects.
- Auto-playing content (carousels, videos) without user control.
- Bouncing, rotating, or pulsing elements as decorative features.
- Animating layout properties (`width`, `height`, `top`, `left`) — prefer `transform` and `opacity`.

---

## 13. Content and Microcopy

### Button Labels

Button text should describe what happens when clicked, not just the action type.

```
// Bad         → Good
"Submit"       → "Save invoice"
"OK"           → "Confirm deletion"
"Cancel"       → "Go back"
"Upload"       → "Upload PDF"
"Send"         → "Send to accounting"
```

### Error Messages

Error messages must:
1. State what went wrong.
2. Explain what the user should do.
3. Be written in the user's language (Spanish for this project).

```
// Bad
"Error: invalid input"

// Good
"El RUC debe contener exactamente 11 dígitos numéricos."
```

### Empty State Messages

Empty states should:
1. Explain that there is nothing here (and that it is expected).
2. Offer a path forward (an action button or instruction).

```
"No hay facturas registradas aún.
Comienza cargando tu primera factura digital."
[Cargar factura]
```

### Confirmation Dialogs

Confirmation dialogs for destructive actions must:
1. State what will be deleted/removed.
2. Warn that the action cannot be undone.
3. Name the confirm button after the destructive action.

```
// Bad
Title: "Are you sure?"
Button: "Yes"

// Good
Title: "¿Eliminar factura F001-00123?"
Body: "Esta acción no se puede deshacer. La factura será eliminada permanentemente."
Button: "Eliminar factura"
Cancel: "Cancelar"
```

### Loading Messages

```
"Procesando factura..." — not "Loading..."
"Guardando cambios..." — not "Please wait..."
"Validando datos con SUNAT..." — specific to the operation
```

### Tone

- Professional and direct.
- Spanish for all user-facing text in this project.
- Avoid jargon unless the user base is technical (in which case, define terms on first use).

---

## 14. Example Implementation

### Theme Setup (Light + Dark)

```tsx
// src/theme/ThemeProvider.tsx
import { createContext, useContext, useMemo, useState } from 'react'
import { ThemeProvider as MuiThemeProvider, CssBaseline, PaletteMode } from '@mui/material'
import { buildTheme } from './theme'

const ColorModeContext = createContext({ toggleColorMode: () => {} })

export function useColorMode() {
  return useContext(ColorModeContext)
}

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<PaletteMode>('light')

  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
    }),
    [],
  )

  const theme = useMemo(() => buildTheme(mode), [mode])

  return (
    <ColorModeContext.Provider value={colorMode}>
      <MuiThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </MuiThemeProvider>
    </ColorModeContext.Provider>
  )
}
```

```tsx
// src/theme/theme.ts
import { createTheme, PaletteMode, alpha } from '@mui/material'

export function buildTheme(mode: PaletteMode) {
  const isDark = mode === 'dark'

  return createTheme({
    palette: {
      mode,
      primary: {
        main: isDark ? '#4caf80' : '#17352c',
        light: isDark ? '#80cba8' : '#2e5c4a',
        dark: isDark ? '#2e8b5f' : '#0c1f19',
        contrastText: isDark ? '#000000' : '#ffffff',
      },
      secondary: {
        main: isDark ? '#a8d5bf' : '#5c8a7a',
      },
      background: {
        default: isDark ? '#0f1a16' : '#f5f7f6',
        paper: isDark ? '#1a2e26' : '#ffffff',
      },
      text: {
        primary: isDark ? '#e8f5f0' : '#111827',
        secondary: isDark ? '#9ab8ac' : '#4b5563',
        disabled: isDark ? '#4a6b5e' : '#9ca3af',
      },
      divider: isDark ? '#2a4a3e' : '#e5e7eb',
      success: { main: isDark ? '#66bb6a' : '#2e7d32' },
      warning: { main: isDark ? '#ffa726' : '#ed6c02' },
      error: { main: isDark ? '#f44336' : '#d32f2f' },
      info: { main: isDark ? '#29b6f6' : '#0288d1' },
    },
    typography: {
      fontFamily: '"Inter", system-ui, sans-serif',
      h4: { fontWeight: 800 },
      h5: { fontWeight: 700 },
      button: { fontWeight: 600, textTransform: 'none' },
      overline: { fontWeight: 600, letterSpacing: '0.1em' },
    },
    shape: { borderRadius: 8 },
    components: {
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 8, padding: '8px 20px' },
        },
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: isDark ? '#4caf80' : '#17352c',
            },
          },
        },
      },
      MuiButtonBase: {
        styleOverrides: {
          root: {
            '&:focus-visible': {
              outline: `2px solid ${isDark ? '#4caf80' : '#17352c'}`,
              outlineOffset: '2px',
            },
          },
        },
      },
    },
  })
}
```

---

### Example Responsive Layout

```tsx
// src/pages/DashboardPage.tsx
import { Box, Container, Grid, Paper, Stack, Typography } from '@mui/material'

export default function DashboardPage() {
  return (
    <Box component="main">
      <Container maxWidth="lg">
        <Box sx={{ py: { xs: 3, md: 5 } }}>
          <Stack spacing={4}>
            <header>
              <Typography color="primary" variant="overline">
                Panel de control
              </Typography>
              <Typography variant="h4">
                Resumen de facturas
              </Typography>
            </header>

            <section aria-labelledby="metrics-heading">
              <Typography id="metrics-heading" variant="h5" sx={{ mb: 2 }}>
                Métricas del mes
              </Typography>
              <Grid container spacing={3}>
                {['Emitidas', 'Pendientes', 'Rechazadas'].map((label) => (
                  <Grid key={label} size={{ xs: 12, sm: 6, lg: 4 }}>
                    <Paper variant="outlined" sx={{ p: 3, borderRadius: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        {label}
                      </Typography>
                      <Typography variant="h3" sx={{ mt: 1 }}>
                        —
                      </Typography>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </section>
          </Stack>
        </Box>
      </Container>
    </Box>
  )
}
```

---

### Example Accessible Form

```tsx
// src/features/factura-digital/components/InvoiceFormExample.tsx
import {
  Alert, Box, Button, CircularProgress, Divider,
  FormControl, InputLabel, MenuItem, Paper,
  Select, Stack, TextField, Typography,
} from '@mui/material'
import { useState } from 'react'

export default function InvoiceFormExample() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitting(true)
    // ... submit logic
    setSubmitting(false)
  }

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, borderRadius: 2 }}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        <Stack spacing={3}>
          <Typography variant="h5" component="h2">
            Datos de la factura
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Los campos marcados con * son obligatorios.
          </Typography>

          {error && (
            <Alert severity="error" role="alert">
              {error}
            </Alert>
          )}

          <section aria-labelledby="issuer-heading">
            <Typography id="issuer-heading" variant="h6" sx={{ mb: 2 }}>
              Emisor
            </Typography>
            <Stack spacing={2}>
              <TextField label="Razón social" name="issuerName" required fullWidth />
              <TextField
                label="RUC"
                name="issuerRuc"
                required
                fullWidth
                inputProps={{ maxLength: 11, inputMode: 'numeric' }}
                helperText="11 dígitos numéricos"
              />
            </Stack>
          </section>

          <Divider />

          <section aria-labelledby="invoice-heading">
            <Typography id="invoice-heading" variant="h6" sx={{ mb: 2 }}>
              Datos del comprobante
            </Typography>
            <Stack spacing={2}>
              <FormControl fullWidth required>
                <InputLabel id="type-label">Tipo de comprobante</InputLabel>
                <Select labelId="type-label" label="Tipo de comprobante" name="invoiceType">
                  <MenuItem value="01">Factura</MenuItem>
                  <MenuItem value="03">Boleta</MenuItem>
                  <MenuItem value="07">Nota de crédito</MenuItem>
                </Select>
              </FormControl>
              <TextField label="Número" name="invoiceNumber" required fullWidth />
            </Stack>
          </section>

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', pt: 1 }}>
            <Button
              type="submit"
              variant="contained"
              disabled={submitting}
              startIcon={submitting ? <CircularProgress size={16} color="inherit" /> : null}
            >
              {submitting ? 'Guardando...' : 'Guardar factura'}
            </Button>
          </Box>
        </Stack>
      </Box>
    </Paper>
  )
}
```

---

### Example Semantic Page Structure

```tsx
// src/pages/FacturacionPage.tsx
import { AppBar, Box, Container, Toolbar, Typography } from '@mui/material'

export default function FacturacionPage() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="sticky" component="header" elevation={0}>
        <Toolbar>
          <Typography variant="h6" component="span">
            DNAture ERP
          </Typography>
          <Box component="nav" aria-label="Main navigation" sx={{ ml: 'auto' }}>
            {/* navigation links */}
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ flex: 1 }}>
        <Container maxWidth="lg">
          <Box sx={{ py: { xs: 3, md: 5 } }}>
            <Stack spacing={4}>
              <section aria-labelledby="page-heading">
                <Typography id="page-heading" variant="h4" component="h1">
                  Facturación digital
                </Typography>
              </section>

              {/* page content sections */}
            </Stack>
          </Box>
        </Container>
      </Box>

      <Box component="footer" sx={{ py: 3, bgcolor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography variant="caption" color="text.secondary">
            © 2026 DNAture. Todos los derechos reservados.
          </Typography>
        </Container>
      </Box>
    </Box>
  )
}
```

---

## 15. Do and Don't Checklist

Use this checklist before shipping any new component or page.

### Colors and Theming

- **Do** use `theme.palette.*` tokens for all colors (`color="primary"`, `sx={{ color: 'text.secondary' }}`).
- **Do** test both light and dark modes before shipping.
- **Don't** hardcode hex values (`#17352c`) in component files.
- **Don't** use `alpha()` on hardcoded strings — only on theme palette references.

### Typography

- **Do** use the correct semantic MUI variant for the content role (`h4` for modal titles, `body1` for descriptions).
- **Do** maintain heading hierarchy — `h1` → `h2` → `h3` — never skip levels.
- **Don't** use heading variants purely for visual size. Use `sx={{ fontSize }}` on a `body1` instead.
- **Don't** use `textTransform: 'uppercase'` unless using `overline` variant.

### Spacing and Layout

- **Do** use MUI spacing multiples (`p: 3`, `gap: 2`, `mt: 1`).
- **Do** wrap page content in `<Container maxWidth="lg">`.
- **Don't** create arbitrary pixel values in `sx` props unless documented.
- **Don't** use nested `elevation` Papers — use `outlined` for inner surfaces.

### Accessibility

- **Do** write one `<main>` per page.
- **Do** associate all form labels with their inputs.
- **Do** provide `aria-label` for all icon-only buttons.
- **Do** ensure visible focus styles exist for all interactive elements.
- **Don't** use `div` or `span` as buttons (`onClick` on non-interactive elements).
- **Don't** rely on color alone to communicate state (pair with text, icon, or pattern).
- **Don't** remove `outline: none` globally without a replacement focus style.

### Buttons and Forms

- **Do** have exactly one `contained` primary action per screen or modal.
- **Do** show loading state with `disabled` + spinner during async submission.
- **Do** wrap destructive `disabled` buttons in a `<Tooltip>` explaining why.
- **Don't** label buttons "Submit" when a specific label is possible.
- **Don't** allow double-submission — disable the button on first click.

### Components

- **Do** provide empty states for all lists, tables, and data views.
- **Do** use `Skeleton` for loading states in content areas with known shape.
- **Do** include `DialogTitle`, `DialogContent`, and `DialogActions` in every `Dialog`.
- **Don't** use `Dialog` for content that belongs on a dedicated page.
- **Don't** use `Table` for layout purposes.

### Responsive Design

- **Do** design and code mobile-first (`xs` styles first, override for `md`+).
- **Do** test at 320px width.
- **Do** ensure touch targets are at least 44×44px.
- **Don't** use fixed pixel widths on grid items or cards.
- **Don't** cause horizontal scrolling at any viewport below 1024px.

### Motion

- **Do** use MUI's default transition components (`Fade`, `Collapse`, `Slide`).
- **Do** add `prefers-reduced-motion` global CSS override.
- **Don't** animate `width`, `height`, `top`, or `left` — use `transform` and `opacity`.
- **Don't** add decorative animations that serve no functional purpose.

### Content

- **Do** write button labels as actions: "Save invoice", not "Submit".
- **Do** write error messages that explain the fix, not just the problem.
- **Do** provide an empty state message and a forward action for every empty view.
- **Don't** use vague copy like "Something went wrong" without guidance on next steps.
- **Don't** mix English and Spanish in the same UI surface.

---

*Last updated: May 2026 — DNAture ERP frontend team.*
