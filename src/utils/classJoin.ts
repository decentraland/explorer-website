export default function classJoin(items: (string | false | undefined | null)[]): string {
  return items.filter(Boolean).join(' ')
}