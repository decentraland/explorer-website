import React, { useMemo } from 'react'
import { connect } from 'react-redux'
import { Button } from 'decentraland-ui2'
import { withoutCatalyst } from '../../integration/url'
import { setCatalystAsTrusted } from '../../state/actions'
import { CatalystState, StoreType } from '../../state/redux'
import { track } from '../../utils/tracking'
import { CatalystWarning } from '../common/Icon/CatalystWarning'
import { Container } from '../common/Layout/Container'
import Main from '../common/Layout/Main'
import { WarningWrap, WarningCard } from './CatalystWarningContainer.styled'
import { useFormatMessage } from '../../hooks/useFormatMessage'

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
  const l = useFormatMessage()
  const catalyst = useMemo(() => {
    try {
      const url = new URL(props.catalyst!)
      return url.host
    } catch (err) {
      return props.catalyst
    }
  }, [props.catalyst])

  return (
    <Main withDarkLayer>
      <Container>
        <WarningWrap>
          <WarningCard>
            <div>
              <CatalystWarning />
            </div>
            <h2>{l('catalyst_warning.title')}</h2>
            <p>
              {l('catalyst_warning.risk_line')}
              <br />
              {l('catalyst_warning.trust_question', { catalyst: catalyst || '' })}
            </p>
            <div>
              <Button variant="contained" color="secondary" onClick={props.onConfirm}>
                {l('catalyst_warning.trust_cta', { catalyst: catalyst || '' })}
              </Button>
            </div>
            <div>
              <Button variant="contained" color="primary" onClick={props.onCancel}>
                {l('catalyst_warning.cancel_cta')}
              </Button>
            </div>
          </WarningCard>
        </WarningWrap>
      </Container>
    </Main>
  )
})

export default connect(mapStateToProps, mapDispatchToProps)(CatalystWarningContainer)
