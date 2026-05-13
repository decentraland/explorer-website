import { styled } from 'decentraland-ui2'

export const WarningWrap = styled('div')({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 9999999
})

export const WarningCard = styled('div')({
  boxSizing: 'border-box',
  width: '800px',
  height: 'auto',
  position: 'relative',
  background: '#161518',
  color: 'white',
  borderRadius: '20px',
  padding: '64px',
  display: 'flex',
  flexDirection: 'column',
  textAlign: 'center',
  justifyContent: 'center',
  '& h2': {
    color: 'white',
    fontWeight: 500,
    fontSize: '28px'
  },
  '& p': {
    color: 'white',
    fontSize: '18px'
  },
  '& .MuiButton-root': {
    marginTop: '18px',
    borderRadius: '10px'
  }
})
