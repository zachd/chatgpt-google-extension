export interface SearchEngine {
  inputQuery: string[]
  sidebarContainerQuery: string[]
  appendContainerQuery: string[]
  watchRouteChange?: (callback: () => void) => void
}

export const config: Record<string, SearchEngine> = {
  google: {
    inputQuery: ['.adn.ads'],
    sidebarContainerQuery: ['.aoI'],
    appendContainerQuery: ['.aDu'],
    watchRouteChange(callback) {
      const targetNode = document.getElementsByTagName('body')[0]!
      const observer = new MutationObserver(function (records) {
        for (const record of records) {
          if (record.type === 'childList') {
            for (const node of record.addedNodes) {
              console.log(node)
              if (node.classList[0] === 'aDu') {
                console.log('FOUND NODE')
                callback()
                return
              }
            }
          }
        }
      })
      observer.observe(targetNode, { childList: true })
    },
  },
}
