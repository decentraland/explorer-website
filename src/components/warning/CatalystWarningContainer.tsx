import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Button } from 'decentraland-ui/dist/components/Button/Button'
import { withoutCatalyst } from '../../integration/url'
import { setCatalystAsTrusted } from '../../state/actions'
import { CatalystState, StoreType } from '../../state/redux'
import { track } from '../../utils/tracking'
import { CatalystWarning } from '../common/Icon/CatalystWarning'
import { Container } from '../common/Layout/Container'
import Main from '../common/Layout/Main'
import { Navbar } from '../common/Layout/Navbar'

import './CatalystWarningContainer.css'

export type CatalystWarningProps = CatalystState & {
  onConfirm: () => void
  onCancel: () => void
}

function mapStateToProps(state: StoreType) {
  return {
    ...state.catalyst
  }
}

const mapDispatchToProps = (dispatch: any) => ({
  onConfirm: () => {
    track('trust_catalyst')
    dispatch(setCatalystAsTrusted())
  },
  onCancel: () => {
    track('clear_catalyst')
    window.location.href = withoutCatalyst()
  }
})

export const CatalystWarningContainer = React.memo((props: CatalystWarningProps) => {
  const catalyst = useMemo(() => {
    try {
      const url = new URL(props.catalyst!)
      return url.host
    } catch (err) {
      return props.catalyst
    }
  }, [ props.catalyst ])

  return <Main withDarkLayer>
    <Navbar />
    <Container>
      <div className="catalyst-warning-container">
        <div className="catalyst-warning-content">
          <div><CatalystWarning /></div>
          <h2>You are about to use a custom Catalyst</h2>
          <p>Using a custom catalyst can be risky as scenes code can be altered.<br />Are you sure you trust <strong><i>{catalyst}</i></strong>?</p>
          <div>
            <Button secondary onClick={props.onConfirm}>trust {catalyst}</Button>
          </div>
          <div>
            <Button primary onClick={props.onCancel}>take me out</Button>
          </div>
        </div>
      </div>
    </Container>
  </Main>
})

export default connect(mapStateToProps, mapDispatchToProps)(CatalystWarningContainer)
