# Rankers Meet 2026 — Premium Interactive Landing Page UI/UX & Frontend Specification

## 0. ROLE

You are a senior product designer, creative frontend engineer, interaction designer, and motion designer.

Redesign and build the **Rankers Meet 2026 landing page for Yasir Ali Classes (YAC)** as a premium, highly interactive event experience.

The result must feel like a website created by a top-tier digital product/creative agency, while remaining clearly connected to the existing Yasir Ali Classes brand.

This is NOT a generic education landing page.

It should feel like a **premium academic celebration + achievement event**.

The experience should make visitors think:

> "This is an extremely polished website."

---

# 1. OFFICIAL BRAND REFERENCE

Official website:

https://www.yasiraliclasses.in/

Use the existing official YAC website as the primary visual and content reference.

Current brand characteristics to preserve:

- YAC / Yasir Ali Classes identity
- Strong red brand color
- White/light backgrounds
- Dark navy/black typography
- Rounded CTA buttons
- Premium education positioning
- Serif italic display accents
- Clean navigation
- Achievement/result-oriented messaging
- Strong use of student/result imagery
- Red + white visual system

Do NOT blindly copy the existing website.

Instead:

**Evolve the existing YAC visual language into a much more premium Rankers Meet event experience.**

Reference screenshots supplied with this specification should also be treated as visual references for the existing YAC website.

---

# 2. PRIMARY OBJECTIVE

Build:

/rankers-meet

The page should be:

- Extremely polished
- Interactive
- Motion-rich
- Fast
- Mobile-first
- Conversion-focused
- Accessible
- Responsive
- Production-ready

The main conversion is:

**Register Now**

The page should naturally guide users from:

DISCOVER
→ UNDERSTAND
→ FEEL THE EVENT
→ TRUST YAC
→ REGISTER

---

# 3. IMPORTANT DESIGN PRINCIPLE

Do NOT fill every section with animation.

The goal is not:

"More animations = better."

The goal is:

**Every animation must have a purpose.**

Use motion to:

- establish hierarchy
- create anticipation
- reveal information
- guide attention
- provide feedback
- create delight
- make the event memorable

Avoid:

- random floating objects
- excessive particles
- constant text movement
- unnecessary 3D
- distracting parallax
- animation on every element
- slow page transitions
- gimmicky effects that reduce readability

The page should feel expensive, not chaotic.

---

# 4. VISUAL DIRECTION

## Brand Palette

Primary:

YAC Red:
#D91F2B

Secondary Red:
#B81724

Deep Red:
#8F1019

Dark:

#101522

Secondary Dark:

#242938

Background:

#FFFFFF

Soft Background:

#FFF7F7

Border:

#F0D5D7

Muted Text:

#6B7280

Gold accent may be used sparingly for:

- Rank
- Trophy
- Achievement
- Winner highlights

Suggested Gold:

#C89B3C

Do not turn the page into a gold-heavy design.

Red must remain the dominant brand accent.

---

# 5. TYPOGRAPHY

Use a premium modern sans-serif for UI:

Preferred:

Inter / Manrope / Plus Jakarta Sans

Use a sophisticated serif italic accent for selected emotional/display phrases.

Example:

"Celebrating"
"Achievers"
"Your Success Story"

The serif accent should be used sparingly.

Do not use decorative fonts everywhere.

---

# 6. OVERALL PAGE EXPERIENCE

The page should feel like a continuous visual story.

Suggested experience:

LOADING
↓
HERO
↓
EVENT REVEAL
↓
ACHIEVEMENT / RANKERS
↓
EVENT DETAILS
↓
WHY ATTEND
↓
EVENT HIGHLIGHTS
↓
RANKERS / RESULTS
↓
VENUE
↓
REGISTRATION CTA
↓
FOOTER

The user should never feel lost.

Use sticky navigation and contextual CTA buttons.

---

# 7. PAGE ENTRY EXPERIENCE

Create a very short premium loading/reveal.

Do NOT create a long loading screen.

Maximum target:

0.8–1.5 seconds.

Possible animation:

YAC logo appears.

A thin red line expands.

Text:

RANKERS MEET
2026

The page then reveals vertically.

Use:

opacity
transform
clip-path
scale

Avoid blocking the page unnecessarily.

Respect:

prefers-reduced-motion

---

# 8. NAVIGATION

Create a sticky/floating navigation.

Desktop:

Logo
Rankers Meet 2026
About
Highlights
Event Details
Venue

Right:

Register Now →

As user scrolls:

- navbar becomes slightly smaller
- background becomes translucent/solid
- subtle shadow appears
- active section indicator changes

Do not make the navbar excessively tall.

---

# 9. HERO SECTION

This is the most important visual section.

Hero should immediately communicate:

RANKERS MEET 2026

A celebration of achievement, hard work and academic excellence.

Suggested hierarchy:

Small eyebrow:

YASIR ALI CLASSES PRESENTS

Main heading:

RANKERS
MEET
2026

Use large typography.

Example visual treatment:

RANKERS
MEET

with:

2026

as a red/gold visual accent.

Supporting copy:

A celebration of students who turned effort into achievement.

Primary CTA:

Register Now →

Secondary CTA:

Explore Event ↓

---

# 10. HERO ANIMATION

Hero should be highly interactive.

Recommended:

1. Heading enters with staggered word reveal.
2. Background red curves/lines slowly move.
3. Achievement cards float subtly.
4. CTA has magnetic hover.
5. Mouse movement creates very subtle depth.
6. Event date card reacts to cursor.
7. Scroll indicator animates.
8. Red accent line follows mouse movement subtly.

Do NOT make the entire hero follow the mouse aggressively.

Maximum movement should be subtle.

---

# 11. HERO VISUAL CONCEPT

Create an editorial-style achievement composition.

Possible elements:

- Trophy
- Medal
- Certificate
- Rank badge
- Student achievement photos
- Event photography
- YAC logo
- Abstract red ribbons
- Number/stat cards

The visual should feel like:

**Academic excellence meets premium event design.**

Do not use generic stock-business imagery.

Prefer real YAC/student/event imagery when available.

---

# 12. INTERACTIVE ACHIEVEMENT CARDS

Create floating cards around the hero.

Examples:

"TOP RANKERS"

"EXCELLENCE"

"ACHIEVEMENT"

"YAC"

These cards should have:

- slight floating animation
- subtle rotation
- hover elevation
- soft shadow
- glass/solid hybrid treatment

Do not overuse glassmorphism.

---

# 13. EVENT COUNTDOWN

Add a premium countdown section.

Example:

THE EVENT BEGINS IN

12
DAYS

08
HOURS

32
MINUTES

15
SECONDS

Each number should be displayed in a large editorial card.

Animation:

When a number changes:

- old number slides/fades out
- new number slides/fades in

Do not use a distracting ticking animation.

---

# 14. EVENT DETAILS

Create a visually strong information section.

Cards:

DATE
TIME
VENUE

Example:

DATE
[Event Date]

TIME
[Event Time]

VENUE
[Event Venue]

Use configurable event data.

Do not hardcode these values across components.

Store them in one event configuration object.

---

# 15. INTERACTIVE EVENT TIMELINE

Create a horizontal desktop / vertical mobile timeline.

Example:

10:00 AM
Arrival & Registration

10:30 AM
Welcome Ceremony

11:00 AM
Rankers Recognition

12:00 PM
Special Session

01:00 PM
Celebration & Networking

Use scroll-triggered reveal.

Timeline line should animate as user scrolls.

---

# 16. "WHO CAN ATTEND" SECTION

Create interactive category cards.

Examples:

YAC Rankers

Top Performers

Students

Parents

Guests

Each card should react on hover/tap.

Desktop:

Cards can expand on hover.

Mobile:

Cards become tap-to-expand.

Use:

scale
translate
border
background
image reveal

Do not hide critical information only inside hover interactions.

---

# 17. WHY THIS EVENT MATTERS

Create an emotional editorial section.

Large statement:

"Success deserves to be celebrated."

Supporting content should explain:

- recognition
- motivation
- student achievement
- parent participation
- community
- academic excellence

Use large typography and image storytelling.

---

# 18. ACHIEVEMENT / RANKERS SECTION

Create a premium section showcasing academic excellence.

Possible layout:

Large rank number

01

02

03

Beside:

Student photo
Student name
Exam
Achievement

Use a vertical scroll interaction.

Potential animation:

As each rank enters the viewport:

- number scales from 0.8 → 1
- image reveals
- text slides in
- background accent shifts

Do not fabricate student names/ranks.

Use actual supplied data only.

If data is unavailable, use clearly marked placeholders.

---

# 19. STATISTICS SECTION

Create large animated counters.

Possible values:

80,000+
Students Mentored

20,000+
Selections

10+ / 16+
Years of Excellence

4.9★
Google Rating

IMPORTANT:

Use only verified/current YAC data supplied by the official website or project data.

Do not invent numbers.

Counters should animate only when entering viewport.

Animation:

0 → final number

Use smooth easing.

---

# 20. EVENT HIGHLIGHTS

Create an interactive image gallery.

Layout:

Asymmetric editorial grid.

Images should have:

- rounded corners
- subtle depth
- hover zoom
- overlay caption
- smooth image reveal

Desktop interaction:

Hover image → image expands slightly.

Mouse movement → subtle image parallax.

Mobile:

Tap image → open larger view/lightbox.

Use real YAC event/classroom/result imagery where available.

---

# 21. 3D / DEPTH ELEMENT

Optional premium layer.

Use lightweight 3D/depth only if it improves the experience.

Possible object:

- trophy
- medal
- event badge
- YAC emblem

Technology:

Three.js / React Three Fiber

BUT:

Do not make 3D the entire page.

Fallback to a normal image for:

- low-end devices
- reduced motion
- mobile performance constraints

The page must remain excellent without 3D.

---

# 22. MICRO-INTERACTIONS

Every important interactive element should have feedback.

Buttons:

Hover:
- slight upward movement
- subtle shadow
- arrow movement

Press:
- scale 0.97

Cards:

Hover:
- translateY(-4px)
- shadow changes
- image scale 1.03

Links:

Underline/line animation.

Inputs:

Focus:
- red border
- subtle glow
- label transition

Checkbox:

Animated checkmark.

---

# 23. MAGNETIC CTA

Primary:

REGISTER NOW →

Implement subtle magnetic behavior.

Only desktop pointer devices.

Movement should be approximately 4–8px.

Disable on touch devices.

Disable when:

prefers-reduced-motion: reduce

---

# 24. REGISTRATION CTA

The CTA must appear throughout the experience.

Use:

Register Now →

Locations:

Navbar
Hero
After Event Details
After Highlights
Before Footer

Do not spam the CTA.

Use contextual placement.

---

# 25. REGISTRATION FORM EXPERIENCE

When the user clicks Register Now:

Use either:

A premium modal/drawer

OR

Dedicated route:

/rankers-meet/register

Preferred:

Dedicated registration page with shared visual identity.

Transition:

Current page fades/slides into registration experience.

---

# 26. REGISTRATION FORM DESIGN

Do not make it look like a boring Google Form.

Create a premium application-style form.

Header:

RANKERS MEET 2026

"Reserve your place."

Form sections:

PERSONAL DETAILS

Student Name
Parent/Guardian Name
Mobile Number
Email

ACADEMIC DETAILS

Class/Course
Exam
Rank
School/College

GUEST DETAILS

Number of Guests

---

# 27. FORM INTERACTIONS

Inputs should feel premium.

Use floating labels or animated labels.

On focus:

- border transitions to YAC red
- label moves upward
- subtle glow

Validation should be immediate but not annoying.

Success:

Animated checkmark.

Submission:

Button changes to:

Registering...

Then:

Registration Confirmed ✓

---

# 28. REGISTRATION SUCCESS

Create a premium success screen.

Large:

YOU'RE REGISTERED

Then:

Registration ID

RM1024

QR Code

"Keep this ticket ready for event entry."

Actions:

Download Ticket

Send to Email

Back to Event

---

# 29. QR TICKET VISUAL

The ticket should visually match the landing page.

Design:

White ticket card

Red header

Student details

Registration ID

Large QR

Event details

YAC branding

Use subtle ticket-edge styling.

Avoid excessive decoration.

---

# 30. VENUE SECTION

Create an interactive venue section.

Left:

Event venue details.

Right:

Map / location visual.

Include:

Venue
Address
City

CTA:

Get Directions →

If Google Maps integration is used, open the map externally.

---

# 31. SCROLL EXPERIENCE

Use smooth but controlled scrolling.

Recommended:

Lenis

or native smooth scrolling if performance is better.

Use scroll-triggered animation with:

GSAP + ScrollTrigger

or Framer Motion.

Do not use multiple competing scroll libraries.

---

# 32. SECTION REVEAL SYSTEM

Create a reusable animation system.

Example:

<Reveal>
<section />
</Reveal>

Variants:

fadeUp
fadeIn
clipReveal
scaleIn
slideLeft
slideRight

Duration:

0.5–0.9s

Use stagger:

0.06–0.12s

Do not animate every child individually unless needed.

---

# 33. TEXT REVEALS

For major headings:

Use:

word reveal
line reveal
clip-path reveal

Avoid character-by-character animation for large amounts of text.

Character animation can look cheap if overused.

---

# 34. BACKGROUND MOTION

Use subtle animated YAC-inspired elements:

- red curves
- soft gradient blobs
- thin lines
- dots
- abstract ribbons

Movement:

slow

10–30 second loops

No distracting flashing.

---

# 35. CURSOR EXPERIENCE

Desktop only.

Create an optional custom cursor.

States:

Default:
small red dot

Hover interactive element:
expanded ring

Hover image:
"VIEW"

Hover CTA:
"OPEN"

Do not use a huge custom cursor.

Disable for:

mobile
touch
reduced motion

---

# 36. IMAGE HOVER EXPERIENCE

When hovering event images:

Image scales:

1 → 1.04

Overlay:

"VIEW MOMENT"

Cursor interaction:

subtle

Do not crop important faces.

---

# 37. PAGE TRANSITIONS

If using route transitions:

Use:

opacity
scale
clip-path

Keep duration:

300–600ms

Do not make navigation slow.

---

# 38. MOBILE EXPERIENCE

Mobile is NOT a compressed desktop.

Design a separate mobile composition.

Hero:

Large typography but controlled.

Floating cards:

reduce quantity.

Animations:

reduce intensity.

Navigation:

Logo
Menu

Sticky bottom CTA may be used:

Register Now →

This can significantly improve conversion on mobile.

---

# 39. TABLET EXPERIENCE

Optimize for:

768–1024px

Use:

2-column layouts

Touch-friendly controls

Larger scan/registration buttons.

---

# 40. ACCESSIBILITY

Must support:

prefers-reduced-motion

keyboard navigation

screen readers

visible focus states

semantic HTML

proper labels

ARIA where necessary

Do not rely only on color to communicate success/error.

Example:

VALID ✓

INVALID ✕

---

# 41. PERFORMANCE

This page is animation-heavy, therefore performance is critical.

Target:

60fps interactions

Avoid:

large unoptimized videos

huge images

unnecessary JavaScript

blocking fonts

heavy 3D on mobile

---

# 42. IMAGE OPTIMIZATION

Use:

WebP / AVIF

responsive images

lazy loading below fold

proper width/height

avoid layout shift

Hero images can use priority loading.

---

# 43. ANIMATION PERFORMANCE

Prefer:

transform
opacity

Avoid animating:

top
left
width
height

unless necessary.

Use:

will-change

only where appropriate.

Do not apply will-change globally.

---

# 44. COMPONENT ARCHITECTURE

Create reusable components.

Suggested:

components/
├── Navbar
├── Hero
├── FloatingAchievementCard
├── EventCountdown
├── EventDetails
├── Timeline
├── AudienceCards
├── AchievementSection
├── StatsCounter
├── Gallery
├── VenueSection
├── RegistrationCTA
├── Footer
├── Reveal
├── MagneticButton
├── AnimatedText
├── Cursor
└── PageTransition

---

# 45. DATA ARCHITECTURE

Create:

src/data/eventData.js

Example:

eventData = {
  name,
  year,
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

Do not scatter event information across JSX files.

---

# 46. TECH STACK

Use the existing project stack if already present.

Preferred:

React
Vite
Tailwind CSS
Framer Motion
GSAP
GSAP ScrollTrigger
Lenis
React Router

Optional:

Three.js
React Three Fiber
@react-three/drei

Use Three.js only where it genuinely improves the design.

---

# 47. IMPORTANT: DO NOT DESTROY EXISTING WEBSITE

This project is a landing-page experience.

Do NOT modify unrelated pages of the existing YAC website.

The new experience should live at:

/rankers-meet

Preserve:

- existing global website
- existing navigation where appropriate
- existing brand identity
- existing assets
- existing backend functionality
- existing routes

Avoid breaking production functionality.

---

# 48. DESIGN SYSTEM

Create reusable design tokens.

Tailwind theme should define:

colors
font families
radius
shadows
spacing
animation

Example:

rounded-event
shadow-event
text-yac-red

Do not hardcode repeated values throughout components.

---

# 49. VISUAL HIERARCHY

The page should have clear hierarchy:

LEVEL 1:
Rankers Meet 2026

LEVEL 2:
Event message / primary CTA

LEVEL 3:
Event information

LEVEL 4:
Supporting content

Do not make every heading huge.

Use whitespace aggressively.

---

# 50. ANIMATION TIMING

Preferred:

Micro interaction:
150–250ms

Button:
200–300ms

Card:
300–450ms

Section reveal:
500–800ms

Page transition:
300–600ms

Background:
8–30 seconds

Use:

ease-out

for most entrance animations.

---

# 51. HOVER BEHAVIOR

Do not create hover-only information that mobile users cannot access.

Every hover interaction must have an equivalent:

tap
focus
or always-visible fallback.

---

# 52. FORM CONVERSION

Registration should never feel like leaving the premium website.

Maintain:

same typography
same red palette
same motion language
same spacing
same logo

Registration experience should feel like:

"Chapter 2 of the same website."

---

# 53. FINAL CTA

Before footer:

Large centered section.

Headline:

"Your achievement deserves a moment."

Supporting text:

"Join us as we celebrate the students who turned effort into excellence."

CTA:

REGISTER FOR RANKERS MEET →

Add subtle animated red background.

---

# 54. FOOTER

Keep footer clean.

Include:

Yasir Ali Classes

Rankers Meet 2026

Event information

Quick links

Contact

Official website

Social links

Copyright

Do not make footer unnecessarily huge.

---

# 55. FINAL QUALITY BAR

Before considering the frontend complete, verify:

[ ] Looks premium on 1440px desktop
[ ] Looks premium on 1920px desktop
[ ] Looks excellent on 390px mobile
[ ] Looks excellent on 768px tablet
[ ] Hero animation is smooth
[ ] Scroll animations are smooth
[ ] No layout shifts
[ ] No horizontal overflow
[ ] CTA is always discoverable
[ ] Registration flow works
[ ] Form validation works
[ ] Reduced-motion mode works
[ ] Keyboard navigation works
[ ] Images are optimized
[ ] No console errors
[ ] No broken routes
[ ] No unnecessary dependencies
[ ] No duplicated components
[ ] No hardcoded sensitive data
[ ] Existing website routes remain unaffected

---

# 56. IMPLEMENTATION INSTRUCTION FOR THE IDE

Do NOT try to generate the entire website in one uncontrolled step.

Implement in this sequence:

PHASE 1
Analyze existing project and identify current stack.

PHASE 2
Create the design system and event data structure.

PHASE 3
Build responsive page structure without animation.

PHASE 4
Build hero and navigation.

PHASE 5
Add section layouts.

PHASE 6
Add registration CTA and registration route.

PHASE 7
Add micro-interactions.

PHASE 8
Add scroll animations.

PHASE 9
Add advanced interactions.

PHASE 10
Optimize mobile.

PHASE 11
Optimize performance.

PHASE 12
Run complete QA.

After every phase:

1. Run the project.
2. Check console.
3. Check responsive layouts.
4. Fix errors.
5. Verify previous functionality.
6. Only then continue.

---

# 57. CRITICAL CREATIVE DIRECTION

The final result should NOT look like:

- a WordPress template
- a generic coaching website
- a generic event registration page
- a dashboard
- a basic Tailwind template
- an AI-generated website full of gradients

It should feel like:

**A premium digital experience for an important academic celebration.**

Think:

editorial design
+
premium education branding
+
award ceremony
+
modern product design
+
subtle cinematic motion

The design should communicate:

ACHIEVEMENT
EXCELLENCE
PRIDE
CELEBRATION
TRUST

without becoming flashy or childish.

---

# 58. SUCCESS CRITERIA

The project is successful when:

A visitor can understand the event within 5 seconds.

A visitor can find Register Now immediately.

The page feels visually premium.

Animations improve comprehension rather than distract.

The landing page works perfectly on mobile.

Registration feels effortless.

The brand clearly feels like Yasir Ali Classes.

The experience feels custom-built rather than template-based.

The entire page maintains a consistent visual and motion language.

---

# FINAL INSTRUCTION

Build this experience with the mindset of a senior creative agency.

Do not simply add animations to a normal landing page.

Design the interaction system first.

Every section should have:

Purpose
Hierarchy
Interaction
Motion
Responsive behavior
Accessibility
Performance considerations

The final result must be polished enough to represent Yasir Ali Classes publicly for Rankers Meet 2026.
