import { track } from "../utils/tracking"

export const EXPERIMENT_STORAGE_KEY = `decentraland_ab_experiments`

export type Experiment<V extends string = string> = {
  experimentId: string,
  variants: { criteria: number, value: V }[]
}

export const experiments = {
  newLanding: {
    experimentId: 'landing-metaversefestival-2021-10',
    variants: [
      { criteria: .5, value: 'hidden_animated_buttons' } as const,
      { criteria: 1, value: 'visible_buttons' } as const,
    ]
  }
}

let cache: Map<string, string> | null = null

const restoreValues = () => {
  const values = getValues()
  const keys = Array.from(values.keys())
  const exp = new Set(Object.values(experiments).map(experiment => experiment.experimentId))

  let hasChanged = false
  for (const key of keys) {
    if (!exp.has(key)) {
      values.delete(key)
      hasChanged = true
    }
  }

  if (hasChanged) {
    const entries = Array.from(values.entries())
    localStorage.setItem(EXPERIMENT_STORAGE_KEY, JSON.stringify(entries))
  }

  return values
}

const getValues = (): Map<string, string> => {
  try {
    const raw = localStorage.getItem(EXPERIMENT_STORAGE_KEY)
    return new Map(JSON.parse(raw || '[]'))
  } catch {
    return new Map()
  }
}

const setValues = (key: string, value: string) => {
  const newValues = getValues()
  newValues.set(key, value)
  cache = newValues
  const entries = Array.from(newValues.entries())
  localStorage.setItem(EXPERIMENT_STORAGE_KEY, JSON.stringify(entries))
}

export function getVariant<V extends string = string>(experiment: Experiment<V>): V | 'none' {
  if (!cache) {
    cache = restoreValues()
  }

  const { experimentId, variants } = experiment
  if (cache.has(experimentId)) {
    return cache.get(experimentId) as V
  }

  const random = Math.random()
  const selected = variants
    .find(variant => variant.criteria > random)

  const variant = selected?.value || 'none'
  setValues(experimentId, variant)
  track('ab_test', { experimentId, variant })
  return variant
}
