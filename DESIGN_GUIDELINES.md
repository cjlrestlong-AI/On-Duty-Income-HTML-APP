# On Duty Income Design Guidelines

## Core Principles
- Prioritize mobile readability before visual density.
- Use restrained financial-report styling: clear hierarchy, quiet gridlines, compact but legible data.
- Avoid decorative gradients, oversized empty space, and chart elements that look like presentation clip art.
- Do not place unrelated text inside the plotting area when it competes with the data.

## Typography
- Mobile chart labels should be large enough to read without zooming.
- Summary values belong in metric cards or a clean header, not crowded over the chart curve.
- Keep labels short; use precise tooltips for detailed values.

## Chart Layout
- Preserve a clear plot area, but avoid excessive top and bottom padding.
- Bars should be visibly readable on mobile: compact spacing, but not hairline-thin.
- Line charts and revenue bars should share one panel and one time axis when they describe the same data.
- Highlight only latest and highest values; keep other marks quiet.

## Interaction
- Hover/focus/tap details should reveal exact values without cluttering the default view.
- Motion should be subtle and limited to important points, with reduced-motion support preserved.

## Pre-Design Checklist
- Is the design readable on a 430px-wide mobile viewport?
- Are text, marks, and controls separated enough to avoid overlap?
- Does every visible graphic element explain data, not decorate it?
- Does the component still match the warm minimal luxury theme?
