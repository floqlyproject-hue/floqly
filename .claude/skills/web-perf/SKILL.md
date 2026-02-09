---
name: web-perf
description: Analyzes web performance using Chrome DevTools MCP. Measures Core Web Vitals (FCP, LCP, TBT, CLS, Speed Index), identifies render-blocking resources, network dependency chains, layout shifts, caching issues, and accessibility gaps. Use when asked to audit, profile, debug, or optimize page load performance, Lighthouse scores, or site speed.
---

# Web Performance Audit

Audit web page performance using Chrome DevTools MCP tools. This skill focuses on Core Web Vitals, network optimization, and high-level accessibility gaps.

## FIRST: Verify MCP Tools Available

Try calling `navigate_page` or `performance_start_trace`. If unavailable, the chrome-devtools MCP server isn't configured. Ask user to add:

```json
"chrome-devtools": {
  "type": "local",
  "command": ["npx", "-y", "chrome-devtools-mcp@latest"]
}
```

## Key Guidelines

- **Be assertive**: Verify claims by checking network requests, DOM, or codebase — then state findings definitively.
- **Verify before recommending**: Confirm something is unused before suggesting removal.
- **Quantify impact**: Use estimated savings from insights. Don't prioritize 0ms impact changes.
- **Skip non-issues**: If render-blocking resources have 0ms estimated impact, note but don't recommend action.
- **Be specific**: Say "compress hero.png (450KB) to WebP" not "optimize images".
- **Prioritize ruthlessly**: A site with 200ms LCP and 0 CLS is already excellent — say so.

## Quick Reference

| Task | Tool Call |
|------|-----------|
| Load page | `navigate_page(url: "...")` |
| Start trace | `performance_start_trace(autoStop: true, reload: true)` |
| Analyze insight | `performance_analyze_insight(insightSetId: "...", insightName: "...")` |
| List requests | `list_network_requests(resourceTypes: ["Script", "Stylesheet", ...])` |
| Request details | `get_network_request(reqid: <id>)` |
| A11y snapshot | `take_snapshot(verbose: true)` |

## Workflow

```
Audit Progress:
- [ ] Phase 1: Performance trace (navigate + record)
- [ ] Phase 2: Core Web Vitals analysis (includes CLS culprits)
- [ ] Phase 3: Network analysis
- [ ] Phase 4: Accessibility snapshot
- [ ] Phase 5: Codebase analysis (skip if third-party site)
```

### Phase 1: Performance Trace

1. Navigate: `navigate_page(url: "<target-url>")`
2. Trace: `performance_start_trace(autoStop: true, reload: true)`
3. Wait for completion, retrieve results.

### Phase 2: Core Web Vitals Analysis

Use `performance_analyze_insight`:

| Metric | Insight Name | What to Look For |
|--------|--------------|------------------|
| LCP | `LCPBreakdown` | TTFB, resource load, render delay |
| CLS | `CLSCulprits` | Images without dimensions, injected content, font swaps |
| Render Blocking | `RenderBlocking` | CSS/JS blocking first paint |
| Document Latency | `DocumentLatency` | Server response time |
| Network Dependencies | `NetworkRequestsDepGraph` | Request chains delaying critical resources |

**Thresholds (good / needs-improvement / poor):**
- TTFB: < 800ms / < 1.8s / > 1.8s
- FCP: < 1.8s / < 3s / > 3s
- LCP: < 2.5s / < 4s / > 4s
- INP: < 200ms / < 500ms / > 500ms
- TBT: < 200ms / < 600ms / > 600ms
- CLS: < 0.1 / < 0.25 / > 0.25
- Speed Index: < 3.4s / < 5.8s / > 5.8s

### Phase 3: Network Analysis

```
list_network_requests(resourceTypes: ["Script", "Stylesheet", "Document", "Font", "Image"])
```

**Look for:**
1. Render-blocking resources (JS/CSS in `<head>` without async/defer)
2. Network chains (resources discovered late)
3. Missing preloads (fonts, hero images)
4. Caching issues (missing Cache-Control, ETag)
5. Large payloads (uncompressed JS/CSS)
6. Unused preconnects

### Phase 4: Accessibility Snapshot

```
take_snapshot(verbose: true)
```

Flag: missing/duplicate ARIA IDs, poor contrast, focus traps, interactive elements without accessible names.

### Phase 5: Codebase Analysis

Skip if auditing third-party site.

**Detect Framework:** Look for next.config.js, vite.config.ts, webpack.config.js, etc.

**Check:**
- Tree-shaking configuration
- Barrel files and wholesale utility imports (lodash, moment)
- CSS-in-JS vs static CSS extraction
- PurgeCSS/Tailwind `content` config
- Polyfills and browserslist targeting
- Compression and minification (terser, esbuild, swc)
- Source maps in production

## Output Format

1. **Core Web Vitals Summary** — Table with metric, value, rating
2. **Top Issues** — Prioritized with estimated impact (high/medium/low)
3. **Recommendations** — Specific fixes with code snippets
4. **Codebase Findings** — Framework detected, optimization opportunities
