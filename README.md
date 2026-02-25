# Clio AI Statutes — Colorado Pilot Workflow

Automated codification tool that uses AI to apply Colorado session law changes to existing statute text. Built with Next.js, React, TypeScript, and Tailwind CSS.

## Prerequisites

- **Node.js** ≥ 20 (the repo pins `22.14.0` via `.node-version`)
- **npm** (comes with Node)
- [nodenv](https://github.com/nodenv/nodenv) is recommended for managing Node versions

## Getting Started

```bash
# 1. Clone the repo
git clone https://github.com/william-ju99/clio-hackathon-ai-statute.git
cd clio-hackathon-ai-statute

# 2. Install the correct Node version (if using nodenv)
nodenv install 22.14.0   # skip if already installed
nodenv local 22.14.0

# 3. Install dependencies
npm install

# 4. Start the dev server
npm run dev
```

The app will be running at **http://localhost:3000**.

## Available Scripts

| Command         | Description                              |
| --------------- | ---------------------------------------- |
| `npm run dev`   | Start the development server             |
| `npm run build` | Create an optimized production build     |
| `npm run start` | Serve the production build locally       |
| `npm run lint`  | Run ESLint across the project            |

## Project Structure

```
src/
├── app/                        # Next.js App Router pages
│   ├── layout.tsx              # Root layout (font, metadata)
│   ├── page.tsx                # Homepage
│   ├── globals.css             # Tailwind + CSS variables
│   ├── bills/page.tsx          # Bill selection (Step 2)
│   └── review/page.tsx         # Diff review dashboard (Step 2)
├── components/
│   ├── home/
│   │   ├── hero-section.tsx    # Hero banner with CTAs
│   │   ├── workflow-steps.tsx  # 4-step pilot workflow cards
│   │   └── pilot-status.tsx    # Phase A/B/C status tracker
│   └── layout/
│       └── header.tsx          # Navigation header
├── lib/
│   ├── utils.ts                # cn() utility (Tailwind merge)
│   └── design-system.tsx       # Clio Design System wrappers
└── types/
    └── design-system.d.ts      # Type stubs for DS components
```

## Clio Design System Integration

This project is set up to consume web components from the [Clio Design System](https://github.com/clio/design-system) (`@clio/design-system-web-components`). The integration uses lazy-loaded React wrappers with graceful fallbacks.

### Connecting the Design System (optional)

If you have access to the design-system repo and a JFrog Artifactory token:

1. Clone the design-system repo as a sibling directory:
   ```
   your-workspace/
   ├── clio-hackathon-ai-statute/   ← this repo
   └── design-system/               ← design-system repo
   ```

2. Set the Artifactory token in your shell:
   ```bash
   export ARTIFACTORY_NPM_TOKEN="<your-token>"
   ```

3. Add the dependency to `package.json`:
   ```json
   "@clio/design-system-web-components": "file:../design-system/packages/design-system"
   ```

4. Re-install:
   ```bash
   npm install
   ```

Without the design-system linked, components from `@/lib/design-system` will render as placeholder badges — the app works fine either way.

## Deployment

The project is configured for [Vercel](https://vercel.com). Push to `main` and Vercel will automatically build and deploy (once connected).

To deploy manually:

```bash
npm install -g vercel
vercel
```

## Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: TypeScript
- **Styling**: [Tailwind CSS 3](https://tailwindcss.com/) + [shadcn/ui](https://ui.shadcn.com/) CSS variable pattern
- **Icons**: [Lucide React](https://lucide.dev/)
- **Design System**: [Clio Design System](https://github.com/clio/design-system) (Lit web components with React wrappers)
- **Deployment**: [Vercel](https://vercel.com)
