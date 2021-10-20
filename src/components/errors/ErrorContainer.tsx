import React from 'react'
import { connect } from 'react-redux'
import { setKernelError } from '../../state/actions'
import { disconnect } from '../../eth/provider'
import { ErrorState, ErrorType, StoreType } from '../../state/redux'
import { ErrorAvatarLoading } from './ErrorAvatarLoading'
import { ErrorComms } from './ErrorComms'
import { ErrorFatal } from './ErrorFatal'
import { ErrorMetamaskLocked } from './ErrorMetamaskLocked'
import { ErrorNetworkMismatch } from './ErrorNetworkMismatch'
import { ErrorNewLogin } from './ErrorNewLogin'
import { ErrorNoMobile } from './ErrorNoMobile'
import { ErrorNotSupported } from './ErrorNotSupported'
import { FeatureFlags, getFeatureVariant } from '../../state/selectors'
import StreamContainer from '../common/StreamContainer'

const mapStateToProps = (state: StoreType): Pick<ErrorContainerProps, 'error' | 'stream'> => {
  return {
    stream: getFeatureVariant(state, FeatureFlags.Stream),
    error: state.error.error || null
  }
}

const mapDispatchToProps = (dispatch: (a: any) => void, state: StoreType): Pick<ErrorContainerProps, 'closeError' | 'onLogout'> => {
  return {
    closeError: () => dispatch(setKernelError(null)),
    onLogout: () => disconnect()
  }
}

export interface ErrorContainerProps {
  stream?: string,
  error: ErrorState['error']
  onLogout(): void
  closeError(): void
}

export const ErrorContainer: React.FC<ErrorContainerProps> = (props) => {
  if (!props.error) return <React.Fragment></React.Fragment>

  if (props.error.type === ErrorType.COMMS) return <ErrorComms />
  if (props.error.type === ErrorType.METAMASK_LOCKED)
    return <ErrorMetamaskLocked details={props.error.details} closeError={props.closeError} />
  if (props.error.type === ErrorType.NEW_LOGIN) return <ErrorNewLogin />
  if (props.error.type === ErrorType.NOT_MOBILE) {
    if (!!props.stream) {
      return <StreamContainer />
    }
    return <ErrorNoMobile />
  }
  if (props.error.type === ErrorType.NOT_SUPPORTED) return <ErrorNotSupported />
  if (props.error.type === ErrorType.NET_MISMATCH)
    return <ErrorNetworkMismatch details={props.error.details} onLogout={props.onLogout} />
  if (props.error.type === ErrorType.AVATAR_ERROR) return <ErrorAvatarLoading />

  return (
    <React.Fragment>
      <ErrorFatal details={[props.error.details || 'An error happened while loading Decentraland.']} />
    </React.Fragment>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(ErrorContainer)
