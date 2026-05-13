import { styled } from 'decentraland-ui2'

export const LoadingEl = styled('div')({
  display: 'flex',
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#000000'
})

export const LoadingVideo = styled('video')({
  display: 'block',
  position: 'relative',
  paddingBottom: '60px',
  boxSizing: 'content-box'
})

export const LoadingCaption = styled('p')({
  position: 'absolute',
  textAlign: 'center',
  width: '100%',
  left: 0,
  bottom: '34px',
  fontSize: '15px',
  lineHeight: '23px',
  color: '#716B7C',
  fontWeight: 'bold'
})
