import { useSyncExternalStore } from 'react'

const NAVIGATION_EVENT = 'app:navigation'
const HOME_PATH = '/'
const ELEMENT_DETAIL_PREFIX = '/elements/'

type AppRoute =
  | {
      name: 'home'
    }
  | {
      name: 'element-detail'
      atomicNumber: number
    }

function getPathname() {
  if (typeof window === 'undefined') {
    return HOME_PATH
  }

  return window.location.pathname
}

function notifyNavigation() {
  window.dispatchEvent(new Event(NAVIGATION_EVENT))
}

export function navigateTo(path: string) {
  if (typeof window === 'undefined') {
    return
  }

  if (window.location.pathname === path) {
    return
  }

  window.history.pushState({}, '', path)
  notifyNavigation()
}

export function navigateToHome() {
  navigateTo(HOME_PATH)
}

export function buildElementDetailPath(atomicNumber: number) {
  return `${ELEMENT_DETAIL_PREFIX}${atomicNumber}`
}

export function navigateToElementDetail(atomicNumber: number) {
  navigateTo(buildElementDetailPath(atomicNumber))
}

export function parseAppRoute(pathname: string): AppRoute {
  if (pathname === HOME_PATH) {
    return { name: 'home' }
  }

  if (pathname.startsWith(ELEMENT_DETAIL_PREFIX)) {
    const id = pathname.slice(ELEMENT_DETAIL_PREFIX.length)
    const atomicNumber = Number(id)

    if (Number.isInteger(atomicNumber) && atomicNumber > 0) {
      return { name: 'element-detail', atomicNumber }
    }
  }

  return { name: 'home' }
}

function subscribe(onStoreChange: () => void) {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  window.addEventListener('popstate', onStoreChange)
  window.addEventListener(NAVIGATION_EVENT, onStoreChange)

  return () => {
    window.removeEventListener('popstate', onStoreChange)
    window.removeEventListener(NAVIGATION_EVENT, onStoreChange)
  }
}

export function useAppRoute() {
  const pathname = useSyncExternalStore(subscribe, getPathname, () => HOME_PATH)
  return parseAppRoute(pathname)
}
