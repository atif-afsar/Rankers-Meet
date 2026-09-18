# Rankers Meet 2026 — Mobile-First Landing Page UI/UX & Frontend Specification

## 0. PURPOSE

This document is specifically for designing and implementing the **mobile experience** of:

`/rankers-meet`

for Yasir Ali Classes (YAC).

The primary assumption is:

> Most visitors will arrive from Instagram, WhatsApp, YouTube, or mobile browsers.

Therefore, mobile is not a secondary responsive version of desktop.

**Mobile is the primary product.**

The desktop version must adapt from the mobile design system, not the other way around.

The experience should feel premium, cinematic, interactive, fast, and extremely easy to use with one hand.

---

# 1. BRAND FOUNDATION

Official website:

https://www.yasiraliclasses.in/

Use the existing YAC website as the source of truth for brand identity.

Preserve:

- Yasir Ali Classes identity
- YAC logo
- Red brand language
- White/light backgrounds
- Dark typography
- Achievement/result positioning
- Student photography
- Premium education positioning
- Existing brand tone

The official YAC material also uses the recognizable message:

"We Debit Efforts to Credit Your Success."

Use the existing brand language where appropriate rather than inventing unrelated branding.

Do not make Rankers Meet look like a different company.

Instead:

**Create a premium event identity inside the YAC ecosystem.**

---

# 2. PRIMARY MOBILE DEVICES

Design and test specifically for:

### Small mobile

320 × 568

### Common Android

360 × 800

### Modern Android

390 × 844

### iPhone

390 × 844

### Large phone

430 × 932

### Landscape fallback

844 × 390

Do not design only for 390px width.

The layout must fluidly adapt.

---

# 3. MOBILE-FIRST PHILOSOPHY

Do NOT simply:

- shrink desktop
- stack desktop columns
- reduce font sizes
- hide half the content

Instead redesign interactions specifically for touch.

Mobile principles:

- one-handed operation
- large tap targets
- short visual sections
- strong hierarchy
- minimal cognitive load
- thumb-friendly navigation
- fast registration
- controlled animation
- immediate feedback

---

# 4. MOBILE VISUAL DIRECTION

The mobile website should feel like:

**A premium event microsite inside a mobile app.**

Visual references:

- Apple-level spacing
- premium event websites
- modern award ceremony interfaces
- editorial magazine layouts
- premium education brands
- modern fintech-level interaction quality

But maintain YAC's identity.

Avoid:

- generic SaaS layouts
- generic coaching templates
- excessive glassmorphism
- excessive gradients
- neon colors
- childish education graphics
- giant unnecessary 3D objects

---

# 5. MOBILE COLOR SYSTEM

Primary:

YAC Red:
`#D91F2B`

Deep Red:
`#A9131D`

Dark:
`#101522`

White:
`#FFFFFF`

Soft Red:
`#FFF5F5`

Border:
`#F0D5D7`

Muted:
`#6B7280`

Achievement Gold:

`#C89B3C`

Gold should only be an accent.

Red remains the dominant event color.

---

# 6. MOBILE TYPOGRAPHY

Use:

Inter / Manrope / Plus Jakarta Sans

Optional editorial serif:

Cormorant Garamond / Playfair Display

Use serif only for selected words.

Example:

"Celebrating"

"Excellence"

"Achievers"

Do NOT use serif for body text.

---

# 7. MOBILE NAVIGATION

Desktop navbar should NOT simply collapse into a generic hamburger.

Create a premium mobile header.

Structure:

┌────────────────────────────┐
│ YAC LOGO     MENU / REGISTER│
└────────────────────────────┘

Header:

- height: 60–68px
- fixed/sticky
- white or translucent background
- subtle bottom border
- slight backdrop blur
- high z-index

---

# 8. MOBILE NAVIGATION INTERACTION

When scrolling down:

Header compresses slightly.

When scrolling up:

Header becomes visible.

At top:

transparent/white depending on hero.

After scroll:

solid white background.

Animation:

200–350ms.

Do not hide navigation permanently.

---

# 9. MOBILE MENU

Menu opens as a full-screen premium overlay.

Background:

white or deep red.

Preferred:

white background with red accents.

Menu items:

HOME
ABOUT
EVENT
HIGHLIGHTS
RANKERS
VENUE

Bottom:

REGISTER NOW →

Each item should enter with staggered animation.

Use:

opacity
translateX
clip-path

Menu close:

X icon morph animation.

---

# 10. MOBILE STICKY REGISTER CTA

Because registration is the primary goal, create a mobile bottom CTA.

Example:

┌────────────────────────────────┐
│ Register for Rankers Meet  →  │
└────────────────────────────────┘

Position:

fixed bottom

Height:

56–68px

Safe-area aware.

Use:

`padding-bottom: env(safe-area-inset-bottom)`

Do not cover important content.

CTA should disappear when the registration form is already active.

---

# 11. HERO — MOBILE

The hero is the most important mobile section.

Target height:

approximately:

`calc(100svh - header height)`

But do not force content into a tiny viewport.

The hero should breathe.

Structure:

Small eyebrow

YASIR ALI CLASSES PRESENTS

Large title:

RANKERS
MEET

2026

Supporting line:

A celebration of achievement, hard work and academic excellence.

Primary CTA:

REGISTER NOW →

Secondary:

EXPLORE EVENT ↓

---

# 12. HERO MOBILE TYPOGRAPHY

Use fluid typography.

Do NOT hardcode one font size.

Use CSS clamp.

Example concept:

```css
font-size: clamp(3rem, 15vw, 5.5rem);
```

But adjust after visual testing.

Heading should dominate the screen.

Do not let the heading become so large that:

- buttons disappear below fold
- date is hidden
- text wraps awkwardly

---

# 13. HERO MOBILE ANIMATION

Use a cinematic reveal.

Sequence:

1. Logo/header settles.
2. Eyebrow fades in.
3. "RANKERS" reveals upward.
4. "MEET" reveals upward.
5. "2026" scales in.
6. Supporting text fades in.
7. CTA slides upward.
8. Event indicator appears.

Total initial animation:

approximately 900–1400ms.

Do not delay usability.

CTA should become clickable almost immediately.

---

# 14. MOBILE HERO BACKGROUND

Use subtle red abstract shapes.

Possible:

- curved YAC ribbon
- soft red gradient
- thin lines
- blurred red orb
- trophy silhouette
- event texture

Motion should be very slow.

Avoid:

- particles everywhere
- heavy video backgrounds
- aggressive parallax

---

# 15. MOBILE HERO IMAGE

If using student/event photography:

Use one strong image rather than a collage of 5–10 images.

Recommended composition:

Hero content
+
single premium image/card

Image can appear beneath the headline.

Use:

`aspect-ratio: 4 / 3`

or

`aspect-ratio: 1 / 1`

depending on the source.

Do not crop faces.

---

# 16. MOBILE HERO INTERACTION

Touch devices do not have hover.

Therefore replace desktop hover interactions with:

- scroll movement
- tap
- swipe
- press feedback

Example:

User swipes upward:

Hero elements subtly move.

Do not require interaction to understand the hero.

---

# 17. EVENT COUNTDOWN — MOBILE

Create a compact countdown.

Example:

EVENT STARTS IN

12     08     32     15
DAYS  HOURS  MIN   SEC

Use four cards.

Each card:

- 68–76px width on common phones
- rounded 16px
- white background
- subtle shadow

Numbers large.

Labels small.

On number change:

Use vertical slide.

Avoid aggressive ticking.

---

# 18. EVENT INFORMATION — MOBILE

Use a stacked card system.

Instead of desktop 3-column cards:

DATE

[date]

TIME

[time]

VENUE

[venue]

Each card should have:

icon
label
value
micro animation

Cards can slide horizontally on larger phones if appropriate, but avoid hiding critical details in a carousel.

---

# 19. HORIZONTAL EVENT CAROUSELS

Use horizontal scrolling only where it adds value.

Good:

- event highlights
- photos
- audience categories
- ranker cards

Bad:

- event date
- registration fields
- essential information

Always show a visual cue that content continues.

---

# 20. SECTION SPACING

Mobile sections need breathing room.

Suggested:

Vertical section padding:

`72px – 104px`

Do not make every section exactly the same.

Use rhythm:

72
96
80
120

depending on content.

---

# 21. SCROLL REVEALS

Use scroll-triggered animation.

Preferred:

fade-up
clip reveal
scale reveal

Duration:

450–750ms

Stagger:

50–100ms

Animation distance:

16–40px

Do not use 100px+ dramatic movement.

---

# 22. MOBILE PARALLAX

Use only subtle parallax.

Example:

background:

0 → 12px

image:

0 → 20px

Text:

0 → 5px

Never create large movement.

This prevents:

- dizziness
- jank
- accidental layout problems

---

# 23. "WHY THIS EVENT MATTERS"

Use an editorial mobile layout.

Large statement:

SUCCESS
DESERVES
TO BE
CELEBRATED.

Highlight one word in red/serif.

Below:

short paragraph.

Then:

small achievement visual.

This section should feel emotional rather than informational.

---

# 24. WHO CAN ATTEND — MOBILE

Use stacked interactive cards.

Example:

YAC RANKERS
Top performers and achievers

STUDENTS
Academic achievers

PARENTS
Celebrate the journey

GUESTS
Be part of the celebration

Interaction:

Tap card.

Card expands.

Additional content appears.

Animation:

height/opacity/transform.

Do not hide essential information behind the tap.

---

# 25. RANKERS SECTION — MOBILE

Create a strong vertical storytelling sequence.

Each ranker:

01

Student Name

Exam

Achievement

Photo

Use large rank numbers in the background.

Example:

01
      Student Photo
      Ahmed Khan
      NEET — Rank 245

Next:

02
...

Scroll should feel like moving through a prestigious awards ceremony.

---

# 26. RANKER CARD MOTION

As card enters viewport:

1. Large rank number appears.
2. Image clip-reveals.
3. Student name fades upward.
4. Achievement line appears.
5. Red accent line grows.

Total:

600–900ms.

Keep animations synchronized.

---

# 27. STATISTICS — MOBILE

Use one statistic at a time or a 2×2 grid.

Example:

80K+
Students Mentored

10+
Years

4.9★
Google Rating

Use only verified values.

Do not invent achievement numbers.

Counters animate once.

Respect reduced-motion preference.

---

# 28. EVENT HIGHLIGHTS — MOBILE

Create a vertical editorial gallery.

Use:

large image
small image
large image
video/moment if available

Each image:

- rounded 20–24px
- subtle shadow
- slight zoom on tap
- caption overlay

Avoid 10 small thumbnails.

Quality over quantity.

---

# 29. IMAGE LIGHTBOX

When a user taps an event image:

Open fullscreen lightbox.

Features:

- image
- caption
- close button
- swipe left/right
- pinch zoom where practical

Use native-feeling interaction.

Prevent background scrolling while open.

---

# 30. MOBILE TIMELINE

Desktop horizontal timeline becomes vertical.

Example:

10:00
Arrival

│
●

10:30
Welcome

│
●

11:00
Rankers Recognition

│
●

12:00
Special Session

Animate timeline progress as user scrolls.

---

# 31. VENUE — MOBILE

Create a compact venue card.

Show:

Venue name

Address

City

Then:

GET DIRECTIONS →

Use a map preview if appropriate.

Do not load a heavy interactive map automatically.

Prefer:

static map image or lightweight map preview.

Open actual maps only after user taps.

---

# 32. FINAL CTA — MOBILE

This should be one of the strongest sections.

Background:

YAC red

Text:

YOUR ACHIEVEMENT
DESERVES A MOMENT.

Supporting:

Join us as we celebrate excellence.

CTA:

REGISTER NOW →

Animation:

Button subtly pulses once when entering viewport.

Do not continuously pulse.

---

# 33. MOBILE REGISTRATION TRANSITION

When user taps Register Now:

Preferred:

Navigate to:

`/rankers-meet/register`

Transition:

hero/page fades

registration page slides in

Keep transition:

300–450ms

Do not use a 2-second cinematic transition.

The user came to register.

Speed matters.

---

# 34. MOBILE REGISTRATION FORM

The form must be designed specifically for mobile.

Use one field per row.

Input height:

minimum 52px

Recommended:

56px

Border radius:

14–16px

Font:

16px minimum

This prevents iOS Safari zoom behavior.

---

# 35. MOBILE FORM STRUCTURE

Step 1:

PERSONAL

Student Name
Parent/Guardian Name
Mobile
Email

Button:

CONTINUE →

Step 2:

ACADEMIC

Class/Course
Exam
Rank
School/College

Button:

CONTINUE →

Step 3:

GUESTS

Number of Guests

Button:

COMPLETE REGISTRATION →

---

# 36. FORM PROGRESS

At top:

STEP 1 OF 3

Personal

Use a progress bar.

Example:

●━━━━○━━━━○

Animate progress smoothly.

---

# 37. MOBILE KEYBOARD UX

Inputs must be keyboard optimized.

Use:

type="tel"

for mobile.

Use:

inputmode="numeric"

for rank/guest count.

Use:

autocomplete where appropriate.

Email:

`type="email"`

Do not let keyboard cover the active field.

Use scrollIntoView when necessary.

---

# 38. FORM VALIDATION

Validation should be:

fast
clear
human

Example:

"Please enter your mobile number."

Not:

"Invalid input."

Errors appear near the field.

On valid input:

small check indicator.

Do not create aggressive shaking animations.

---

# 39. SUBMIT EXPERIENCE

When user submits:

Button:

REGISTERING...

Disable duplicate submission.

Then:

success animation.

Example:

✓

REGISTRATION CONFIRMED

Your Registration ID:

RM1024

---

# 40. SUCCESS SCREEN — MOBILE

Full-screen success experience.

Structure:

✓

YOU'RE REGISTERED

Rankers Meet 2026

Registration ID

RM1024

QR CODE

Keep this QR ready for event entry.

Buttons:

DOWNLOAD TICKET

SEND TO EMAIL

---

# 41. QR TICKET MOBILE DESIGN

QR should be large enough for reliable scanning.

Minimum practical QR display:

approximately 220px × 220px

depending on ticket design.

Ticket:

white card
red header
QR
student details
event details

Allow:

Download Ticket

Share Ticket

Do not require pinch zoom to scan.

---

# 42. MOBILE SHARE

Use the Web Share API when supported.

Example:

Share Ticket

Possible share options:

WhatsApp
Messages
Email
Other apps

Fallback:

Copy Ticket Link

Do not require WhatsApp API for basic ticket sharing.

---

# 43. MOBILE CHECK-IN EXPERIENCE

Although the landing page is user-facing, the check-in system should also be optimized for mobile.

Staff interface:

large scanner

large status

large buttons

minimal UI

After scan:

VALID

CHECK-IN SUCCESSFUL

Student Name

RM1024

Then:

SCAN NEXT

---

# 44. TOUCH TARGETS

Minimum:

44 × 44px

Preferred primary controls:

48–56px

Buttons should have generous spacing.

Never place two destructive/action buttons too close together.

---

# 45. MOBILE GESTURES

Use gestures only where natural.

Allowed:

swipe gallery
swipe lightbox
tap cards
scroll parallax

Avoid:

custom swipe navigation for the whole website

Avoid:

gesture-only navigation

Users must always have visible controls.

---

# 46. MOBILE MICRO-INTERACTIONS

Button press:

scale:

0.97

Card press:

scale:

0.985

Input focus:

border transition

Checkbox:

check animation

Menu:

slide/fade

Use 150–300ms for micro interactions.

---

# 47. MOBILE CUSTOM CURSOR

DO NOT use a custom cursor on mobile.

Detect:

touch / coarse pointer

Disable completely.

---

# 48. MOBILE MAGNETIC BUTTONS

DO NOT use magnetic cursor effects on touch devices.

Only enable for:

`@media (pointer: fine)`

Mobile buttons should instead have:

press animation

shadow change

arrow movement

---

# 49. MOBILE 3D

3D is optional.

Default:

Do not load heavy 3D on mobile.

If used:

- low-poly
- low texture size
- limited lighting
- no continuous expensive rendering
- pause when not visible

Prefer a pre-rendered image/video fallback.

---

# 50. MOBILE VIDEO

Do not autoplay large videos by default.

If using video:

- muted
- playsInline
- poster image
- compressed
- lazy loaded
- pause when not visible

Hero video should never prevent the page from loading.

---

# 51. PERFORMANCE TARGETS

Target:

60fps for interactions

Fast first render

Minimal JS

No layout shift

No long blocking tasks

Avoid loading:

- Three.js
- large animation libraries
- huge galleries

until actually needed.

---

# 52. CODE SPLITTING

Lazy load:

Gallery
Lightbox
3D
Map
Registration-heavy modules

Do not load every feature on first paint.

---

# 53. MOBILE IMAGE OPTIMIZATION

Use:

AVIF/WebP

Responsive image sizes.

Example concept:

320
480
640
768

Use `srcset`.

Set explicit dimensions/aspect ratios.

Prevent layout shifts.

---

# 54. SAFE AREA

Support modern phones.

Use:

`env(safe-area-inset-top)`

`env(safe-area-inset-bottom)`

Especially for:

fixed header
bottom registration CTA
success screen
fullscreen ticket

---

# 55. MOBILE FOOTER

Keep footer compact.

Include:

Yasir Ali Classes

Rankers Meet 2026

Contact

Official website

Social links

Privacy / Terms if applicable

Do not create a huge desktop-style footer.

---

# 56. MOBILE CTA STRATEGY

Primary CTA:

REGISTER NOW →

Secondary:

EXPLORE EVENT

Do not have five competing CTA styles.

The user should always know:

"What should I do next?"

---

# 57. MOBILE SECTION ORDER

Recommended:

1. Header
2. Hero
3. Quick event info
4. Countdown
5. Why this event matters
6. Who can attend
7. Achievement/rankers
8. Statistics
9. Event highlights
10. Timeline
11. Venue
12. Final CTA
13. Footer

This order can be adjusted after content testing.

---

# 58. MOBILE CONTENT LENGTH

Avoid large text blocks.

Preferred:

Heading:
1–3 lines

Description:
2–4 lines

Card:
short copy

If information is long:

Use accordion.

Do not make users scroll through walls of text.

---

# 59. MOBILE ACCORDION

Use for:

FAQ
additional event details
terms

Interaction:

tap

Chevron rotates.

Content expands smoothly.

Only animate max-height/height carefully.

Avoid huge animated height transitions.

---

# 60. MOBILE FAQ

Questions:

Who can attend?

How do I register?

Is registration free?

Can parents attend?

What should I bring?

How do I receive my QR ticket?

What happens at the entrance?

Use actual event policy/data.

Do not invent answers.

---

# 61. REDUCED MOTION

If:

`prefers-reduced-motion: reduce`

Then:

- disable parallax
- disable magnetic buttons
- disable custom animation sequences
- reduce transitions
- disable decorative background motion
- keep essential state changes visible

The page must still look premium without animation.

---

# 62. ACCESSIBILITY

Ensure:

- semantic HTML
- correct headings
- accessible labels
- 44px+ tap targets
- visible focus states
- sufficient contrast
- alt text
- keyboard support
- screen reader support

Do not use animation as the only way to communicate state.

---

# 63. MOBILE BROWSER TESTING

Test:

Chrome Android

Safari iPhone

Chrome iPhone

Samsung Internet

Firefox mobile where practical

Test:

slow network
normal network
fast network

Test:

light mode
dark system preference if supported

---

# 64. MOBILE QA DEVICE MATRIX

Minimum:

iPhone 390 × 844

Android 360 × 800

Android 412 × 915

Small 320px device

Tablet 768px

Desktop 1440px

---

# 65. MOBILE BUG CHECKLIST

Verify:

[ ] No horizontal scrolling

[ ] No text clipping

[ ] No oversized images

[ ] Header does not cover content

[ ] Bottom CTA does not cover buttons

[ ] Inputs don't cause unwanted zoom

[ ] Keyboard does not cover inputs

[ ] QR remains visible

[ ] Images load correctly

[ ] Animations don't stutter

[ ] No console errors

[ ] No broken links

[ ] Menu opens/closes correctly

[ ] Back navigation works

[ ] Form state is preserved appropriately

---

# 66. MOBILE VISUAL QA

At first glance, verify:

Does the hero immediately communicate Rankers Meet?

Is the Register button obvious?

Does the page look like YAC?

Does it look premium?

Does the page feel interactive without being annoying?

Does every section have enough whitespace?

Does the design feel intentional?

---

# 67. IMPORTANT: MOBILE SHOULD NOT LOOK LIKE A DESKTOP SHRUNK DOWN

This is mandatory.

The following should be redesigned for mobile:

- Hero composition
- Navigation
- CTA
- Event cards
- Timeline
- Ranker section
- Gallery
- Registration form
- Success ticket
- Footer

Do not merely use:

`display: block`

on desktop layouts.

---

# 68. MOBILE MOTION LANGUAGE

Use three motion levels.

## Level 1 — Essential

Button press
Input focus
Menu
Validation

150–300ms

## Level 2 — Content

Section reveal
Image reveal
Counter

400–800ms

## Level 3 — Atmosphere

Background shapes
Slow image movement
Decorative elements

5–30 seconds

Never use Level 3 animation for functional UI.

---

# 69. MOBILE DESIGN TOKENS

Create reusable tokens.

Example:

```css
--mobile-page-padding: 20px;
--mobile-section-padding: 80px;
--mobile-radius: 18px;
--mobile-button-height: 56px;
--mobile-input-height: 56px;
--mobile-header-height: 64px;
```

Use CSS variables/Tailwind theme rather than repeated hardcoded values.

---

# 70. MOBILE COMPONENT ARCHITECTURE

Suggested:

```text
mobile/
├── MobileHeader
├── MobileMenu
├── MobileHero
├── MobileEventQuickInfo
├── MobileCountdown
├── MobileStorySection
├── MobileAudienceCards
├── MobileRankerStory
├── MobileStats
├── MobileGallery
├── MobileTimeline
├── MobileVenue
├── MobileFinalCTA
├── MobileBottomCTA
├── MobileTicket
├── MobileSuccess
└── MobileFAQ
```

Components can share data and design tokens with desktop components where appropriate.

Do not duplicate business logic unnecessarily.

---

# 71. RESPONSIVE BREAKPOINTS

Use mobile-first CSS.

Suggested:

Base:
320–639px

Large mobile:
640–767px

Tablet:
768–1023px

Desktop:
1024px+

Do not create dozens of breakpoints.

Use fluid CSS where possible.

---

# 72. MOBILE DATA ARCHITECTURE

Event data must remain shared.

Example:

```js
eventData = {
  name: "Rankers Meet 2026",
  date,
  time,
  venue,
  address,
  description,
  highlights,
  schedule,
  stats,
  rankers
}
```

Mobile components should consume the same trusted data.

Do not create separate hardcoded mobile content.

---

# 73. MOBILE REGISTRATION CONVERSION

The mobile experience should minimize the number of decisions.

User journey:

OPEN LINK

↓

UNDERSTAND EVENT

↓

REGISTER NOW

↓

FORM

↓

CONFIRM

↓

QR TICKET

Target:

The registration flow should feel extremely short and simple.

Do not add unnecessary fields.

---

# 74. SOCIAL-MEDIA ENTRY EXPERIENCE

Most visitors may arrive from:

Instagram
WhatsApp
YouTube
Facebook

Therefore:

Landing page must render immediately.

Do not require login.

Do not show desktop-only navigation.

Do not open large popups immediately.

Do not block content with cookie/marketing overlays unless required.

---

# 75. DEEP-LINK BEHAVIOR

If user opens:

`/rankers-meet`

directly:

Hero loads.

If user opens:

`/rankers-meet/register`

directly:

Registration page loads.

If user returns using browser back:

Preserve expected navigation behavior.

---

# 76. FINAL MOBILE EXPERIENCE

The ideal sequence should feel like:

OPEN

↓

YAC BRAND REVEAL

↓

"RANKERS MEET 2026"

↓

SUBTLE MOTION

↓

EVENT DATE

↓

REGISTER NOW

↓

STORY

↓

ACHIEVEMENT

↓

RANKERS

↓

CELEBRATION

↓

REGISTER NOW

↓

FORM

↓

QR TICKET

This should feel closer to a premium event application than a traditional coaching website.

---

# 77. FINAL IMPLEMENTATION RULE

Before writing the mobile frontend:

1. Inspect the existing YAC codebase.
2. Identify current routing.
3. Identify existing CSS/Tailwind configuration.
4. Identify existing fonts.
5. Identify existing logo/assets.
6. Identify existing image assets.
7. Identify reusable components.
8. Do NOT replace working global components without reason.

Then implement mobile-first.

---

# 78. IMPLEMENTATION PHASES

### Phase 1

Audit existing project.

### Phase 2

Create mobile design tokens.

### Phase 3

Build mobile header/menu.

### Phase 4

Build hero.

### Phase 5

Build event information.

### Phase 6

Build story/achievement sections.

### Phase 7

Build ranker section.

### Phase 8

Build gallery/timeline/venue.

### Phase 9

Build final CTA.

### Phase 10

Build mobile registration.

### Phase 11

Build QR success ticket.

### Phase 12

Add motion.

### Phase 13

Optimize performance.

### Phase 14

Test all mobile devices.

---

# 79. IMPORTANT IDE INSTRUCTION

Do NOT generate all mobile components blindly in one pass.

For each phase:

1. Implement.
2. Run the project.
3. Open at 320px.
4. Open at 360px.
5. Open at 390px.
6. Open at 430px.
7. Check touch interactions.
8. Check console.
9. Fix layout problems.
10. Continue.

Do not move to the next phase if the current phase has broken mobile behavior.

---

# 80. FINAL QUALITY BAR

The final mobile page should satisfy:

[ ] Feels premium immediately

[ ] YAC identity is obvious

[ ] Hero is visually memorable

[ ] Register CTA is impossible to miss

[ ] Animations are smooth

[ ] No unnecessary animation

[ ] One-handed interaction is comfortable

[ ] Forms are extremely easy

[ ] Typography is readable

[ ] Images are optimized

[ ] Page loads quickly

[ ] No horizontal overflow

[ ] Navigation is intuitive

[ ] Registration flow is short

[ ] QR ticket is easy to display

[ ] Reduced-motion works

[ ] Accessibility works

[ ] No console errors

[ ] No broken desktop functionality

---

# FINAL CREATIVE DIRECTIVE

Build the mobile version as if it were a **premium event app experience running inside a browser**.

Do not think:

"How do I fit the desktop website onto mobile?"

Think:

"How would I design the best possible Rankers Meet experience if mobile were the only platform?"

The final experience should communicate:

**ACHIEVEMENT**
**EXCELLENCE**
**CELEBRATION**
**YAC**
**TRUST**

The visitor should be able to open the page from Instagram or WhatsApp, understand the event within seconds, feel the premium quality, and register with almost no friction.

Animation should create the "wow" factor.

UX should create the "this is easy" feeling.

YAC branding should create the "this is trustworthy" feeling.

The combination should make the Rankers Meet landing page feel professionally produced by a top-tier digital experience agency.
