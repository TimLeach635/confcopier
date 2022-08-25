const esbuild = require("esbuild");

// Express app
esbuild
  .build({
    entryPoints: ["src/app.ts"],
    bundle: true,
    outfile: "dist/app.js",
    sourcemap: true,
    platform: "node",
  })
  .catch((reason) => {
    console.error(reason);
    process.exit(1);
  });

// Client code
esbuild
  .build({
    entryPoints: [
      "src/browser/hydrateContentTree.tsx",
      "src/browser/hydrateConfluenceBrowser.tsx",
    ],
    bundle: true,
    outdir: "dist/static",
    minify: false,
    platform: "browser",
  })
  .catch((reason) => {
    console.error(reason);
    process.exit(1);
  });
