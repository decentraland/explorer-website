import React from 'react'
import classNames from '../../../utils/classNames'
import './Main.css'

export type MainProps = React.PropsWithChildren<{
  withDarkLayer?: boolean
}>

export default function Main({ withDarkLayer, ...props }: MainProps) {
  return <main {...props} className={classNames([ 'Main', withDarkLayer && 'withDarkLayer' ])} />
}