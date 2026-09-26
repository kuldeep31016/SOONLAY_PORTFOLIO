# Careers Hero Section Redesign Plan

## Objective
Redesign the careers page hero section to integrate the resume upload CTA directly into the hero (right side), replacing the "How we work" button. Add promotional content for AI resume matching and create a seamless flow from upload → profile summary → recommended positions.

---

## Current State Analysis

### Current Hero (`CareersHero.tsx`)
- Left side: Badge, headline, description, two CTAs ("View open positions", "How we work"), location badges
- Right side: Empty (only background gradients)
- Two buttons: Primary "View open positions" → scrolls to `#open-positions`, Secondary "How we work" → scrolls to `#how-we-work`

### Current Resume Upload (`ResumeUploadCTA.tsx`)
- Compact card in filter area (5th column)
- Opens dialog with full `ResumeRecommendations`
- Uses sessionStorage for 5-min caching

### Current ResumeRecommendations
- Full-screen dialog with tabs: Recommendations / Profile
- Profile tab shows: summary, skills, experience level, years, preferred roles/locations, employment types, industries
- Parsed resume includes: `summary`, `experienceLevel`, `yearsExperience`, `skills`, `preferredRoles`, `preferredLocations`, `employmentTypes`, `industries`

---

## Target State

### Hero Section Layout
```
┌─────────────────────────────────────────────────────────────┐
│  LEFT SIDE (max-w-2xl)          │  RIGHT SIDE (flex-1)     │
├─────────────────────────────────┼──────────────────────────┤
│  Badge: "Careers"               │  ┌─────────────────────┐ │
│  H1: "Build what founders       │  │  📄  Upload Resume   │ │
│       imagine."                 │  │  ─────────────────   │ │
│                                 │  │  Got a great resume? │ │
│  Description paragraph          │  │  Let AI match you    │ │
│                                 │  │  with the best       │ │
│  [View open positions] ▸        │  │  opportunities based │ │
│                                 │  │  on your skills.     │ │
│                                 │  │                      │ │
│  (How we work REMOVED)          │  │  [Upload Resume ▸]   │ │
│                                 │  │  ✨ AI-powered •      │ │
│  Location badges                │  │     Never stored      │ │
└─────────────────────────────────┴──────────────────────────┘
```

### After Upload Flow
1. User uploads resume → dialog opens with recommendations
2. User clicks "View Details" on a recommendation OR closes dialog
3. Page scrolls to `#open-positions` section
4. Hero shows **profile summary banner** (replaces right-side CTA):
   - "You're an expert Android developer with 2+ years experience — you'd be a great asset in these roles"
   - Shows key extracted: experience level, years, top skills
   - "View my matches" button scrolls to filtered positions

---

## Implementation Plan

### Phase 1: Redesign Hero Section (`CareersHero.tsx`)

**Files to Modify:**
- `components/careers/CareersHero.tsx` — Major restructure

**Changes:**
1. Convert to **two-column grid** (`lg:grid-cols-2 gap-8`)
2. **Left column** (`max-w-2xl`):
   - Keep: Badge, H1, description
   - Keep: Primary "View open positions" button
   - **Remove**: "How we work" secondary button
   - Keep: Location badges
3. **Right column** (new):
   - Resume upload CTA card (adapted from `ResumeUploadCTA`)
   - Promotional text: "Got a great resume? Let AI match you with the best opportunities based on your skills."
   - Upload button opens same dialog
   - "Powered by AI — your data is never stored" footer

**State Management:**
- Hero becomes a **client component** (`"use client"`)
- Use `useState` for upload dialog open/close
- Reuse existing `ResumeUploadCTA` dialog logic

### Phase 2: Profile Summary Banner (Post-Upload)

**New Component:** `ResumeProfileBanner.tsx`
- Shows after successful upload (replaces right-side CTA in hero)
- Content from parsed resume:
  - Experience level + years: "Senior Frontend Developer • 5+ years"
  - Top 3 skills badges
  - One-line pitch: "You're an expert React developer with 5+ years experience — you'd be a great asset in these roles"
  - CTA: "View my matches" → scrolls to `#open-positions` with filter applied

**State Persistence:**
- Use `sessionStorage` (existing `resume_recommendations_cache`)
- On page load, check cache → if exists, show banner instead of CTA
- "Clear" button removes cache and restores CTA

### Phase 3: Scroll to Recommendations

**Behavior:**
- When user clicks "View my matches" or closes dialog after upload
- Scroll to `#open-positions` section
- Optionally: Pre-fill search/filters based on parsed resume (future enhancement)

### Phase 4: Cleanup

**Remove:**
- `ResumeUploadCTA` from `JobFiltersForm` (filter area)
- `showResumeCTA` prop from `JobFiltersForm` and `OpenPositionsSection`
- Keep `ResumeRecommendations` dialog (used by hero CTA)

---

## Files to Create/Modify

| File | Action | Description |
|------|--------|-------------|
| `components/careers/CareersHero.tsx` | **Major rewrite** | Two-column layout, integrate upload CTA, remove "How we work" |
| `components/careers/ResumeProfileBanner.tsx` | **New** | Post-upload profile summary banner for hero |
| `components/careers/ResumeUploadCTA.tsx` | **Modify** | Extract dialog logic for reuse; keep for potential mobile use |
| `components/careers/ResumeRecommendations.tsx` | **Modify** | Add callback prop for "onUploadComplete" to trigger scroll |
| `components/careers/JobFiltersForm.tsx` | **Modify** | Remove `showResumeCTA` prop and CTA rendering |
| `components/careers/OpenPositionsSection.tsx` | **Modify** | Remove `showResumeCTA` prop |
| `app/careers/page.tsx` | **Modify** | Pass scroll callback to hero |

---

## User Experience Flow

```
1. User lands on /careers
   → Hero shows: Left (content + "View open positions") + Right (Resume CTA card)

2. User clicks "Upload resume" in hero
   → Dialog opens with drag-drop upload

3. User uploads resume
   → AI processes → recommendations generated
   → Dialog shows recommendations + profile tabs

4. User clicks "View Details" on a job OR closes dialog
   → Dialog closes
   → Hero right side REPLACED with Profile Banner
   → Page scrolls to #open-positions
   → OpenPositionsSection shows recommendations (pre-filtered if possible)

5. User can click "Clear" on banner
   → sessionStorage cleared
   → Hero right side RESTORED to Resume CTA card
```

---

## Technical Considerations

### State Management
- **Hero**: Local state for dialog open/close
- **Profile Banner**: Read from `sessionStorage` on mount (existing cache)
- **ResumeRecommendations**: Add `onUploadComplete?: () => void` prop for scroll trigger

### Scroll Behavior
```typescript
// In ResumeRecommendations after upload success
const handleUploadComplete = () => {
  const section = document.getElementById('open-positions')
  section?.scrollIntoView({ behavior: 'smooth' })
  onUploadComplete?.()
}
```

### Cache Integration
- Existing `resume_recommendations_cache` in sessionStorage (5 min TTL)
- Hero reads cache on mount → shows banner if valid
- Banner "Clear" button → `sessionStorage.removeItem('resume_recommendations_cache')`

### Responsive Design
- **Desktop (lg+)**: Two-column hero, CTA in right column
- **Tablet (md)**: Stacked, CTA below content
- **Mobile**: Single column, CTA card below content

---

## Clarifying Questions

1. **Hero Image/Illustration**: Should the right side include an illustration/image, or just the CTA card with text? The user mentioned "image with some text" — do you have an asset, or should we use a simple icon/illustration (e.g., Brain + document)?

2. **Profile Banner Position**: Should the post-upload banner replace the entire right column, or appear as a sticky banner at the top of the page?

3. **Pre-filtering Jobs**: After upload, should the open positions section auto-filter by the parsed resume's skills/location? Or just scroll to the section with all jobs visible?

3. **"How We Work" Section**: Is there a `#how-we-work` section on the page? If not, removing the button is safe. If yes, should it move elsewhere?

4. **Mobile Hero Layout**: On mobile, should the CTA card appear above or below the "View open positions" button?

5. **Animation**: Should the hero right-side transition (CTA ↔ Profile Banner) be animated (e.g., fade/slide)?

---

## Estimated Effort

| Phase | Tasks | Estimate |
|-------|-------|----------|
| Phase 1: Hero Redesign | Two-column layout, integrate CTA, remove button | 2-3 hrs |
| Phase 2: Profile Banner | New component, cache integration, hero integration | 2-3 hrs |
| Phase 3: Scroll Integration | Callback props, smooth scroll behavior | 1 hr |
| Phase 4: Cleanup | Remove filter-area CTA, unused props | 30 min |
| **Total** | | **~6-7 hours** |

---

## Ready to Execute?

Please confirm:
1. Which questions above you'd like to decide on
2. Whether to proceed with the plan as-is or with modifications
3. Any specific design preferences for the right-side content (image vs icon, exact copy)