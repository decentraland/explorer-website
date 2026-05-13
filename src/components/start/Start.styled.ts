import { styled, Button, Dialog, IconButton } from 'decentraland-ui2'
import backgroundV4 from '../../images/background-v4.jpg'
import launchDesktop from './images/launch-desktop.svg'
import { CommunityBubble } from '../common/CommunityBubble'

export const StartRoot = styled('div')({
  position: 'fixed',
  width: '100vw',
  height: '100vh',
  backgroundImage: `url(${backgroundV4})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat',
  display: 'flex',
  alignItems: 'center'
})

export const StartLoader = styled('div')({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundImage: `url(${backgroundV4})`,
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  backgroundRepeat: 'no-repeat'
})

export const StartBannerContainer = styled('div')({
  position: 'absolute',
  top: 0,
  width: '100%'
})

export const StartInfo = styled('div')({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  padding: '150px',
  paddingRight: '40px',
  height: '100%'
})

export const StartLinks = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  gap: '20px'
})

export const StartTitle = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  color: 'white',
  fontSize: '30px',
  lineHeight: 'normal',
  marginBottom: '20px',
  letterSpacing: '1px'
})

export const DesktopDownload = styled('div')({
  color: 'white',
  display: 'flex',
  flexDirection: 'column',
  fontSize: '18px',
  fontWeight: 300,
  gap: '10px',
  borderTop: '1px solid white',
  paddingTop: '20px',
  width: 'fit-content',
  letterSpacing: '1px',
  '& a span': {
    textDecoration: 'underline',
    color: 'white'
  }
})

export const StartWearablePreview = styled('div')({
  height: '100%',
  width: '50%',
  position: 'relative',
  right: '8%'
})

export const PrimaryButton = styled(Button)({
  width: '300px',
  minHeight: '52px',
  padding: '14px 28px',
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '0.5px',
  display: 'flex',
  justifyContent: 'center',
  textTransform: 'uppercase'
})

export const InvertedButton = styled(Button)({
  width: '300px',
  minHeight: '52px',
  padding: '14px 28px',
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '0.5px',
  display: 'flex',
  justifyContent: 'center',
  textTransform: 'uppercase',
  color: 'white',
  borderColor: 'white',
  '&:hover': {
    borderColor: 'white',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
})

export const BottomCommunityBubble = styled(CommunityBubble)({
  position: 'absolute',
  bottom: '20px',
  right: '20px'
})

export const AlphaDialog = styled(Dialog)({
  '& .MuiDialog-paper': {
    width: '480px',
    maxWidth: '480px',
    borderRadius: '12px',
    padding: '32px',
    backgroundColor: 'white',
    backgroundImage: 'none',
    color: '#161518'
  },
  '& .MuiBackdrop-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  }
})

export const AlphaHeader = styled('div')({
  textAlign: 'center',
  marginBottom: '24px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center'
})

export const AlphaIcon = styled('div')({
  backgroundImage: `url(${launchDesktop})`,
  backgroundSize: 'contain',
  backgroundRepeat: 'no-repeat',
  backgroundPosition: 'center',
  width: '225px',
  height: '150px',
  marginBottom: '12px'
})

export const AlphaTitle = styled('p')({
  fontSize: '32px',
  fontWeight: 700,
  lineHeight: '39.52px',
  textAlign: 'center',
  marginBottom: '24px',
  color: '#161518'
})

export const AlphaText = styled('p')({
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  textAlign: 'center',
  color: '#5d5b67',
  marginBottom: '24px'
})

export const AlphaActions = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignSelf: 'stretch',
  gap: '8px'
})

export const ModalButton = styled(Button)({
  width: '100%',
  minHeight: '48px',
  padding: '12px 24px',
  fontSize: '15px',
  fontWeight: 600,
  letterSpacing: '0.5px',
  textTransform: 'uppercase'
})

export const AlphaCloseButton = styled(IconButton)({
  position: 'absolute',
  top: '12px',
  right: '12px',
  width: '36px',
  height: '36px',
  color: '#161518',
  '&:hover': {
    backgroundColor: 'rgba(22, 21, 24, 0.05)'
  }
})
