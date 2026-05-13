import React, { useEffect, useRef } from 'react'
import { useMobileResize } from '../../integration/mobile'
import { DOWNLOAD_URLS, detectDownloadOS } from '../../integration/downloadConstants'
import { useFormatMessage } from '../../hooks/useFormatMessage'
import Navbar from './Layout/Navbar'
import { track } from '../../utils/tracking'
import appStoreBadge from '../../images/download-on-the-app-store.svg'
import googlePlayBadge from '../../images/google_play_cta.svg'
import {
  Container,
  Hero,
  HeroInner,
  HeroHeading,
  HeroSubtitle,
  BadgeRow,
  BadgeLink,
  BadgeImage,
  Section,
  Grid,
  VideoThumb,
  VideoEmbed,
  Card,
  CardImage,
  CardContent,
  CardCta
} from './MobileContainer.styled'

export default React.memo(function MobileContainer() {
  useMobileResize()
  const l = useFormatMessage()
  // StrictMode double-invokes effects in dev; ref ensures the screen event fires once.
  const tracked = useRef(false)

  useEffect(() => {
    if (tracked.current) return
    tracked.current = true
    track('explorer_website_mobile_screen')
  }, [])

  const isAndroid = detectDownloadOS() === 'android'
  const osLabel = l(isAndroid ? 'mobile.os_android' : 'mobile.os_ios')

  return (
    <Container>
      <Navbar />
      <Hero>
        <HeroInner>
          <HeroHeading>{l('mobile.hero_title')}</HeroHeading>
          <HeroSubtitle>{l('mobile.hero_subtitle', { os: osLabel })}</HeroSubtitle>
          <BadgeRow>
            {isAndroid ? (
              <BadgeLink
                href={DOWNLOAD_URLS.googlePlay}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('explorer_website_mobile_google_play_click', {})}
              >
                <BadgeImage src={googlePlayBadge} alt={l('mobile.google_play_alt')} />
              </BadgeLink>
            ) : (
              <BadgeLink
                href={DOWNLOAD_URLS.appStore}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('explorer_website_mobile_app_store_click', {})}
              >
                <BadgeImage src={appStoreBadge} alt={l('mobile.app_store_alt')} />
              </BadgeLink>
            )}
          </BadgeRow>
        </HeroInner>
      </Hero>

      <Section>
        <Grid>
          <div className="item">
            <h2>{l('mobile.what_title')}</h2>
            <p>{l('mobile.what_text')}</p>
          </div>
          <div className="item">
            <VideoThumb
              width="480"
              height="276"
              style={{ backgroundImage: `url('https://img.youtube.com/vi/thkDaebUaDQ/mqdefault.jpg')` }}
            />
            <VideoEmbed
              width="480"
              height="276"
              src="https://www.youtube.com/embed/thkDaebUaDQ"
              title="YouTube video player"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </Grid>
      </Section>

      <Section>
        <h2>{l('mobile.take_part')}</h2>
        <Grid padded>
          <div className="item">
            <Card href="https://dcl.gg/discord" target="_blank" rel="noreferrer">
              <CardImage width="328" height="200" />
              <CardContent>
                <h3>{l('mobile.discord_title')}</h3>
                <p>{l('mobile.discord_text')}</p>
                <CardCta>{l('mobile.discord_cta')}</CardCta>
              </CardContent>
            </Card>
          </div>
        </Grid>
      </Section>
    </Container>
  )
})
