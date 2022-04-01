import { isInsideWorldLimits } from "@dcl/schemas"

export function parsePosition(position?: string | undefined | null) {
  if (!position) {
    return null
  }

  const [x, y] = position.split(',').map(Number)
  if (!Number.isFinite(x) || !Number.isFinite(y)) {
    return null
  }

  if(!isInsideWorldLimits(x,y)) {
    return null
  }

  return [x,y] as const
}