import { styled } from 'decentraland-ui2'
import bgV3_1x from '../../images/background-v3@1x.jpg'
import bgV3_2x from '../../images/background-v3@2x.jpg'
import bgV3_3x from '../../images/background-v3@3x.jpg'
import bgV3_4x from '../../images/background-v3@4x.jpg'
import discordSvg from '../../images/discord.svg'

const SYSTEM_FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"

export const Container = styled('div')({
  width: '100vw',
  height: 'auto',
  paddingBottom: '60px',
  backgroundColor: 'white'
})

export const Hero = styled('main')({
  position: 'relative',
  overflow: 'hidden',
  fontFamily: SYSTEM_FONT_STACK,
  width: '100%',
  color: 'white',
  padding: '160px 20px',
  textAlign: 'center',
  backgroundSize: 'cover',
  backgroundColor: 'transparent',
  backgroundPosition: 'bottom left',
  backgroundRepeat: 'no-repeat',
  backgroundOrigin: 'border-box',
  backgroundImage: `image-set(url(${bgV3_1x}) 1x, url(${bgV3_2x}) 2x, url(${bgV3_3x}) 3x, url(${bgV3_4x}) 4x)`,
  '&::before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'black',
    opacity: 0.6,
    zIndex: 0
  }
})

export const HeroInner = styled('div')({
  position: 'relative'
})

export const HeroHeading = styled('h1')({
  color: 'white',
  fontSize: '40px',
  fontWeight: 700,
  lineHeight: '48px',
  marginBottom: '20px'
})

export const HeroSubtitle = styled('p')({
  color: 'white',
  fontSize: '16px',
  lineHeight: '19px'
})

export const BadgeRow = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexWrap: 'wrap',
  gap: '16px',
  margin: '28px 0 24px'
})

export const BadgeLink = styled('a')({
  display: 'inline-block',
  lineHeight: 0,
  '&:hover': {
    opacity: 0.85,
    textDecoration: 'none'
  }
})

export const BadgeImage = styled('img')({
  display: 'block',
  height: '50px',
  width: 'auto'
})

export const Section = styled('section')({
  backgroundColor: 'white',
  padding: '60px 6% 0',
  '& h2': {
    fontSize: '34px',
    fontWeight: 700,
    lineHeight: '41px',
    marginBottom: '16px'
  },
  '& h3': {
    fontSize: '20px',
    fontWeight: 600,
    lineHeight: '24px',
    marginTop: 0,
    marginBottom: '10px'
  },
  '& p': {
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '19px',
    marginBottom: '10px'
  }
})

export const Grid = styled('div')<{ padded?: boolean }>(({ padded }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  '& .item': {
    flex: '0 0 100%',
    boxSizing: 'border-box',
    display: 'block',
    position: 'relative',
    paddingBottom: padded ? '32px' : 0
  },
  '@media (min-width: 480px)': {
    '& .item': { flex: '0 0 50%' },
    '& .item:nth-of-type(odd)': { paddingRight: '11px' },
    '& .item:nth-of-type(even)': { paddingLeft: '11px' }
  }
}))

export const VideoThumb = styled('svg')({
  width: '100%',
  height: 'auto',
  borderRadius: '10px 10px 0 0',
  display: 'block',
  backgroundSize: 'cover',
  backgroundPosition: 'center center',
  backgroundRepeat: 'no-repeat'
})

export const VideoEmbed = styled('iframe')({
  border: 0,
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
  position: 'absolute'
})

export const Card = styled('a')({
  position: 'relative',
  display: 'block',
  boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.08)',
  borderRadius: '10px',
  background: 'white',
  height: '100%',
  textDecoration: 'none',
  color: 'inherit'
})

export const CardImage = styled('svg')({
  width: '100%',
  height: 'auto',
  borderRadius: '10px 10px 0 0',
  display: 'block',
  backgroundColor: '#404eed',
  backgroundImage: `url(${discordSvg})`,
  backgroundSize: 'auto',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center center',
  color: 'white'
})

export const CardContent = styled('span')({
  display: 'block',
  margin: '20px',
  paddingBottom: '44px'
})

export const CardCta = styled('span')({
  display: 'block',
  position: 'absolute',
  width: 'calc(100% - 40px)',
  bottom: '20px',
  padding: '10px 16px',
  borderRadius: '10px',
  backgroundColor: '#FF2D55',
  color: 'white',
  fontWeight: 600,
  textAlign: 'center',
  letterSpacing: '0.5px',
  textTransform: 'uppercase',
  fontSize: '14px'
})
