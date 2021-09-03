export const recommendedBrowsers: string[] = [
    "Chrome",
    "Firefox"
  ]
  
  export function isRecommendedBrowser() {
    return recommendedBrowsers.some((browser) => navigator.userAgent.indexOf(browser) !== -1)
  }
  