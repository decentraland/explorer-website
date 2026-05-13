import { styled } from 'decentraland-ui2'

export const PreviewWrapper = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
  '& .WearablePreview': {
    backgroundColor: 'unset'
  }
})

export const LoaderOverlay = styled('div')({
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  pointerEvents: 'none'
})
