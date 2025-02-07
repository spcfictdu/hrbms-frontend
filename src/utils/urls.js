const backendURLs = {
  deployed: "https://hotel-api.minalindialysiscenter.com/api",
  local: "http://127.0.0.1:8000/api",
  network: "http://192.168.31.231/api", // Change this to the backend's network IP
};

export default function getBackend(target) {
  return backendURLs[target];
}
