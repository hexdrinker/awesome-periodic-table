import ky from 'ky'
import type { AppLanguage } from '@/shared/model/app-store'

interface WikipediaSummaryResponse {
  type?: string
  extract?: string
  content_urls?: {
    desktop?: {
      page?: string
    }
  }
}

interface WikidataEntitiesResponse {
  entities?: Record<
    string,
    {
      sitelinks?: Record<
        string,
        {
          title: string
        }
      >
    }
  >
}

const wikiClient = ky.create({
  timeout: 10000,
  retry: {
    limit: 2,
    methods: ['get'],
    statusCodes: [408, 413, 429, 500, 502, 503, 504],
  },
})

export interface WikipediaElementSummary {
  text: string
  url: string | null
}

export async function fetchWikipediaElementSummary(
  englishTitle: string,
  language: AppLanguage,
): Promise<WikipediaElementSummary | null> {
  const localizedTitle =
    language === 'en' ? englishTitle : await resolveLocalizedWikipediaTitle(englishTitle, language)

  if (localizedTitle) {
    const localizedSummary = await fetchSummaryByTitle(localizedTitle, language)
    if (localizedSummary) {
      return localizedSummary
    }
  }

  if (language !== 'en') {
    return fetchSummaryByTitle(englishTitle, 'en')
  }

  return null
}

async function resolveLocalizedWikipediaTitle(
  englishTitle: string,
  language: Exclude<AppLanguage, 'en'>,
) {
  const response = await wikiClient.get('https://www.wikidata.org/w/api.php', {
    searchParams: {
      action: 'wbgetentities',
      format: 'json',
      origin: '*',
      props: 'sitelinks',
      sites: 'enwiki',
      titles: englishTitle,
    },
    throwHttpErrors: false,
  })

  if (!response.ok) {
    return null
  }

  const data = await response.json<WikidataEntitiesResponse>()
  const siteKey = `${language}wiki`
  const entity = Object.values(data.entities ?? {}).find((entry) => entry.sitelinks?.[siteKey])

  return entity?.sitelinks?.[siteKey]?.title ?? null
}

async function fetchSummaryByTitle(title: string, language: AppLanguage) {
  const response = await wikiClient.get(
    `https://${language}.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`,
    {
      throwHttpErrors: false,
    },
  )

  if (!response.ok) {
    return null
  }

  const data = await response.json<WikipediaSummaryResponse>()
  const extract = data.extract?.replace(/\s+/g, ' ').trim()

  if (!extract || data.type === 'disambiguation') {
    return null
  }

  return {
    text: extract,
    url: data.content_urls?.desktop?.page ?? null,
  } satisfies WikipediaElementSummary
}
