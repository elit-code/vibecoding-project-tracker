# Vibecoding Project Tracker — Design

**Status:** Hackathon starter design doc · fill in the **`<TODO>`** sections before you tag `design-done`.

**Why this file exists.** This tracker is your tool. It should look like *your* tool — not a generic Kanban with default Tailwind blue. Twenty minutes of design decisions here will be visible on every screen for the next six weeks of Module 5.

**Who owns this.** Person B, during the same window the rest of the team is reviewing the PRD. By the time the team converges to start M4 (`data-model`), this file should be filled in and the colors should already be in `tailwind.config.js`.

---

## 1. Mood / vibe

One sentence that captures the feeling the tracker should leave you with.

Clarity in complexity: a sophisticated, atmospheric cockpit that pairs deep oceanic tones with glassmorphic accents to keep the user focused and calm.

Two or three references that capture the vibe (links to dribbble shots, screenshots of apps you admire, Pinterest boards — anything visual):

* Dark mode, glassmorphic SaaS dashboards with heavy backdrop blurs.
* High-contrast, deep-sea themed code editor themes like Cobalt2.
* Linear's minimalist, dark-mode task management interface.

Anti-references — what we are explicitly **not** trying to look like:

* Cluttered, heavy-shadow traditional SaaS interfaces with default Tailwind blues and stark white backgrounds.

## 2. Color palette

These are the colors the build milestones will reference. Once chosen, paste the hex values into `tailwind.config.js` so the rest of the team can use Tailwind utility classes (e.g. `bg-brand-primary`, `border-due-warning`).

### Brand

| Token | Hex | Where it shows up |
| --- | --- | --- |
| `brand-primary` | #57f1db | Header, "+" button, focus rings |
| `brand-accent` | #3cddc7 | Highlights, hover states, links |
| `surface-page` | #101415 | Page background |
| `surface-card` | #1d2022 | Card background |
| `text-primary` | #e0e3e5 | Body text |
| `text-muted` | #bacac5 | Captions, dates, counts |

### Task type (M6 `tag-style`)

| Token | Hex | When used |
| --- | --- | --- |
| `type-feature` | #cfdaf2 | Cards tagged `feature` (accent stripe + icon) |
| `type-bug` | #ffb4ab | Cards tagged `bug` (accent stripe + icon) |

### Due-date states (M8 `due-tint`)

| Token | Hex | When used |
| --- | --- | --- |
| `due-safe` | #3cddc7 | More than 2 days out |
| `due-warning` | #cfdaf2 | Less than 24 hours |
| `due-overdue` | #ffb4ab | Past due |
| `due-neutral` | #39494e | Done (overrides date) |

## 3. Typography

| Role | Font | Why |
| --- | --- | --- |
| Heading | Comfortaa | Brings a soft, geometric, and friendly energy with rounded terminals that complement the glass UI. |
| Body | Hanken Grotesk | Sharp, contemporary geometry ensures excellent legibility at small sizes for task descriptions. |
| Monospace | JetBrains Mono | Provides a precise, engineered look for technical metadata like tags, timestamps, and IDs. |

Suggested sizes (override only if the design demands it):

* Page title: 24 px / semibold
* Section header: 16 px / semibold uppercase
* Card title: 14 px / medium
* Body: 14 px / regular
* Caption: 12 px / regular muted

## 4. Component principles

One short sentence per element. These set the tone for the build phase — Person A's modal and Person B's anchor board should both feel like they came from this doc.

* **Cards:** Glassmorphic 1rem-radius containers at 80% opacity, featuring a subtle 1px top-border gradient and a soft 32px ambient shadow.
* **Buttons:** Solid #57f1db background with black text for maximum contrast, 0.5rem radius, and a squishy scale-0.98 hover effect.
* **Modal:** Large-scale glass surfaces that occupy 80% of the screen height, utilizing a heavy 40px backdrop blur to isolate user focus.
* **Empty states:** Quiet and receding, utilizing low-opacity slate tones (#323537) and text that doesn't distract from active tasks.
* **Drag affordance (if used):** None — rely on the card's entire surface area, applying a 2px primary teal outer glow when active to maintain the glass aesthetic.

## 5. Voice / microcopy

Three lines of microcopy that capture the tone of the product. Keep it short — these are the words a stressed user reads at 11pm.

| Where | Text |
| --- | --- |
| "+" button label | + Task |
| Empty column placeholder | Awaiting input. |
| Toast after "Copy as Prompt Context" | Context copied to clipboard. |
| Confirm-delete message | Permanently delete this task? |
| Handoff toast (M7 `task-owner`) | Handoff complete. {name} has the context. |

## 6. Logo / wordmark

The tracker probably doesn't need a logo, but it does need a name and a wordmark style.

* **Product name:** Aetheric Kanban
* **Wordmark style:** Just the name set in Comfortaa display-lg, using the brand-primary teal, with no icon to maintain modern minimalism.

## 7. Out of scope (this hackathon)

To keep design tight, the following are explicitly not part of `design-done`:

* A dark mode toggle. Pick one mode and ship it.
* Multiple themes. One brand, applied consistently.
* Animations beyond a 200 ms fade on toast notifications.
* A custom icon set. Use Lucide icons via Tailwind classes if you need any.

---

*DESIGN.md version: hackathon-starter v1*