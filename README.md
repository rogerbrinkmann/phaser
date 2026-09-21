# Lunar Descent

A Phaser lunar lander game built with Vite.

## Deploy to Render

1. Push this repository to GitHub or GitLab.
2. In the [Render dashboard](https://dashboard.render.com/), choose **New** and then **Blueprint**.
3. Connect the repository and select the branch containing `render.yaml`.
4. Review the `lunar-descent` static site and click **Apply**.

Render will use:

- Build command: `npm ci && npm run build`
- Publish directory: `dist`

No start command is needed because the game is a static Vite build.

## Run locally

```bash
npm install
npm run dev
```
