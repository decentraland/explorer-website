import { styled } from 'decentraland-ui2'
import bannerClose from '../../images/banner-close.svg'

export const BannerWrap = styled('div')({
  backgroundColor: '#272727',
  color: 'white',
  position: 'relative',
  '&::after': {
    content: '""',
    display: 'block',
    position: 'absolute',
    background: 'linear-gradient(90.07deg, #FF2D55 1.61%, #FFBC5B 43.3%, #CA38CD 70.1%, #740CB4 96.9%)',
    width: '100%',
    height: '2px',
    bottom: 0
  }
})

export const BannerText = styled('div')({
  textAlign: 'center',
  padding: '10px 37px',
  fontWeight: 600,
  fontSize: '14px',
  lineHeight: '17px',
  '& a': {
    color: 'white',
    textDecoration: 'underline'
  }
})

export const BannerCloseButton = styled('div')({
  position: 'absolute',
  width: '37px',
  height: '37px',
  borderRadius: '100%',
  top: 0,
  right: 0,
  cursor: 'pointer',
  background: `url(${bannerClose}) center center no-repeat`
})
