# Final Hero Overlay

A premium, cinematic hero overlay with animated UI elements (Orb, Hologram, Quote) and a soft radial vignette.

## Integration

### React
Import and use the `FinalHero` component:

```tsx
import FinalHero from './FinalHero';

function App() {
  return (
    <div className="relative w-full min-h-screen">
      {/* Background Component Here */}
      <FinalHero />
    </div>
  );
}
```

### Configuration
Tuning values are located in `config.ts`. You can adjust:
- **Colors**: `palette` object.
- **Placement**: `heroPlacement` (left, top, maxWidth).
- **Vignette**: `vignette` (size, blur, opacity).
- **Animations**: `timing` and `parallaxRanges`.
- **Right Elements**: Toggle `showOrb`, `showHologramLine`, `showQuote`.

## Global API
The overlay exposes a global API on `window.FinalHero`:

- `FinalHero.pause()`: Pause all animations.
- `FinalHero.resume()`: Resume animations.
- `FinalHero.toggleSafeMode()`: Toggle "Safe Mode" (static view, no animations).
- `FinalHero.dispose()`: Cleanup and remove overlay.

## Accessibility
- **Reduced Motion**: Respects `prefers-reduced-motion`. Animations are disabled, and the overlay renders in a static state.
- **Safe Mode**: Can be toggled via API to disable all expensive effects.
- **Screen Readers**: The vertical quote includes an accessible off-screen copy.

## Performance
- **DPR Clamping**: Limits device pixel ratio to 1.5 (configurable in `config.ts`).
- **Mobile Optimization**: Right-side elements are hidden on small screens (< 760px).
