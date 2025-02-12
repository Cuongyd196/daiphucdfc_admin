export function isStyleLoaded(resourceUrl) {
  return !!document.querySelector(`link[href="${resourceUrl}"]`);
}

export function isScriptLoaded(resourceUrl) {
  return !!document.querySelector(`script[src="${resourceUrl}"]`);
}

export function loadStyleAsync(resourceUrl) {
  return new Promise((resolve, reject) => {
    if (!isStyleLoaded(resourceUrl)) {
      const head = document.getElementsByTagName("head")[0];
      const link = document.createElement("link");
      link.href = resourceUrl;
      link.rel = "stylesheet";
      link.onload = resolve;
      link.onerror = reject;
      head.appendChild(link);
    } else {
      resolve();
    }
  });
}

export function loadScriptAsync(resourceUrl) {
  return new Promise((resolve, reject) => {
    if (!isScriptLoaded(resourceUrl)) {
      const script = document.createElement("script");
      script.src = resourceUrl;
      script.async = true;
      script.charset = "utf-8";
      script.onload = resolve;
      script.onerror = reject;
      document.body.appendChild(script);
    } else {
      resolve();
    }
  });
}
