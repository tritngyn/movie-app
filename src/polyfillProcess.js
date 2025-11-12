// src/polyfillProcess.js
window.process = {
  env: {
    NODE_ENV: import.meta.env.MODE,
    ...import.meta.env,
  },
};
