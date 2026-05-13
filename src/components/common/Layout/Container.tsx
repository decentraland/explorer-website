import React from 'react'
import { ContainerEl } from './Container.styled'

export const Container: React.FC<React.HTMLAttributes<HTMLDivElement>> = (props) => (
  <ContainerEl {...props} className={['eth-container', props.className].filter(Boolean).join(' ')} />
)
