import { useSyncExternalStore } from 'react'

const NAVIGATION_EVENT = 'app:navigation'
const HOME_PATH = '/'
const COMPOUNDS_PATH = '/compounds'
const COMPOUND_DETAIL_PREFIX = '/compounds/'
const ELEMENT_DETAIL_PREFIX = '/elements/'

type AppRoute =
  | {
      name: 'home'
    }
  | {
      name: 'compounds'
    }
  | {
      name: 'compound-detail'
      cid: number
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

export function navigateToCompounds() {
  navigateTo(COMPOUNDS_PATH)
}

export function buildCompoundDetailPath(cid: number, localizationKey?: string) {
  const pathname = `${COMPOUND_DETAIL_PREFIX}${cid}`

  if (!localizationKey) {
    return pathname
  }

  return `${pathname}?key=${encodeURIComponent(localizationKey)}`
}

export function navigateToCompoundDetail(cid: number, localizationKey?: string) {
  navigateTo(buildCompoundDetailPath(cid, localizationKey))
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

  if (pathname === COMPOUNDS_PATH) {
    return { name: 'compounds' }
  }

  if (pathname.startsWith(COMPOUND_DETAIL_PREFIX) && pathname !== COMPOUNDS_PATH) {
    const id = pathname.slice(COMPOUND_DETAIL_PREFIX.length)
    const cid = Number(id)

    if (Number.isInteger(cid) && cid > 0) {
      return { name: 'compound-detail', cid }
    }
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
