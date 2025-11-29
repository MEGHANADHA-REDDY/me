# About Me Section

A seamless "Chapter 2" continuation of the Retro Moon Hero, featuring a two-column layout with a floating profile orb and smooth entrance animations.

## Integration

### React
Import and use the `AboutSection` component:

```tsx
import AboutSection from './AboutSection';

function App() {
  return (
    <div className="relative w-full">
      {/* Hero Component */}
      <div style={{ height: '100vh' }}></div> {/* Spacer if hero is fixed */}
      <AboutSection />
    </div>
  );
}
```

### Configuration
Tuning values are located in `config-about.ts`. You can adjust:
- **Palette**: Colors for text, orb, and vignette.
- **Orb**: Enable/disable, size, bobbing amplitude/duration.
- **Animation**: Entrance timing and delays.
- **Responsiveness**: Mobile breakpoints and orb resizing.

## Global API
The section exposes a global API on `window.AboutSection`:

- `AboutSection.pause()`: Pause orb animations.
- `AboutSection.resume()`: Resume animations.
- `AboutSection.toggleSafeMode()`: Toggle "Safe Mode" (reduced motion).
- `AboutSection.setPalette({ moonSilver, neonOrchid, subLav })`: Update colors dynamically.
- `AboutSection.dispose()`: Cleanup and remove section.

## Accessibility
- **Reduced Motion**: Respects `prefers-reduced-motion`. Parallax and orb animations are disabled.
- **Screen Readers**: The orb has an `aria-label`, and the "Download Resume" link is accessible.
- **Keyboard**: Interactive elements are focusable.

## Performance
- **IntersectionObserver**: Animations only trigger when the section scrolls into view.
- **GPU Transforms**: All animations use `transform` and `opacity` for smooth performance.
