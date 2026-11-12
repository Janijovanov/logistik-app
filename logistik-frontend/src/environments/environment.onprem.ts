// On-premise (client LAN) build. The .NET backend serves BOTH the API and these
// built frontend files from the same origin (e.g. http://192.168.2.1:5000), so the
// API is reached via a relative path — no server IP is baked in and nothing needs
// rebuilding if the server's address changes.
// Build with:  ng build --configuration onprem
export const environment = {
  production: true,
  apiUrl: '/api'
};
