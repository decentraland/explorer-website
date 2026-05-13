import { GlobalStyles as MuiGlobalStyles } from 'decentraland-ui2'
import sfRegular from '../fonts/SF-UI-Text-Regular.otf'

export const GlobalStyles = () => (
  <MuiGlobalStyles
    styles={{
      '@font-face': [
        { fontFamily: 'sfregular', src: `url(${sfRegular})` },
        { fontFamily: 'sfsemibold', src: `url(${sfRegular})` }
      ],
      '*': { boxSizing: 'border-box' },
      '::after, ::before': { boxSizing: 'inherit' },
      '#root': {
        position: 'absolute',
        width: '100%',
        minHeight: '100vh',
        minWidth: '990px',
        top: 0,
        left: 0,
        overflow: 'auto',
        msOverflowStyle: 'none',
        scrollbarWidth: 'none',
        display: 'block'
      },
      '#root::-webkit-scrollbar': { display: 'none' },
      '#root.full': {
        width: '100vw',
        height: '100vh',
        position: 'fixed',
        minHeight: 'auto',
        minWidth: 'auto'
      },
      '#root.hide': { display: 'none' }
    }}
  />
)
