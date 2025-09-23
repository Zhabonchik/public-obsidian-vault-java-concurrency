---
title: Carousel
---

The Carousel plugin transforms custom `<Carousel>` tags in your Markdown into interactive image galleries with navigation controls, dot indicators, and modal viewing capabilities.

## Syntax

```markdown
<Carousel>
<img src="image1.jpg" alt="First image">
<img src="image2.jpg" alt="Second image">
<img src="image3.jpg" alt="Third image">
</Carousel>
```

## Configuration

```typescript
const config: QuartzConfig = {
  configuration: {
    // ...
  },
  plugins: {
    transformers: [
      // ...
      Plugin.Carousel({
        showDots: true, // Show dot indicators (default: true)
      }),
    ],
    filters: [
      // ...
    ],
    emitters: [
      // ...
    ],
  },
}
```

## Features

The carousel automatically handles multiple images and provides intuitive navigation controls for users to browse through your image collections.

- Navigation: Click arrows or use keyboard (←/→ keys)
- Touch Support: Swipe gestures on mobile devices
- Modal View: Click images for full-screen viewing
- Responsive: Adapts to different screen sizes
- Accessibility: ARIA labels and keyboard navigation
- Theme Support: Works with light/dark modes
