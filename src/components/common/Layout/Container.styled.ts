import { styled } from 'decentraland-ui2'
import { SYSTEM_FONT_STACK } from '../../../theme/constants'

export const ContainerEl = styled('div')({
  width: '100%',
  margin: '0 auto',
  fontFamily: SYSTEM_FONT_STACK,
  '@media only screen and (min-width: 1200px)': {
    width: '1124px'
  },
  '@media only screen and (max-width: 1199px) and (min-width: 990px)': {
    width: '933px'
  }
})
