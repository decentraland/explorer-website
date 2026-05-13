import { styled } from 'decentraland-ui2'
import bgV3_1x from '../../../images/background-v3@1x.jpg'
import bgV3_2x from '../../../images/background-v3@2x.jpg'
import bgV3_3x from '../../../images/background-v3@3x.jpg'
import bgV3_4x from '../../../images/background-v3@4x.jpg'
import { SYSTEM_FONT_STACK } from '../../../theme/constants'

export const MainEl = styled('main')<{ $withDarkLayer?: boolean }>(({ $withDarkLayer }) => ({
  position: 'relative',
  overflow: 'hidden',
  fontFamily: SYSTEM_FONT_STACK,
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  height: '100vh',
  minHeight: '790px',
  backgroundSize: 'cover',
  backgroundColor: 'transparent',
  backgroundPosition: 'bottom center',
  backgroundRepeat: 'no-repeat',
  backgroundOrigin: 'border-box',
  backgroundImage: `image-set(url(${bgV3_1x}) 1x, url(${bgV3_2x}) 2x, url(${bgV3_3x}) 3x, url(${bgV3_4x}) 4x)`,
  '& *': { boxSizing: 'content-box' },
  '& button': { fontFamily: SYSTEM_FONT_STACK },
  '& > .eth-container': {
    display: 'flex',
    flexDirection: 'column',
    height: 'calc(100% - 128px)',
    margin: '128px auto 64px',
    justifyContent: 'space-between',
    position: 'relative'
  },
  '& > .eth-container > div': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%'
  },
  '& .LoginItemContainer': { margin: '0 30px' },
  ...($withDarkLayer
    ? {
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0,0,0,0.25)'
        }
      }
    : {}),
  '@media screen and (min-height: 900px)': {
    alignItems: 'flex-start',
    '& > .eth-container': {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      margin: '0 auto'
    }
  }
}))
