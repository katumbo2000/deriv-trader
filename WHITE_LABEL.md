# White-Labeling Guide

This guide walks you through forking this repo and replacing the Deriv brand with your own — with **no source code changes required**.

---

## Quick Start (5 steps)

### 1. Fork and clone

```sh
git clone https://github.com/YOUR_ORG/dtrader-template.git
cd dtrader-template
npm run bootstrap
```

### 2. Edit `brand.config.json`

This is the **only config file you need to touch**. Update these fields:

```json
{
  "brand_name": "Your Company",
  "brand_logo": "brand/brand-logo.svg",
  "brand_logo_dark": "brand/brand-logo-dark.svg",
  "brand_domains": ["yourdomain.com"],
  "brand_hostname": {
    "staging": "staging-home.yourdomain.com/dashboard",
    "production": "home.yourdomain.com/dashboard"
  },
  "platform": {
    "name": "Your Platform Name",
    "description": "Your platform description for SEO and meta tags.",
    "logo": "brand/platform-logo.svg",
    "hostname": {
      "staging": "staging-trader.yourdomain.com",
      "beta": "beta-trader.yourdomain.com",
      "production": "trader.yourdomain.com"
    },
    "help_centre_url": "https://yourdomain.com/help"
  },
  "auth": {
    "staging": "https://staging-auth.deriv.com",
    "production": "https://auth.deriv.com"
  },
  "api_core": {
    "staging": "staging-api-core.deriv.com",
    "production": "api-core.deriv.com"
  },
  "api": {
    "staging": "staging-api.deriv.com",
    "production": "api.deriv.com"
  },
  "app_id": {
    "staging": YOUR_STAGING_APP_ID,
    "production": YOUR_PRODUCTION_APP_ID
  },
  "colors": {
    "primary": "#your-primary-color",
    "secondary": "#your-secondary-color",
    ...
  }
}
```

> **Note:** `auth`, `api_core`, and `api` endpoints connect to the Deriv trading API. Leave these as-is unless you are running your own backend infrastructure.

### 3. Replace logo files in `assets/brand/`

Drop your SVG logo files into the `assets/brand/` directory:

| File                  | Purpose                   |
| --------------------- | ------------------------- |
| `brand-logo.svg`      | Header logo — light theme |
| `brand-logo-dark.svg` | Header logo — dark theme  |
| `platform-logo.svg`   | Platform icon (square)    |

See [Logo Requirements](#logo-requirements) below.

### 4. Regenerate color tokens

```sh
npm run generate:colors
```

This reads your colors from `brand.config.json` and regenerates all SCSS token files automatically.

### 5. Validate, build, and verify

```sh
# Validate your config
npm run verify:whitelabel

# Build everything
npm run build:all

# Start the dev server
npm run serve core
# → https://localhost:8443
```

---

## brand.config.json Reference

| Field                               | Type       | Required | Description                                                                        |
| ----------------------------------- | ---------- | -------- | ---------------------------------------------------------------------------------- |
| `brand_name`                        | string     | ✅       | Your company/brand name. Appears in page title, meta tags, manifest.               |
| `brand_logo`                        | string     | ✅       | Path to light-theme SVG logo (relative to site root, e.g. `brand/brand-logo.svg`). |
| `brand_logo_dark`                   | string     | ✅       | Path to dark-theme SVG logo. Falls back to `brand_logo` if omitted.                |
| `brand_domains`                     | string[]   | ✅       | Your production domain(s). Used for environment detection and security checks.     |
| `brand_hostname.staging`            | string     | ✅       | Staging dashboard hostname (e.g. `staging-home.yourdomain.com/dashboard`).         |
| `brand_hostname.production`         | string     | ✅       | Production dashboard hostname.                                                     |
| `platform.name`                     | string     | ✅       | Platform display name (e.g. `"Derivatives Trader"`).                               |
| `platform.description`              | string     | ✅       | Short description used in `<meta name="description">` and OG tags.                 |
| `platform.logo`                     | string     | ✅       | Path to platform icon SVG (square, used in platform config).                       |
| `platform.hostname.staging`         | string     | ✅       | Staging trader URL (e.g. `staging-trader.yourdomain.com`).                         |
| `platform.hostname.production`      | string     | ✅       | Production trader URL. Used as canonical URL.                                      |
| `platform.help_centre_url`          | string     | ✅       | URL for your help/support page.                                                    |
| `auth.staging`                      | string     | ✅       | Auth service base URL for staging.                                                 |
| `auth.production`                   | string     | ✅       | Auth service base URL for production.                                              |
| `api_core.staging`                  | string     | ✅       | API core hostname for staging WebSocket connections.                               |
| `api_core.production`               | string     | ✅       | API core hostname for production WebSocket connections.                            |
| `api.staging`                       | string     | ✅       | REST API hostname for staging.                                                     |
| `api.production`                    | string     | ✅       | REST API hostname for production.                                                  |
| `app_id.staging`                    | number     | ✅       | Your Deriv API app ID for staging.                                                 |
| `app_id.production`                 | number     | ✅       | Your Deriv API app ID for production.                                              |
| `colors.primary`                    | hex string | ✅       | Main brand color — buttons, links, highlights.                                     |
| `colors.secondary`                  | hex string | ✅       | Secondary accent color.                                                            |
| `colors.tertiary`                   | hex string | ✅       | Tertiary accent color.                                                             |
| `colors.success`                    | hex string | ✅       | Success/buy state color.                                                           |
| `colors.danger`                     | hex string | ✅       | Danger/sell/error state color.                                                     |
| `colors.warning`                    | hex string | ✅       | Warning state color.                                                               |
| `colors.info`                       | hex string | ✅       | Info state color.                                                                  |
| `colors.neutral`                    | hex string | ✅       | Neutral/muted color.                                                               |
| `colors.black`                      | hex string | ✅       | Darkest text/background color.                                                     |
| `colors.white`                      | hex string | ✅       | Lightest text/background color.                                                    |
| `color_variants.auto_generate`      | boolean    | —        | Auto-generate light/dark color variants. Default: `true`.                          |
| `color_variants.lighten_percentage` | number     | —        | How much to lighten generated variants. Default: `10`.                             |
| `color_variants.darken_percentage`  | number     | —        | How much to darken generated variants. Default: `10`.                              |

---

## Logo Requirements

| File                  | Dimensions           | Format | Notes                                                   |
| --------------------- | -------------------- | ------ | ------------------------------------------------------- |
| `brand-logo.svg`      | 200×48px recommended | SVG    | Transparent background, optimized for light backgrounds |
| `brand-logo-dark.svg` | 200×48px recommended | SVG    | Transparent background, optimized for dark backgrounds  |
| `platform-logo.svg`   | 64×64px recommended  | SVG    | Square icon                                             |

**Favicons** are not automatically replaced. To update them, replace the PNG files in:

```
packages/core/src/public/images/favicons/
```

Required sizes: 16, 32, 96, 160, 192px (for favicon) and 57, 60, 72, 76, 114, 120, 144, 152, 180px (for apple-touch-icon).

---

## Getting a Deriv Developers App ID

The platform connects to the Deriv trading API via WebSocket. To avoid sharing the default `app_id`:

1. Go to [https://developers.deriv.com](https://developers.deriv.com) and log in
2. Click **Register new application**
3. Set the **OAuth Redirect URL** to your platform hostname (e.g. `https://trader.yourdomain.com`)
4. Copy the generated `App ID`
5. Set it in `brand.config.json` under `app_id.staging` and `app_id.production`

---

## Color Customization

The color pipeline works as follows:

1. You set hex values in `brand.config.json` → `colors`
2. Running `npm run generate:colors` reads those values and auto-generates:
    - `packages/shared/src/styles/constants/colors.scss` — SCSS variables (`$color-primary`, etc.)
    - `packages/shared/src/styles/tokens/brand.scss` — CSS custom properties (`--brand-primary`, etc.)
    - `packages/shared/src/styles/tokens/semantic.scss` — Semantic tokens for light/dark themes
    - `packages/shared/src/styles/tokens/components.scss` — Component-level tokens

**Never edit generated files directly** — your changes will be overwritten on the next `generate:colors` run.

The `color_variants.auto_generate: true` option creates lighter and darker variants of each color automatically (controlled by `lighten_percentage` and `darken_percentage`).

---

## External Dependencies

This platform uses several `@deriv-com/*` packages that are open source. Forkers inherit these:

| Package                           | Purpose                                               |
| --------------------------------- | ----------------------------------------------------- |
| `@deriv-com/translations`         | i18n translation provider and locale loading          |
| `@deriv-com/quill-ui`             | Design system: Quill UI components and theme provider |
| `@deriv-com/smartcharts-champion` | Trading chart library (candlestick, line, etc.)       |

These packages provide the core UI and charting infrastructure. Replacing them would require source code changes beyond the scope of this white-labeling guide.

---

## Logo Rendering

The platform renders your brand logo in two places, both driven by `brand.config.json`:

| Location                                | File                                                                 | Behaviour                                                                                          |
| --------------------------------------- | -------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Sidebar header                          | `packages/trader/src/AppV2/Components/Layout/Sidebar/sidebar.tsx`    | `<img>` — switches between `brand_logo` (light) and `brand_logo_dark` (dark) based on active theme |
| Core package (available for header use) | `packages/core/src/App/Components/Elements/BrandLogo/brand-logo.tsx` | `BrandLogo` observer component — same light/dark switching logic                                   |

**Using the BrandLogo component in core:**

```tsx
import BrandLogo from 'App/Components/Elements/BrandLogo';

// In a header component:
<BrandLogo width={200} height={48} className='header__logo' />;
```

---

## Verification Checklist

Run the automated check first:

```sh
npm run verify:whitelabel
```

Then verify in the browser at `https://localhost:8443`:

- [ ] Page `<title>` shows your platform name and brand name
- [ ] Header logo renders correctly (light theme)
- [ ] Header logo renders correctly (dark theme — toggle via Settings)
- [ ] Brand colors match your `colors.primary` in buttons and links
- [ ] DevTools → Network → filter "WS" → WebSocket URL contains your `app_id`
- [ ] `https://localhost:8443/manifest.json` → `name` field shows your `brand_name`
- [ ] View page source → `<meta name="author">` shows your brand name
- [ ] View page source → `<meta name="description">` shows your platform description

---

## Troubleshooting

**Logo not showing after build**

- Confirm SVG files exist in `assets/brand/`
- Run `npm run build:all` to trigger the webpack CopyPlugin
- Check `packages/core/dist/brand/` — your SVG files should appear there

**Colors not updating**

- Run `npm run generate:colors` after editing `brand.config.json`
- Then rebuild: `npm run build:all`

**WebSocket connection errors (401/403)**

- Verify your `app_id` is registered at [https://api.deriv.com](https://api.deriv.com)
- Confirm the OAuth redirect URL in your app registration matches your hostname
- Check `brand.config.json` → `app_id.staging` matches what you registered

**`npm run verify:whitelabel` fails**

- Read the error messages — each one points to a specific field in `brand.config.json`
- Ensure all logo `.svg` files exist in `assets/brand/`

**Build errors after editing brand.config.json**

- Validate JSON syntax (no trailing commas, all strings quoted)
- Run `node -e "require('./brand.config.json')"` to check for JSON parse errors
- Run `npm run bootstrap` if packages are out of sync

---

## What You Cannot Change Without Source Code Edits

| Limitation                                      | Reason                                                                 |
| ----------------------------------------------- | ---------------------------------------------------------------------- |
| `@deriv/quill-icons` icon set                   | Icons are referenced by component name from this library               |
| `@deriv-com/smartcharts-champion` chart library | Tightly coupled to the SmartChart module                               |
| `@deriv-com/translations` translation provider  | Core i18n infrastructure                                               |
| Deriv options trading API protocol              | The WebSocket v3 protocol and contract types are Deriv-specific        |
| Internal package names (`@deriv/*`)             | Monorepo workspace names — changing them requires updating all imports |
