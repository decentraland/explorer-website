export default function classNames(items: (string | false | undefined | null)[]): string {
  return items.filter(Boolean).join(' ')
}