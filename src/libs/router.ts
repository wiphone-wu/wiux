export function go(
  url: string | Record<string, unknown> | undefined,
  router?: any,
): void {
  if (!url || (typeof url === "string" && /^javas/.test(url))) return;

  const useRouter =
    typeof url === "object" ||
    (router && typeof url === "string" && !/http/.test(url));

  if (useRouter && router) {
    if (typeof url === "object" && (url as any).replace === true) {
      router.replace(url);
    } else {
      url === "BACK" ? router.go(-1) : router.push(url);
    }
  } else if (typeof url === "string") {
    window.location.href = url;
  }
}

export function getUrl(
  url: string | Record<string, unknown> | undefined,
  router?: any,
): string {
  if (
    router &&
    !router._history &&
    typeof url === "string" &&
    !/http/.test(url)
  ) {
    return "#!" + url;
  }
  return url && typeof url !== "object" ? url : "javascript:void(0);";
}
