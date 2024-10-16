export function callOnce<T>(fun: (...args: any[]) => T): (...args: any[]) => T {
  let result: { value: T } | null = null
  return () => {
    if (!result) {
      result = { value: fun() }
    }

    return result.value
  }
}
