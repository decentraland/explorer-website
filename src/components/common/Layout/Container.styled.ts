import { styled } from 'decentraland-ui2'

const SYSTEM_FONT_STACK =
  "-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"

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
