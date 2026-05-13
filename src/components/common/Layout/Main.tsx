import React from 'react'
import { MainEl } from './Main.styled'

export type MainProps = React.PropsWithChildren<{
  withDarkLayer?: boolean
}>

export default function Main({ withDarkLayer, ...props }: MainProps) {
  return <MainEl {...props} $withDarkLayer={withDarkLayer} className="Main" />
}
