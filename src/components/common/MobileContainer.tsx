import React, { useCallback, useEffect, useState } from 'react'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { useMobileResize } from '../../integration/mobile'
import { Navbar } from './Layout/Navbar'
import { isEmail, subscribe } from '../../integration/mail'
import { track } from '../../utils/tracking'
import './MobileContainer.css'

type MobileContainerState = {
  sending: boolean,
  sent: boolean,
  error: null | Error
}

export default React.memo(function MobileContainer() {
  useMobileResize()

  useEffect(() => {
    track('explorer_website_mobile_screen')
  }, [])
  
  const [state, setState] = useState<MobileContainerState>({ sending: false, sent: false, error: null })
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = data.get('email') as string
    if (isEmail(email)) {
      setState({ sending: true, sent: false, error: null })
      try {
        await subscribe(email)
        setState({ sending: false, sent: true, error: null })
      } catch (error) {
        setState({ sending: false, sent: false, error: error as Error })
      }
    }
  }, [])

  return <div className="MobileContainer">
    <Navbar rightMenu={false} />
    <main className="MobileHero">
      <div>
        <h1>Play Decentraland on Desktop</h1>
        <p>Decentraland is not available on mobile.</p>
        <p>Visit <strong>dcl.gg/play</strong> in your desktop browser to access Decentraland.</p>
      </div>
    </main>

    <section>
      <h2>Get a reminder</h2>
      <p>Get an email reminder to check out Decentraland on desktop.</p>
      <form className="reminder" onSubmit={handleSubmit} style={{ opacity: state.sent ? .5 : 1 }}>
        <input type="email" name="email" placeholder="email@domain.com" required className={state.error ? 'error' : ''} />
        <Button type="submit" small primary loading={state.sending} disabled={state.sent}>SEND REMINDER</Button>
      </form>
      {state.error && <p className="error">{state.error.message}</p>}
      {state.sent && <p className="message">Awesome! You will receive an email soon!</p>}
    </section>

    <section>
      <div className="grid">
        <div className="item">
          <h2>What is Decentraland?</h2>
          <p>Decentraland is the first ever virtual world owned by its users.</p>
        </div>
        <div className="item">
          <svg width="480" height="276" style={{ backgroundImage: `url('https://img.youtube.com/vi/thkDaebUaDQ/mqdefault.jpg')` }} />
          <iframe width="480" height="276" src="https://www.youtube.com/embed/thkDaebUaDQ" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      </div>
    </section>

    <section>
      <h2>Take Part</h2>
      <div className="grid padded">
        <div className="item">
          <a className="card" href="https://market.decentraland.org" target="_blank" rel="noreferrer">
            <svg width="328" height="200" style={{ backgroundImage: `url('https://decentraland.org/images/jacket.jpg')` }} />
            <span className='card-content'>
              <h3>Buy and sell on the Marketplace</h3>
              <p>Decentraland is the first ever virtual world owned by its users.</p>
              <Button as="span" primary>Marketplace</Button>
            </span>
          </a>
        </div>
        <div className="item">
          <a className="card" href="https://events.decentraland.org" target="_blank" rel="noreferrer">
            <svg width="328" height="200" style={{ backgroundImage: `url('https://decentraland.org/blog/images/static/images/2020-recap-banner-500487ea620de46b53e5cb0783f231a0.png')` }} />
            <span className='card-content'>
              <h3>Find an event</h3>
              <p>Decentraland is the first ever virtual world owned by its users.</p>
              <Button as="span" primary>Events</Button>
            </span>
          </a>
        </div>
        <div className="item">
          <a className="card" href="https://governance.decentraland.org" target="_blank" rel="noreferrer">
            <svg width="328" height="200" style={{ backgroundImage: `url('https://decentraland.org/blog/images/static/images/governance-517ddb1597c85fa0efd1f5cfe765fe45.jpg')` }} />
            <span className='card-content'>
              <h3>Contribute to Decentraland</h3>
              <p>Decentraland is the first ever virtual world owned by its users.</p>
              <Button as="span" primary>DAO</Button>
            </span>
          </a>
        </div>
        <div className="item">
          <a className="card" href="https://dcl.gg/discord" target="_blank" rel="noreferrer">
            <svg width="328" height="200" className="discord" />
            <span className='card-content'>
              <h3>Join us on Discord</h3>
              <p>Decentraland is the first ever virtual world owned by its users.</p>
              <Button as="span" primary>JOIN DISCORD</Button>
            </span>
          </a>
        </div>
      </div>
    </section>

  </div>
})