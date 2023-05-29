export default function queueMicrotask(task: () => Promise<any>) {
  Promise.resolve()
    .then(task)
    .catch(console.error)
}