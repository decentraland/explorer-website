import { styled } from 'decentraland-ui2'

export const ErrorContainerEl = styled('div')({
  width: '100%',
  zIndex: 20,
  maxWidth: '800px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100%',
  margin: '0 auto',
  padding: '0 1rem',
  color: 'white',
  '&#error-no-mobile .error-content': {
    justifyContent: 'center',
    alignContent: 'space-around'
  },
  '&#error-no-mobile .error-content > div': {
    margin: '2rem auto',
    width: '100%',
    textAlign: 'center'
  },
  '@media screen and (max-width: 800px)': {
    overflow: 'hidden',
    '& .error-image': { display: 'none' }
  }
})

export const ErrorBackground = styled('div')({
  display: 'block',
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  top: 0,
  left: 0,
  backgroundColor: 'black',
  zIndex: -1,
  opacity: 1
})

export const ErrorContent = styled('div')({
  backgroundColor: 'rgba(255, 255, 255, 0)',
  width: '100%',
  maxWidth: '800px',
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  justifyContent: 'space-between',
  position: 'relative',
  '& > div': { display: 'inline-block' },
  '& .ui.button': { marginBottom: '1rem' }
})

export const ErrorDetailsEl = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  flex: 1,
  position: 'relative',
  paddingTop: '132px'
})

export const ErrorImageEl = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  flex: 1,
  position: 'relative',
  '& img': {
    maxHeight: '330px',
    width: 'auto',
    height: 'auto',
    margin: '0 auto',
    display: 'block'
  }
})

export const ErrorBackgroundTitle = styled('div')({
  backgroundColor: 'rgba(255, 255, 255, 0)',
  display: 'block',
  maxWidth: '100vw',
  opacity: 0.1,
  fontFamily: "'SFUIText-Heavy', '-apple-system', Helvetica, Arial, serif",
  fontWeight: 800,
  fontStyle: 'normal',
  fontSize: '180px',
  color: 'rgba(255, 255, 255, 1)',
  textAlign: 'right',
  letterSpacing: '2px',
  lineHeight: '180px',
  pointerEvents: 'none',
  position: 'absolute',
  top: 0,
  right: 0,
  userSelect: 'none'
})

export const ErrorTitle = styled('div')({
  backgroundColor: 'rgba(255, 255, 255, 0)',
  fontFamily: "'SFUIText-Heavy', '-apple-system', Helvetica, Arial, serif",
  fontWeight: 600,
  fontStyle: 'normal',
  fontSize: '18px',
  color: 'rgba(255, 255, 255, 1)',
  textAlign: 'right',
  letterSpacing: '1.1px',
  lineHeight: '25px',
  marginBottom: '25px'
})

export const ErrorDescription = styled('div')({
  backgroundColor: 'rgba(255, 255, 255, 0)',
  fontFamily: "'SFUIText-Regular', Helvetica, Arial, serif",
  fontSize: '18px',
  color: 'rgba(255, 255, 255, 1)',
  textAlign: 'right',
  fontWeight: 300,
  lineHeight: '22px',
  overflow: 'auto',
  maxHeight: '40vh',
  maxWidth: '100%',
  wordBreak: 'break-word',
  '& a, & a:visited': {
    color: 'rgba(255, 255, 255, 1)',
    textDecoration: 'none',
    fontWeight: 800
  }
})

export const ErrorCta = styled('div')({
  textAlign: 'right',
  display: 'flex',
  alignItems: 'flex-end',
  flexFlow: 'column',
  marginTop: '20px'
})

export const NoMobileTitle = styled('div')({
  backgroundColor: 'rgba(255, 255, 255, 0)',
  fontFamily: "'SFUIText-Heavy', '-apple-system', Helvetica, Arial, serif",
  fontWeight: 600,
  fontStyle: 'normal',
  fontSize: '18px',
  color: 'rgba(255, 255, 255, 1)',
  textAlign: 'center',
  letterSpacing: '1.1px',
  lineHeight: '25px',
  marginBottom: '25px'
})

export const NoMobileImage = styled('div')({
  '& img': {
    width: '100%',
    height: 'auto',
    maxWidth: '212px',
    margin: '0 auto',
    display: 'block'
  }
})
