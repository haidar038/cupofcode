module.exports = {
  apps: [
    {
      name: 'cupofcode',
      script: './dist/server/entry.mjs',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
        HOST: '0.0.0.0',
        // Mirrors package.json version so `pm2 describe`/logs surface the
        // running release. Update together on every release tag.
        VERSION: '1.1.2',
      },
    },
  ],
};
