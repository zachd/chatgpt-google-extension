import { render } from 'preact'
import '../base.css'
import { getUserConfig, Language, Theme } from '../config'
import { detectSystemColorScheme } from '../utils'
import ChatGPTContainer from './ChatGPTContainer'
import { config, SearchEngine } from './search-engine-configs'
import './styles.scss'
import { getPossibleElementByQuerySelector } from './utils'

async function mount(question: string, siteConfig: SearchEngine) {
  console.log('mounting')
  const container = document.createElement('div')
  container.className = 'chat-gpt-container'

  const userConfig = await getUserConfig()
  let theme: Theme
  if (userConfig.theme === Theme.Auto) {
    theme = detectSystemColorScheme()
  } else {
    theme = userConfig.theme
  }
  if (theme === Theme.Dark) {
    container.classList.add('gpt-dark')
  } else {
    container.classList.add('gpt-light')
  }

  const siderbarContainer = getPossibleElementByQuerySelector(siteConfig.sidebarContainerQuery)
  if (siderbarContainer) {
    console.log('prepending to ' + siderbarContainer)
    siderbarContainer.prepend(container)
  } else {
    container.classList.add('sidebar-free')
    const appendContainer = getPossibleElementByQuerySelector(siteConfig.appendContainerQuery)
    if (appendContainer) {
      console.log('appending to ' + appendContainer)
      appendContainer.appendChild(container)
    } else {
      console.log('found nothing')
    }
  }

  render(
    <ChatGPTContainer question={question} triggerMode={userConfig.triggerMode || 'manually'} />,
    container,
  )
}

const siteRegex = new RegExp(Object.keys(config).join('|'))
const siteName = location.hostname.match(siteRegex)![0]
const siteConfig = config[siteName]

async function run() {
  console.log('RUNNING')
  const searchInput = getPossibleElementByQuerySelector<HTMLInputElement>(siteConfig.inputQuery)
  if (searchInput && searchInput.textContent) {
    console.info('Mount ChatGPT on', siteName)
    const userConfig = await getUserConfig()
    const searchValueWithLanguageOption =
      userConfig.language === Language.Auto
        ? searchInput.textContent
        : `${searchInput.textContent}(in ${userConfig.language})`
    mount(searchValueWithLanguageOption, siteConfig)
  }
}

run()

if (siteConfig.watchRouteChange) {
  siteConfig.watchRouteChange(run)
}
