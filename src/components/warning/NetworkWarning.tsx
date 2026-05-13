import React from 'react'
import { WarningBar, WarningBarTitle, WarningBarDescription, WarningCloseButton } from './NetworkWarning.styled'
import { useFormatMessage } from '../../hooks/useFormatMessage'

export interface NetworkWarningProps {
  onClose: () => void
}

export const NetworkWarning: React.FC<NetworkWarningProps> = ({ onClose }) => {
  const l = useFormatMessage()
  return (
    <WarningBar id="network-warning">
      <WarningBarTitle>
        <strong>{l('network_warning.label')}</strong> {l('network_warning.title')}
      </WarningBarTitle>
      <WarningBarDescription>
        {l('network_warning.description', { network: l('network_warning.sepolia') })}
      </WarningBarDescription>
      <WarningCloseButton onClick={onClose}>⨯</WarningCloseButton>
    </WarningBar>
  )
}
