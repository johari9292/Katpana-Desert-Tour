# Performance and Core Web Vitals budget

Measure the deployed site on mobile at the 75th percentile. The release targets are:

| Metric | Release target | Investigation threshold |
| --- | ---: | ---: |
| Largest Contentful Paint | at or below 2.2 seconds | above 2.5 seconds |
| Interaction to Next Paint | at or below 160 milliseconds | above 200 milliseconds |
| Cumulative Layout Shift | at or below 0.05 | above 0.10 |

The stricter release targets leave room for slower devices and networks before the site crosses the standard “good” thresholds.

## Asset budgets

- Mobile hero candidate: 100 KB or less.
- Desktop hero candidate: 250 KB or less.
- Any committed responsive JPEG: 800 KB or less.
- Exported HTML per route: 300 KB or less.
- Below-the-fold video: `preload="none"` and no autoplay.
- Images: explicit intrinsic dimensions or `fill` inside a stable-size container.

The static export checker enforces the file-size budgets it can verify in CI. JavaScript, CSS and route-level transfer budgets should also be recorded from Lighthouse after deployment because compression and host headers affect transfer size.

## Field measurement

`WebVitalsReporter` emits a `web_vital` event to an existing `dataLayer`/`gtag` integration and a `katpana:conversion` browser event. No analytics vendor is installed by default. When a provider is enabled, update consent and privacy disclosures before collecting visitor identifiers.

Review Search Console Core Web Vitals and CrUX monthly and after major image, font, navigation or form changes. Lab results diagnose regressions; field data determines the real user outcome.
