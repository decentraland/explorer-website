import React, { useEffect } from 'react'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { useMobileResize } from '../../integration/mobile'
import Navbar from './Layout/Navbar'
import { track } from '../../utils/tracking'
import './MobileContainer.css'

export default React.memo(function MobileContainer() {
  useMobileResize()

  useEffect(() => {
    track('explorer_website_mobile_screen')
  }, [])

  return (
    <div className="MobileContainer">
      <Navbar />
      <main className="MobileHero">
        <div>
          <h1>Play Decentraland on Desktop</h1>
          <p>Decentraland is not available on mobile.</p>
          <p>
            Visit <strong>decentraland.org/play</strong> in your desktop browser to access Decentraland.
          </p>
        </div>
      </main>

      <section>
        <h2>Get a reminder</h2>
        <p>
          Get an email reminder to jump into Decentraland the next time you are back at a computer. You will also be
          added to the Decentraland Weekly newsletter to receive the latest news and events.
        </p>
        <iframe
          title="subscribe"
          className="MobileSubscribe"
          src="https://embeds.beehiiv.com/d7d652da-adc8-422f-9176-4b653a244020?slim=true"
          data-test-id="beehiiv-embed"
        ></iframe>
      </section>

      <section>
        <div className="grid">
          <div className="item">
            <h2>What is Decentraland?</h2>
            <p>Decentraland is the first ever virtual world owned by its users.</p>
          </div>
          <div className="item">
            <svg
              width="480"
              height="276"
              style={{ backgroundImage: `url('https://img.youtube.com/vi/thkDaebUaDQ/mqdefault.jpg')` }}
            />
            <iframe
              width="480"
              height="276"
              src="https://www.youtube.com/embed/thkDaebUaDQ"
              title="YouTube video player"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </section>

      <section>
        <h2>Take Part</h2>
        <div className="grid padded">
          <div className="item">
            <a className="card" href="https://market.decentraland.org" target="_blank" rel="noreferrer">
              <svg
                width="328"
                height="200"
                style={{ backgroundImage: `url('https://decentraland.org/images/jacket.jpg')` }}
              />
              <span className="card-content">
                <h3>Buy and sell on the Marketplace</h3>
                <p>Decentraland is the first ever virtual world owned by its users.</p>
                <Button as="span" primary>
                  Marketplace
                </Button>
              </span>
            </a>
          </div>
          <div className="item">
            <a className="card" href="https://events.decentraland.org" target="_blank" rel="noreferrer">
              <svg
                width="328"
                height="200"
                style={{
                  backgroundImage: `url('https://decentraland.org/blog/images/static/images/2020-recap-banner-500487ea620de46b53e5cb0783f231a0.png')`
                }}
              />
              <span className="card-content">
                <h3>Find an event</h3>
                <p>Decentraland is the first ever virtual world owned by its users.</p>
                <Button as="span" primary>
                  Events
                </Button>
              </span>
            </a>
          </div>
          <div className="item">
            <a className="card" href="https://governance.decentraland.org" target="_blank" rel="noreferrer">
              <svg
                width="328"
                height="200"
                style={{
                  backgroundImage: `url('https://decentraland.org/blog/images/static/images/governance-517ddb1597c85fa0efd1f5cfe765fe45.jpg')`
                }}
              />
              <span className="card-content">
                <h3>Contribute to Decentraland</h3>
                <p>Decentraland is the first ever virtual world owned by its users.</p>
                <Button as="span" primary>
                  DAO
                </Button>
              </span>
            </a>
          </div>
          <div className="item">
            <a className="card" href="https://dcl.gg/discord" target="_blank" rel="noreferrer">
              <svg width="328" height="200" className="discord" />
              <span className="card-content">
                <h3>Join us on Discord</h3>
                <p>Decentraland is the first ever virtual world owned by its users.</p>
                <Button as="span" primary>
                  JOIN DISCORD
                </Button>
              </span>
            </a>
          </div>
        </div>
      </section>
    </div>
  )
})
