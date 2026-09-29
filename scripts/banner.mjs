import { writeFileSync, mkdirSync } from 'node:fs'

// Edit these lines to change the banner, then run `node scripts/banner.mjs`.
const session = [
  { cmd: 'whoami', out: 'Jose Orlando, Software Engineer at Payabli' },
  { cmd: 'cat focus.txt', out: 'Embedded payments UI with React, TypeScript, .NET and PostgreSQL' },
  { cmd: 'uptime', out: '10+ years shipping software, 4+ of them in fintech' },
  { cmd: 'open joseorlando.dev', out: null },
]

const themes = {
  dark: { bg: '#0A0F14', border: '#1F2937', bar: '#111827', title: '#64748B', prompt: '#22D3EE', cmd: '#F1F5F9', out: '#94A3B8' },
  light: { bg: '#FFFFFF', border: '#E2E8F0', bar: '#F8FAFC', title: '#64748B', prompt: '#0891B2', cmd: '#0F172A', out: '#475569' },
}

const W = 880
const FONT = 17
// Approximate advance of common monospace fonts (Menlo, JetBrains Mono, DejaVu Sans Mono).
const CHAR = FONT * 0.602
const LINE = 30
const PAD_X = 28
const TOP = 76
const PROMPT = '~ $ '
const TYPE_MS = 45
const PAUSE_MS = 450

function esc(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

// The final frame is the default state; animations only delay it, so a viewer that
// does not animate (or prefers reduced motion) still sees the full text.
function build(t) {
  let y = TOP
  let time = 600
  const parts = []

  session.forEach(step => {
    const cmdX = PAD_X + PROMPT.length * CHAR
    const chars = step.cmd.length
    const typeDur = chars * TYPE_MS

    parts.push(
      `<text class="show" style="animation-delay:${time - 150}ms" x="${PAD_X}" y="${y}" fill="${t.prompt}">${esc(PROMPT)}</text>`,
      `<text class="type" style="animation-delay:${time}ms;animation-duration:${typeDur}ms;animation-timing-function:steps(${chars})" x="${cmdX}" y="${y}" fill="${t.cmd}">${esc(step.cmd)}</text>`
    )

    time += typeDur + PAUSE_MS
    y += LINE

    if (step.out) {
      parts.push(`<text class="show" style="animation-delay:${time}ms" x="${PAD_X}" y="${y}" fill="${t.out}">${esc(step.out)}</text>`)
      time += PAUSE_MS
      y += LINE + 8
    } else {
      const cursorX = cmdX + chars * CHAR + 4
      parts.push(
        `<g class="show" style="animation-delay:${time}ms"><rect class="blink" x="${cursorX}" y="${y - LINE - FONT + 3}" width="${CHAR}" height="${FONT + 3}" fill="${t.prompt}"/></g>`
      )
    }
  })

  const H = y + 12
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" role="img" aria-label="Terminal: Jose Orlando, Software Engineer at Payabli">
<style>
  .show { animation: show 1ms linear both; }
  .type { animation-name: type; animation-fill-mode: both; }
  .blink { animation: blink 1.1s step-end infinite; }
  @keyframes show { from { opacity: 0; } to { opacity: 1; } }
  @keyframes type { from { clip-path: inset(0 100% 0 0); } to { clip-path: inset(0 0 0 0); } }
  @keyframes blink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .show, .type, .blink { animation: none; } }
</style>
<rect x="0.5" y="0.5" width="${W - 1}" height="${H - 1}" rx="12" fill="${t.bg}" stroke="${t.border}"/>
<path d="M0.5 12.5a12 12 0 0 1 12-12h${W - 25}a12 12 0 0 1 12 12v27.5h-${W - 1}z" fill="${t.bar}" stroke="${t.border}"/>
<text x="${W / 2}" y="26" text-anchor="middle" fill="${t.title}" font-family="ui-monospace, SFMono-Regular, Menlo, Consolas, monospace" font-size="13">jose@joseorlando.dev: ~</text>
<g font-family="'JetBrains Mono', ui-monospace, SFMono-Regular, Menlo, Consolas, 'DejaVu Sans Mono', monospace" font-size="${FONT}" xml:space="preserve">
${parts.join('\n')}
</g>
</svg>
`
}

mkdirSync('assets', { recursive: true })
for (const [name, t] of Object.entries(themes)) {
  writeFileSync(`assets/banner-${name}.svg`, build(t))
}
console.log('Wrote assets/banner-dark.svg and assets/banner-light.svg')
