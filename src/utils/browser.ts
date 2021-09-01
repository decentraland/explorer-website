export const recommendedBrowsers: string[] = [
    "Chrome",
    "Firefox"
  ]
  
  export function isRecommendedBrowser() {
    for (let i = 0; i < recommendedBrowsers.length; i++) {
      if (navigator.userAgent.indexOf(recommendedBrowsers[i]) !== -1) {
        return true
      }
    }
  
    return false
  }
  