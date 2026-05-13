import { styled } from 'decentraland-ui2'

export const LogoEl = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  fontSize: '24px',
  lineHeight: '29px',
  color: 'white',
  '& p': {
    color: 'white',
    marginTop: '10px',
    fontSize: '24px',
    lineHeight: '29px',
    fontWeight: 300,
    letterSpacing: '1px'
  },
  '@media screen and (min-height: 900px)': {
    marginTop: '14vh',
    marginBottom: '6vh'
  }
})
