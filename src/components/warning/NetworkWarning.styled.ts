import { styled } from 'decentraland-ui2'

export const WarningBar = styled('div')({
  width: '100%',
  height: '50px',
  padding: '5px 0',
  position: 'absolute',
  top: 0,
  zIndex: 1001,
  backgroundColor: 'rgb(241, 163, 72)',
  boxShadow: '0 2px 5px 1px rgba(241, 163, 72, 0.9)'
})

export const WarningBarTitle = styled('div')({
  textAlign: 'center',
  fontSize: '1rem',
  marginBottom: '4px'
})

export const WarningBarDescription = styled('div')({
  textAlign: 'center',
  fontSize: '0.85rem'
})

export const WarningCloseButton = styled('button')({
  position: 'absolute',
  right: '20px',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  color: 'white',
  fontSize: '1.5rem',
  fontWeight: 600,
  cursor: 'pointer',
  border: 0,
  backgroundColor: 'transparent',
  '&:active, &:focus, &:focus:active': {
    backgroundImage: 'none',
    outline: 0,
    boxShadow: 'none'
  }
})
