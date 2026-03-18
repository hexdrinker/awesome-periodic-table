import { useMemo, type CSSProperties } from 'react'
import {
  CATEGORY_COLORS,
  type Element,
  useElementDetailQuery,
  usePeriodicTableQuery,
} from '@/entities/element'
import {
  getCategoryLabel,
  sceneThemePalettes,
  translations,
  useAppStore,
  useResolvedTheme,
} from '@/shared'
import { Navbar } from '@/features/preferences'
import { navigateToHome } from '@/shared/lib/router'
import { AtomOrbitalDisplay } from './AtomOrbitalDisplay'

interface ElementDetailPageProps {
  atomicNumber: number
}

type DetailFact = {
  accent: string
  key: string
  label: string
  tooltip: string
  tooltipTitle: string
  value: string
}

const DETAIL_COPY = {
  en: {
    atomicIndex: 'Atomic Index',
    backToTable: 'Back to Table',
    boilingTooltip: 'The temperature where the element changes from liquid to gas at standard pressure.',
    configurationLabel: 'Configuration',
    configurationTooltip: 'Electron arrangement across orbitals, which strongly influences bonding and reactivity.',
    densityTooltip: 'Mass packed into a given volume, usually measured near room conditions.',
    descriptionLabel: 'Field Notes',
    electronAffinityLabel: 'Electron Affinity',
    electronAffinityTooltip: 'Energy change when a neutral atom gains an electron.',
    electronegativityLabel: 'Electronegativity',
    electronegativityTooltip: 'How strongly the atom attracts shared electrons in a bond.',
    groupLabel: 'Group',
    ionizationEnergyLabel: 'Ionization Energy',
    ionizationEnergyTooltip: 'Energy required to remove the outermost electron from a gaseous atom.',
    meltingTooltip: 'The temperature where the element changes from solid to liquid at standard pressure.',
    notFoundTitle: 'Element not found',
    periodGroupLabel: 'Period / Group',
    periodGroupTooltip: 'Period shows the energy level row and group shows the chemical family column.',
    radiusLabel: 'Atomic Radius',
    radiusTooltip: 'Approximate size of the atom from its nucleus to the outer electron cloud.',
    shellCount: 'Shells',
    shellDistribution: 'Electron Shell Distribution',
    shellDistributionTooltip: 'Electrons arranged by principal energy level from the nucleus outward.',
    stabilityCaption: 'Estimated from periodic trends and known physical state.',
    stabilityLabel: 'Stability',
    stateTooltip: 'The most common physical state of the pure element under standard conditions.',
    tableUnavailableTitle: 'Table unavailable',
    weightTooltip: 'Average atomic mass based on naturally occurring isotopes.',
    oxidationTooltip: 'Common charges the atom can take when it forms ions or compounds.',
  },
  ko: {
    atomicIndex: '원자 인덱스',
    backToTable: '주기율표로 돌아가기',
    boilingTooltip: '표준 압력에서 액체가 기체로 바뀌는 온도입니다.',
    configurationLabel: '전자 배치',
    configurationTooltip: '전자들이 어떤 오비탈에 배치되는지 보여주며 결합과 반응성을 크게 좌우합니다.',
    densityTooltip: '일정 부피 안에 얼마나 많은 질량이 들어 있는지 나타내는 값입니다.',
    descriptionLabel: '설명',
    electronAffinityLabel: '전자 친화도',
    electronAffinityTooltip: '중성 원자가 전자 하나를 받아들일 때의 에너지 변화입니다.',
    electronegativityLabel: '전기음성도',
    electronegativityTooltip: '화학 결합에서 전자를 끌어당기는 힘의 크기입니다.',
    groupLabel: '족',
    ionizationEnergyLabel: '이온화 에너지',
    ionizationEnergyTooltip: '기체 상태 원자에서 가장 바깥 전자를 떼어내는 데 필요한 에너지입니다.',
    meltingTooltip: '표준 압력에서 고체가 액체로 바뀌는 온도입니다.',
    notFoundTitle: '원소를 찾을 수 없습니다',
    periodGroupLabel: '주기 / 족',
    periodGroupTooltip: '주기는 에너지 준위의 행, 족은 화학적 성질이 비슷한 열을 뜻합니다.',
    radiusLabel: '원자 반지름',
    radiusTooltip: '원자핵에서 바깥 전자 구름까지의 대략적인 크기입니다.',
    shellCount: '전자 껍질',
    shellDistribution: '전자 껍질 분포',
    shellDistributionTooltip: '원자핵을 중심으로 바깥쪽 에너지 준위에 전자가 어떻게 나뉘는지 보여줍니다.',
    stabilityCaption: '주기율표 경향과 알려진 물성값을 바탕으로 추정했습니다.',
    stabilityLabel: '안정성',
    stateTooltip: '표준 상태에서 가장 일반적으로 관찰되는 물리적 상태입니다.',
    tableUnavailableTitle: '원소 목록을 가져오지 못했습니다',
    weightTooltip: '자연계 동위원소 비율을 반영한 평균 원자 질량입니다.',
    oxidationTooltip: '이온이나 화합물을 만들 때 자주 나타나는 전하 상태입니다.',
  },
} as const

export function ElementDetailPage({ atomicNumber }: ElementDetailPageProps) {
  const language = useAppStore((state) => state.language)
  const setSelectedElement = useAppStore((state) => state.setSelectedElement)
  const resolvedTheme = useResolvedTheme()
  const palette = sceneThemePalettes[resolvedTheme]
  const copy = translations[language]
  const content = DETAIL_COPY[language]

  const { data: elements, isLoading: isElementsLoading, isError: isElementsError } =
    usePeriodicTableQuery()
  const element = useMemo(
    () => elements?.find((entry) => entry.atomicNumber === atomicNumber) ?? null,
    [atomicNumber, elements],
  )

  const { data: detail, isLoading: isDetailLoading, isError: isDetailError } =
    useElementDetailQuery(element?.atomicNumber ?? atomicNumber)

  const accentColor = element ? CATEGORY_COLORS[element.category] : 'var(--accent)'
  const facts = buildFacts(element, detail, language, copy, content)
  const summary = createSummary(detail?.physicalDescription, language)
  const shellSummary = element ? getShellSummary(element.atomicNumber, language) : []

  return (
    <div
      className="element-detail-page h-screen overflow-hidden"
      style={
        {
          '--detail-accent': accentColor,
          background: `
            radial-gradient(circle at 12% 18%, color-mix(in srgb, ${accentColor} 18%, transparent), transparent 28%),
            radial-gradient(circle at 78% 24%, color-mix(in srgb, var(--accent) 12%, transparent), transparent 22%),
            ${palette.background}
          `,
        } as CSSProperties
      }
    >
      <Navbar />

      <div className="h-full overflow-y-auto pt-16">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-7xl flex-col px-5 py-5 md:px-8 md:py-8">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            className="detail-nav-button"
            onClick={() => {
              setSelectedElement(element)
              navigateToHome()
            }}
          >
            {content.backToTable}
          </button>
          <div
            className="font-inter tracking-[0.28em] uppercase"
            style={{ fontSize: '11px', color: 'var(--text-muted)' }}
          >
            {copy.brand}
          </div>
          </div>

          {isElementsLoading ? (
            <StatePanel
              language={language}
              title={language === 'ko' ? '원소 정보를 불러오는 중' : 'Loading element'}
              body={copy.leftPanel.detailLoading}
            />
          ) : isElementsError ? (
            <StatePanel
              language={language}
              title={content.tableUnavailableTitle}
              body={copy.rightPanel.unavailable}
            />
          ) : !element ? (
            <StatePanel
              language={language}
              title={content.notFoundTitle}
              body={
                language === 'ko'
                  ? `원자번호 ${atomicNumber}에 해당하는 원소가 없습니다.`
                  : `No element exists for atomic number ${atomicNumber}.`
              }
            />
          ) : (
            <div className="grid gap-6 pb-8 xl:grid-cols-[minmax(380px,0.86fr)_minmax(0,1.14fr)]">
              <section
                className="detail-panel relative overflow-hidden rounded-[30px] p-5 md:p-7"
                style={{
                  background:
                    'linear-gradient(180deg, color-mix(in srgb, var(--app-bg-card) 92%, transparent), color-mix(in srgb, var(--app-bg-card) 78%, transparent))',
                }}
              >
                <div className="mb-5 flex items-center justify-between gap-4">
                  <div className="detail-atomic-id">
                    <span className="detail-atomic-number">{element.atomicNumber}</span>
                    <span className="detail-atomic-caption">{content.atomicIndex}</span>
                  </div>

                  <div className="detail-mini-stat">
                    <span>{content.shellCount}</span>
                    <strong>{shellSummary.length}</strong>
                  </div>
                </div>

                <div className="detail-visual-card">
                  <AtomOrbitalDisplay
                    accentColor={accentColor}
                    atomicNumber={element.atomicNumber}
                    symbol={element.symbol}
                  />
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {shellSummary.map((shell) => (
                    <div key={shell.label} className="detail-shell-summary">
                      <span className="detail-shell-label">{shell.label}</span>
                      <span className="detail-shell-value">{shell.value}</span>
                    </div>
                  ))}
                </div>
              </section>

              <section
                className="detail-panel relative overflow-hidden rounded-[34px] px-6 py-7 md:px-8 md:py-8"
                style={{
                  background:
                    'linear-gradient(180deg, color-mix(in srgb, var(--app-bg-card) 94%, transparent), color-mix(in srgb, var(--app-bg-card) 82%, transparent))',
                }}
              >
                <div className="detail-panel-glow" />

                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div>
                    <div
                      className="font-space text-[12px] font-semibold tracking-[0.28em] uppercase"
                      style={{ color: accentColor }}
                    >
                      {getCategoryLabel(element.category, language)} | {content.groupLabel}{' '}
                      {element.group ?? '—'}
                    </div>
                    <h1 className="font-space mt-3 text-5xl font-bold leading-none md:text-7xl">
                      {element.name}
                    </h1>
                    <div
                      className="mt-3 font-space text-2xl font-semibold"
                      style={{ color: 'var(--text-secondary)' }}
                    >
                      {element.symbol}
                    </div>
                  </div>

                  <div
                    className="detail-hero-badge"
                    style={{ '--detail-accent': accentColor } as CSSProperties}
                  >
                    <div className="font-space text-4xl font-bold">
                      {formatAtomicWeight(element.atomicWeight)}
                    </div>
                    <div className="font-inter mt-2 text-[11px] uppercase tracking-[0.22em]">
                      {copy.leftPanel.weight}
                    </div>
                  </div>
                </div>

                <p className="detail-summary mt-8">{summary}</p>

                <div className="mt-8 grid gap-3 md:grid-cols-2">
                  {facts.map((fact) => (
                    <DetailFactCard key={fact.key} fact={fact} />
                  ))}
                </div>

                <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_220px]">
                  <section className="detail-note-card">
                    <div className="detail-note-title">{content.descriptionLabel}</div>
                    <div className="detail-note-body">
                      {isDetailLoading
                        ? copy.leftPanel.detailLoading
                        : isDetailError
                          ? copy.leftPanel.detailError
                          : detail?.physicalDescription ||
                            (language === 'ko'
                              ? '추가 설명이 제공되지 않았습니다.'
                              : 'No additional description is available.')}
                    </div>
                  </section>

                  <section className="detail-meter-card">
                    <div className="detail-meter-title">{content.stabilityLabel}</div>
                    <div className="detail-meter-track">
                      <div
                        className="detail-meter-fill"
                        style={{ height: `${getStabilityLevel(element)}%` }}
                      />
                    </div>
                    <div className="detail-meter-caption">{content.stabilityCaption}</div>
                  </section>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailFactCard({ fact }: { fact: DetailFact }) {
  return (
    <article
      className="detail-fact-card"
      style={{ '--fact-accent': fact.accent } as CSSProperties}
    >
      <div className="detail-fact-head">
        <span className="detail-fact-label">{fact.label}</span>
        <button type="button" className="detail-tooltip-trigger" aria-label={fact.tooltipTitle}>
          i
          <span className="detail-tooltip-bubble" role="tooltip">
            <strong>{fact.tooltipTitle}</strong>
            <span>{fact.tooltip}</span>
          </span>
        </button>
      </div>
      <div className="detail-fact-value">{fact.value}</div>
    </article>
  )
}

function StatePanel({
  language,
  title,
  body,
}: {
  language: 'en' | 'ko'
  title: string
  body: string
}) {
  return (
    <div
      className="mx-auto my-auto w-full max-w-xl rounded-[28px] p-8 text-center"
      style={{
        background: 'var(--app-bg-card)',
        boxShadow: '0 24px 80px var(--shadow-glow)',
      }}
    >
      <h1 className="font-space text-3xl font-bold" style={{ color: 'var(--text-primary)' }}>
        {title}
      </h1>
      <p className="font-inter mt-4 text-sm leading-7" style={{ color: 'var(--text-secondary)' }}>
        {body}
      </p>
      <button type="button" className="detail-nav-button mt-6" onClick={navigateToHome}>
        {language === 'ko' ? '주기율표로 이동' : 'Go to Table'}
      </button>
    </div>
  )
}

function buildFacts(
  element: Element | null,
  detail: ReturnType<typeof useElementDetailQuery>['data'],
  language: 'en' | 'ko',
  copy: (typeof translations)['en'] | (typeof translations)['ko'],
  content: (typeof DETAIL_COPY)['en'] | (typeof DETAIL_COPY)['ko'],
) {
  if (!element) {
    return []
  }

  return [
    {
      accent: '#8ef0ff',
      key: 'configuration',
      label: content.configurationLabel,
      tooltip: content.configurationTooltip,
      tooltipTitle: content.configurationLabel,
      value: detail?.electronConfig || element.electronConfig || '—',
    },
    {
      accent: '#8ef0ff',
      key: 'weight',
      label: copy.leftPanel.weight,
      tooltip: content.weightTooltip,
      tooltipTitle: copy.leftPanel.weight,
      value: detail?.atomicWeightText
        ? `${detail.atomicWeightText} u`
        : `${formatAtomicWeight(element.atomicWeight)} u`,
    },
    {
      accent: '#ff74d6',
      key: 'melting',
      label: copy.leftPanel.melting,
      tooltip: content.meltingTooltip,
      tooltipTitle: copy.leftPanel.melting,
      value: formatTemperature(detail?.meltingPoint ?? element.meltingPoint),
    },
    {
      accent: '#ff74d6',
      key: 'boiling',
      label: copy.leftPanel.boiling,
      tooltip: content.boilingTooltip,
      tooltipTitle: copy.leftPanel.boiling,
      value: formatTemperature(detail?.boilingPoint ?? element.boilingPoint),
    },
    {
      accent: '#b8ff84',
      key: 'density',
      label: copy.leftPanel.density,
      tooltip: content.densityTooltip,
      tooltipTitle: copy.leftPanel.density,
      value: formatMeasure(detail?.density ?? element.density, 'g/cm³'),
    },
    {
      accent: '#b8ff84',
      key: 'state',
      label: copy.leftPanel.standardState,
      tooltip: content.stateTooltip,
      tooltipTitle: copy.leftPanel.standardState,
      value: element.standardState ?? '—',
    },
    {
      accent: '#8ef0ff',
      key: 'period-group',
      label: content.periodGroupLabel,
      tooltip: content.periodGroupTooltip,
      tooltipTitle: content.periodGroupLabel,
      value: `${detail?.period ?? element.period ?? '—'} / ${detail?.group ?? element.group ?? '—'}`,
    },
    {
      accent: '#8ef0ff',
      key: 'shell-distribution',
      label: content.shellDistribution,
      tooltip: content.shellDistributionTooltip,
      tooltipTitle: content.shellDistribution,
      value: getShellDistribution(element.atomicNumber).join(' • '),
    },
    {
      accent: '#b8ff84',
      key: 'oxidation',
      label: copy.leftPanel.oxidationStates,
      tooltip: content.oxidationTooltip,
      tooltipTitle: copy.leftPanel.oxidationStates,
      value: detail?.oxidationStates ?? element.oxidationStates ?? '—',
    },
    {
      accent: '#8ef0ff',
      key: 'radius',
      label: content.radiusLabel,
      tooltip: content.radiusTooltip,
      tooltipTitle: content.radiusLabel,
      value: formatMeasure(detail?.atomicRadius ?? element.atomicRadius, 'pm'),
    },
    {
      accent: '#8ef0ff',
      key: 'ionization',
      label: content.ionizationEnergyLabel,
      tooltip: content.ionizationEnergyTooltip,
      tooltipTitle: content.ionizationEnergyLabel,
      value: formatMeasure(detail?.ionizationEnergy ?? element.ionizationEnergy, 'eV'),
    },
    {
      accent: '#8ef0ff',
      key: 'electron-affinity',
      label: content.electronAffinityLabel,
      tooltip: content.electronAffinityTooltip,
      tooltipTitle: content.electronAffinityLabel,
      value: formatMeasure(detail?.electronAffinity ?? element.electronAffinity, 'eV'),
    },
    {
      accent: '#8ef0ff',
      key: 'electronegativity',
      label: content.electronegativityLabel,
      tooltip: content.electronegativityTooltip,
      tooltipTitle: content.electronegativityLabel,
      value: formatMeasure(detail?.electronegativity ?? element.electronegativity, ''),
    },
  ] satisfies DetailFact[]
}

function createSummary(description: string | null | undefined, language: 'en' | 'ko') {
  if (!description) {
    return language === 'ko'
      ? '이 원소의 물성과 반응성에 대한 대표 설명을 준비 중입니다.'
      : 'A concise summary for this element is being prepared.'
  }

  const normalized = description.replace(/\s+/g, ' ').trim()
  const sentence = normalized.match(/^.+?[.!?](\s|$)/)?.[0]?.trim()

  if (sentence) {
    return sentence
  }

  return normalized.length > 140 ? `${normalized.slice(0, 137)}...` : normalized
}

function getShellSummary(atomicNumber: number, language: 'en' | 'ko') {
  return getShellDistribution(atomicNumber).map((count, index) => ({
    label: `${['K', 'L', 'M', 'N', 'O', 'P', 'Q'][index]} ${index + 1}`,
    value:
      language === 'ko'
        ? `${count} 전자`
        : `${count} ${count === 1 ? 'electron' : 'electrons'}`,
  }))
}

function getShellDistribution(atomicNumber: number) {
  const shellCounts = new Array<number>(7).fill(0)
  const orbitals = [
    ['1s', 2],
    ['2s', 2],
    ['2p', 6],
    ['3s', 2],
    ['3p', 6],
    ['4s', 2],
    ['3d', 10],
    ['4p', 6],
    ['5s', 2],
    ['4d', 10],
    ['5p', 6],
    ['6s', 2],
    ['4f', 14],
    ['5d', 10],
    ['6p', 6],
    ['7s', 2],
    ['5f', 14],
    ['6d', 10],
    ['7p', 6],
  ] as const
  let remaining = atomicNumber

  for (const [orbital, capacity] of orbitals) {
    if (remaining <= 0) {
      break
    }

    const shellIndex = Number(orbital[0]) - 1
    const fillCount = Math.min(remaining, capacity)
    shellCounts[shellIndex] += fillCount
    remaining -= fillCount
  }

  return shellCounts.filter((count) => count > 0)
}

function getStabilityLevel(element: Element) {
  const base =
    element.standardState === 'Solid'
      ? 82
      : element.standardState === 'Liquid'
        ? 68
        : 54
  const discoveredBoost =
    element.yearDiscovered && !Number.isNaN(Number(element.yearDiscovered)) ? 6 : 0
  const densityBoost = element.density ? Math.min(element.density * 2, 12) : 0

  return Math.max(24, Math.min(96, base + discoveredBoost + densityBoost))
}

function formatAtomicWeight(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/\.?0+$/, '')
}

function formatNumber(value: number) {
  return Number.isInteger(value) ? String(value) : value.toFixed(3).replace(/\.?0+$/, '')
}

function formatMeasure(value: number | null | undefined, unit: string) {
  if (value == null) {
    return '—'
  }

  return unit ? `${formatNumber(value)} ${unit}` : formatNumber(value)
}

function formatTemperature(value: number | null | undefined) {
  if (value == null) {
    return '—'
  }

  const celsius = value - 273.15
  return `${Math.round(celsius)} °C`
}
