"use client";

import { useEffect } from "react";

/**
 * When the page is restored from the browser's back-forward cache (e.g. user
 * hits the back button after the Shopify checkout redirect), React event
 * handlers can end up detached from the restored DOM and buttons stop
 * responding. The only reliable fix in App Router is a full page reload —
 * router.refresh() does not re-hydrate event listeners in this scenario.
 *
 * We listen for `pageshow` with `event.persisted === true` (the signal that
 * the page came from bfcache) and force a reload.
 */
export function useBfcacheRefresh() {
  useEffect(() => {
    const onPageShow = (e: PageTransitionEvent) => {
      if (e.persisted) {
        window.location.reload();
      }
    };
    window.addEventListener("pageshow", onPageShow);
    return () => window.removeEventListener("pageshow", onPageShow);
  }, []);
}
