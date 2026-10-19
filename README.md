# KYRO — GitHub Starter

A responsive, mobile-first KYRO messaging **frontend preview** built with plain HTML, CSS and JavaScript. It is designed to be easy to upload to a GitHub repository and publish with GitHub Pages.

## Included
- Responsive dark KYRO interface
- Chat list and search
- Local demo conversations
- Send messages in the current browser
- Create local demo conversations
- LocalStorage persistence on the same device/browser
- PWA manifest and service worker
- GitHub Pages workflow

## Important limitations
This ZIP is a frontend starter, not a finished production messaging service. Messages are stored only in the current browser/device. It does **not** yet provide real accounts, real-time communication between different users, cloud synchronization, push notifications, or end-to-end encryption. Those require a backend and secure authorization rules.

This is a web app/PWA, not an Android APK. Publishing it on GitHub Pages creates a website. To make a native Android package, wrap/build it with a compatible Android toolchain after confirming the app requirements.

## Run locally
Open `index.html` in a modern browser. For service-worker/PWA behavior, use a local HTTP server or GitHub Pages.

## Publish on GitHub Pages
1. Create a new GitHub repository, for example `kyro-app`.
2. Upload all files and folders from this ZIP to the repository root.
3. Open **Settings → Pages**.
4. Choose **GitHub Actions** as the build/deployment source.
5. Push to the `main` branch; the included workflow deploys the site.
6. Open the Pages URL shown by GitHub.

If your default branch is not `main`, update `.github/workflows/pages.yml`.

## Next production steps
1. Add a real authentication provider.
2. Add a database and enforce server-side access rules.
3. Implement real-time conversations and membership checks.
4. Add secure media storage and push notifications.
5. Add tests and review security before public release.
