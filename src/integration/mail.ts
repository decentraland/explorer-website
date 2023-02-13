import isEmail from 'validator/lib/isEmail'

export async function subscribe(email: string) {
  const res = await fetch("https://subscription.decentraland.org/subscribe", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      interest: 'mobile-reminder'
    }),
  })

  if (res.status >= 400) {
    throw new Error(`Subscription failed`)
  }

  return res.json()
}

export { isEmail }