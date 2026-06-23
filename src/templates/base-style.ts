export const baseStyle = String.raw`
:root {
  color-scheme: light;
  --bg: #faf9f6;
  --ink: #1a1a1a;
  --muted: #6f6a61;
  --line: rgba(26, 26, 26, 0.14);
  --accent: #ff6b00;
  --accent-soft: rgba(255, 107, 0, 0.14);
}

* {
  box-sizing: border-box;
}

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
}

body {
  display: grid;
  place-items: center;
  overflow: hidden;
  background: #111;
  color: var(--ink);
  font-family: Inter, -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif;
}

.stage {
  position: relative;
  width: 100vw;
  height: calc(100vw * 2 / 3);
  max-width: calc(100vh * 3 / 2);
  max-height: 100vh;
  aspect-ratio: 3 / 2;
  overflow: hidden;
  background: var(--bg);
}

.page {
  position: absolute;
  inset: 0;
  display: grid;
  grid-template-rows: minmax(0, 1fr);
  padding: 9% 10% 12%;
  opacity: 0;
  pointer-events: none;
  transform: translateY(18px);
  transition:
    opacity 420ms ease,
    transform 420ms ease;
}

.page.active {
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.page-inner {
  min-width: 0;
  min-height: 0;
  display: grid;
  align-content: center;
  gap: 42px;
}

.headline {
  max-width: 86%;
  margin: 0;
  font-size: clamp(64px, 5.8vw, 176px);
  line-height: 0.98;
  letter-spacing: 0;
  font-weight: 850;
}

.subtitle {
  max-width: 72%;
  margin: 0;
  color: var(--muted);
  font-size: clamp(30px, 2.3vw, 72px);
  line-height: 1.18;
  letter-spacing: 0;
  font-weight: 650;
}

.compare-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
  max-width: 86%;
}

.compare-card {
  min-height: 280px;
  border: 3px solid var(--line);
  border-radius: 8px;
  padding: 44px;
  display: grid;
  align-content: center;
  gap: 18px;
  background: rgba(255, 255, 255, 0.44);
}

.compare-card strong {
  color: var(--accent);
  font-size: clamp(52px, 4.6vw, 132px);
  line-height: 1;
  letter-spacing: 0;
}

.compare-card span {
  color: var(--muted);
  font-size: clamp(26px, 2vw, 58px);
  line-height: 1.18;
}

.number-scale {
  max-width: 86%;
  padding: 48px 54px;
  border-left: 14px solid var(--accent);
  background: var(--accent-soft);
}

.threshold {
  width: min(86%, 2400px);
  display: grid;
  gap: 30px;
}

.threshold-track {
  position: relative;
  height: 30px;
  border-radius: 999px;
  background: var(--line);
}

.threshold-fill {
  width: 74%;
  height: 100%;
  border-radius: inherit;
  background: var(--accent);
}

.quote {
  max-width: 86%;
  display: grid;
  gap: 32px;
}

.progress {
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: 10px;
  background: rgba(26, 26, 26, 0.08);
}

.progress-bar {
  width: 0;
  height: 100%;
  background: var(--accent);
  transition: width 260ms ease;
}
`;
