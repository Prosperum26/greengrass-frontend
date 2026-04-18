# Design System Document: The Editorial Eco-System

## 1. Typography

We utilize a modern pairing for authority and functional readability.

*   **Display & Headlines:** Plus Jakarta Sans
    *   **Usage:** Used for big, editorial statements and section titles. Do not center-align; use left-aligned "ragged" layouts to maintain the editorial feel.
*   **Body & Labels:** Manrope
    *   **Usage:** The workhorse font for long-form environmental reports. Labels are used for metadata (dates, tags), always uppercase with +0.05em tracking for a "tagged" aesthetic.

## 2. Color Palette

The palette is rooted in Earth’s natural transitions, using deep forest greens and sun-bleached oranges to drive action. Avoid pure black (`#0000`); use the `On-Surface` color instead.

*   **Primary (Action):** `#234612`
*   **Primary Container:** `#3A5E27`
    *   *Usage:* High-importance states and core brand moments.
*   **Secondary (Growth):** `#57641E`
    *   *Usage:* Progress indicators and subtle interactions.
*   **Tertiary (Urgency):** `#F75A0D`
    *   *Usage:* Reserved exclusively for "Join Event" or critical CTAs.
*   **Surface/Background:** `#FFF8F5`
    *   *Usage:* A warm, paper-like off-white that prevents eye strain.
*   **On-Surface (Text):** `#211A14`
    *   *Usage:* Used instead of pure black for a softer, natural feel.

## 3. Surface Architecture & Elevation

### The "No-Line" Rule
Do not use 1px solid borders to section content. Boundaries must be defined solely through background color shifts rather than visual "noise" of strokes. 

### Surface Hierarchy & Nesting
Treat the UI as physical layers of fine recycled paper:
*   **Base Layer:** Surface (`#FFF8F5` - The desk)
*   **Content Sections:** Surface Container Low (The journal page)
*   **Interactive Cards:** Surface Container Highest (Post-it notes or highlighted clippings)

### Ambient Shadows
Where floating is required (e.g., a main Action Button), use soft ambient shadows instead of harsh drop shadows:
*   **Blur:** 32px to 48px
*   **Opacity:** 4% - 8%
*   **Color:** `#211A14` (On-surface tint)
