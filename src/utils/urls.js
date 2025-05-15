const backendURLs = {
  deployed: "https://hotel-api.minalindialysiscenter.com",
  local: "http://127.0.0.1:8000",
  network: "http://192.168.31.231", // Change this to the backend's network IP
};

export default function getBackend(target) {
  return backendURLs[target];
}
