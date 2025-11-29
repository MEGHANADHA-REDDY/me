# About Large Section (Cinematic Redesign V2 + Enhancements)

A premium, cinematic "Chapter 2" continuation of the Retro Moon Hero, featuring a massive title block, floating orbs, and a rich cosmic backdrop with nebula fog and micro particles.

## Integration

### React
Import and use the `AboutLarge` component:

```tsx
import AboutLarge from './AboutLarge';

function App() {
  return (
    <div className="relative w-full">
      {/* Hero Component */}
      <div style={{ height: '100vh' }}></div> {/* Spacer if hero is fixed */}
      <AboutLarge />
    </div>
  );
}
```

### Configuration
Tuning values are located in `config-about-large.ts`. You can adjust:
- **Placement**: Title block height, gutters, column widths.
- **Palette**: Colors for text, orb, background, and vignette.
- **Particles**: Count, opacity, speed.
- **Orbs**: Enable/disable, size, bobbing amplitude/duration.
- **Animation**: Entrance timing and delays.
- **Responsive**: Mobile breakpoints.

## Global API
The section exposes a global API on `window.AboutLarge`:

- `AboutLarge.toggleSafeMode()`: Toggle "Safe Mode" (reduced motion).
- `AboutLarge.setPalette({ moonSilver, neonOrchid, subLav })`: Update colors dynamically.
- `AboutLarge.dispose()`: Cleanup and remove section.

## Accessibility
- **Reduced Motion**: Respects `prefers-reduced-motion`. Animations are disabled.
- **Screen Readers**: Text is semantic and accessible.
- **Keyboard**: Interactive elements are focusable.

## Performance
- **IntersectionObserver**: Animations only trigger when the section scrolls into view.
- **GPU Transforms**: All animations use `transform` and `opacity` for smooth performance.
