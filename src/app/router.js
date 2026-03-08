function normalizeRoute(hashValue) {
  if (!hashValue || hashValue === "#") return "/";
  const route = hashValue.startsWith("#") ? hashValue.slice(1) : hashValue;
  return route || "/";
}

export function createRouter({ routes, screenRoot, notFound }) {
  function renderCurrentRoute() {
    const routePath = normalizeRoute(window.location.hash);
    const matchedRoute = routes[routePath] || notFound;
    const screen = matchedRoute();

    screenRoot.innerHTML = screen.html;
    screen.onMount?.(screenRoot);
  }

  function goTo(path) {
    const nextPath = path.startsWith("/") ? path : `/${path}`;
    if (window.location.hash === `#${nextPath}`) {
      renderCurrentRoute();
      return;
    }
    window.location.hash = nextPath;
  }

  window.addEventListener("hashchange", renderCurrentRoute);
  return {
    start() {
      if (!window.location.hash) {
        window.location.hash = "/";
      } else {
        renderCurrentRoute();
      }
    },
    goTo,
  };
}
