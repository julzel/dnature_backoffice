---
description: "Use when creating or updating React views, pages, components, or UI layouts. Enforces the DNAture ERP design system: MUI v9 theming, typography, spacing, accessibility, responsive design, semantic HTML, and component conventions. Trigger words: view, page, component, layout, form, UI, screen, dashboard, dialog, modal, table, list, button, card."
applyTo: "src/**/*.tsx"
---

# DNAture ERP — UI Design Rules

Full reference: [`design-guide.md`](../../design-guide.md)

---

## Theme — Never hardcode colors

```tsx
// ✅
sx={{ color: 'text.secondary', bgcolor: 'background.paper' }}

// ❌
sx={{ color: '#4b5563', backgroundColor: '#ffffff' }}
```

- All colors via `theme.palette.*` or MUI semantic props (`color="primary"`, `color="error"`)
- Use `alpha()` from `@mui/material/styles` for transparency, never `rgba()`
- Support both light and dark modes — test both before shipping

---

## Typography

- `overline` → eyebrow label above a section heading
- `h4` / `h5` → section/card/modal headings (`fontWeight: 800` / `700`)
- `body1` → primary content text
- `body2` → helper text, secondary descriptions
- `caption` → timestamps, metadata
- `button` → already set to `fontWeight: 600, textTransform: 'none'`

**Never** use heading variants (`h1`–`h6`) purely for visual size. Use `sx={{ fontSize }}` on `body1` instead.  
**Always** maintain strict heading hierarchy per page section: `h1 → h2 → h3`.

---

## Spacing — Use MUI multiples only

| Token | px | Common use |
|---|---|---|
| `1` | 8px | Inline gaps, dense padding |
| `2` | 16px | Card padding (mobile), stack gaps |
| `3` | 24px | Card padding (desktop), section gaps |
| `4` | 32px | Section spacing, dialog padding |
| `5` / `6` | 40/48px | Page vertical padding |

```tsx
// ✅
sx={{ p: { xs: 2, md: 3 }, mt: 2 }}

// ❌
sx={{ padding: '22px', marginTop: '18px' }}
```

---

## Page containers

```tsx
<Container maxWidth="lg">          // standard pages
  <Box sx={{ py: { xs: 3, md: 5 } }}>
    {/* content */}
  </Box>
</Container>

// Focused flows (wizards, forms): maxWidth="md"
// Full-width dashboards: maxWidth="xl"
```

---

## Cards / Paper

```tsx
// Standard
<Paper variant="outlined" sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>

// Dialog / wizard step
<Paper variant="outlined" sx={{ p: { xs: 3, md: 4 }, borderRadius: 2 }}>
```

- Default to `variant="outlined"` — use `elevation` only when layered surfaces need separation
- Do NOT nest `elevation` Papers; use `outlined` for inner surfaces

---

## Grid layouts — MUI Grid2 API

```tsx
import Grid from '@mui/material/Grid2'

<Grid container spacing={3}>
  <Grid size={{ xs: 12, md: 6 }}>...</Grid>
</Grid>
```

- Always start with `xs: 12` (full width on mobile), add breakpoints for larger
- Never use fixed widths on grid items

---

## Semantic HTML — required structure

```tsx
// Every page
<Box component="main">
  <Container maxWidth="lg">
    <Box sx={{ py: { xs: 3, md: 5 } }}>
      <Stack spacing={4}>
        <section aria-labelledby="page-heading">
          <Typography id="page-heading" variant="h4" component="h1">
            Page Title
          </Typography>
        </section>
        ...
      </Stack>
    </Box>
  </Container>
</Box>
```

- One `<main>` per page
- `<section>` + `aria-labelledby` for each thematic region
- `<nav aria-label="...">` for navigation landmarks
- `<article>` for self-contained content units (invoice cards, etc.)
- `<header>` / `<footer>` for their semantic roles

---

## Buttons vs Links

| Use | Element |
|---|---|
| Performs an action (submit, open modal, delete) | `<Button>` |
| Navigates to a URL or route | `<Link>` / `<a>` |

**Never** put `onClick` on `<Box>`, `<Typography>`, `<div>`, or `<span>`.

---

## Action hierarchy — one dominant action per screen

| Level | Variant | Color |
|---|---|---|
| Primary (one per screen) | `contained` | `primary` |
| Secondary | `outlined` | `primary` |
| Tertiary ("Back", "Cancel") | `text` | `primary` |
| Destructive | `outlined` or `contained` | `error` |

Destructive actions **must** be preceded by a confirmation `Dialog`.

Loading button pattern:
```tsx
<Button
  variant="contained"
  disabled={loading}
  startIcon={loading ? <CircularProgress size={16} color="inherit" /> : null}
>
  {loading ? 'Guardando...' : 'Guardar factura'}
</Button>
```

Icon-only buttons **must** have `aria-label`:
```tsx
<IconButton aria-label="Eliminar factura">
  <DeleteIcon />
</IconButton>
```

---

## Forms

- All fields: `variant="outlined"`, `fullWidth`
- `required` prop for required fields
- Use `error` + `helperText` for validation errors — never a separate `<Typography>` for errors
- Error messages explain what went wrong **and** how to fix it

```tsx
<TextField
  label="RUC"
  required
  fullWidth
  error={!!errors.ruc}
  helperText={errors.ruc ?? '11 dígitos numéricos'}
/>
```

Group related fields under a `<section>` with a `Typography variant="h6"` heading, separated by `<Divider />`.

---

## Accessible focus

Never remove focus outlines globally. Replace them — don't hide them:

```ts
// In theme
'&:focus-visible': {
  outline: '2px solid',
  outlineColor: 'primary.main',
  outlineOffset: '2px',
}
```

---

## Responsive — mobile-first always

```tsx
// ✅ mobile-first
sx={{ p: { xs: 2, md: 4 } }}

// ❌ desktop-first override
sx={{ p: 4, '@media (max-width: 600px)': { p: 2 } }}
```

- Touch targets: minimum 44×44px
- Test at 320px viewport width
- No horizontal scrolling below 1024px

---

## Required states for every list/data area

- **Empty state**: message + forward action (never a blank area)
- **Loading state**: `Skeleton` for known shape, `CircularProgress` for unknown
- **Error state**: `<Alert severity="error">` + retry action

---

## Icons (`@mui/icons-material` only)

- Icons support meaning — they do not replace text labels on interactive elements
- Icon buttons always need `aria-label`
- Decorative icons get `aria-hidden="true"`
- Do not mix filled and outlined icon styles in the same view

---

## Microcopy (Spanish)

Button labels describe the outcome, not just the action:

| ❌ | ✅ |
|---|---|
| Enviar | Guardar factura |
| OK | Confirmar eliminación |
| Cancelar | Volver |
| Subir | Cargar PDF |

Error messages → what went wrong + how to fix it.  
Empty states → explain the empty condition + offer a forward action.  
All user-facing text in **Spanish**.

---

## Quick pre-ship checklist

- [ ] No hardcoded hex values — using `theme.palette.*` tokens
- [ ] Light and dark modes tested
- [ ] Heading hierarchy is sequential (no skipped levels)
- [ ] One `<main>` on the page
- [ ] Sections use `<section aria-labelledby="...">` 
- [ ] Every interactive element is reachable by keyboard
- [ ] Every icon button has `aria-label`
- [ ] Every form field has an associated label
- [ ] One `contained` primary action per screen max
- [ ] Empty, loading, and error states all handled
- [ ] Mobile layout tested at 320px
- [ ] No `onClick` on non-interactive elements (`div`, `span`, `Typography`)
- [ ] Spacing uses MUI multiples (`p: 3`, not `padding: '22px'`)
