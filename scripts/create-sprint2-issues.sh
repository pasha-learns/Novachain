#!/usr/bin/env bash
set -euo pipefail

REPO="pasha-learns/Novachain"

create_issue() {
  local title="$1"
  local body="$2"
  gh issue create --repo "$REPO" --title "$title" --body "$body"
}

create_issue "Sprint 2: trade route with route params" \
  "Add lazy-loaded \`/trade/:symbol\` route. TradeComponent reads symbol from \`ActivatedRoute.paramMap\` via \`toSignal\` and displays it with \`computed()\`. Wire markets row click to navigate."

create_issue "Sprint 2: enable authGuard on dashboard" \
  "Uncomment \`canActivate: [authGuard]\` on the dashboard route. Fix register redirect from \`/settings\` to \`/dashboard\`."

create_issue "Sprint 2: ESLint setup" \
  "Add \`@angular-eslint\` with flat \`eslint.config.js\` and \`ng lint\` script in \`package.json\`."

create_issue "Sprint 2: GitHub Actions CI workflow" \
  "Add \`.github/workflows/ci.yml\` — run \`bun run lint\` and \`bun run build\` on push/PR to main."

create_issue "Sprint 2: GitHub Pages deployment" \
  "Add deploy workflow, \`--base-href=/Novachain/\`, SPA \`404.html\` fallback, and live demo link in README."

create_issue "Sprint 2: team diary entries" \
  "Each team member adds a Sprint 2 development note under \`development-notes/\` and merges to main."

echo "Created 6 Sprint 2 issues."
