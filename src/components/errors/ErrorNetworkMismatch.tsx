import React from 'react'

import './errors.css'
import errorImage from '../../images/errors/robotsmiling.png'
import { NETWORK } from '../../integration/queryParamsConfig'

export interface ErrorNetworkMismatchProps {
  details: string | null
}

export const ErrorNetworkMismatch: React.FC<ErrorNetworkMismatchProps> = (props: ErrorNetworkMismatchProps) => {
  return (
    <div id="error-networkmismatch" className="error-container">
      <div className="error-background" />
      <div className="errormessage">
        <div className="errortext col">
          <div className="communicationslink">A network mismatch was detected</div>
          <div className="givesomedetailof">
            We detected that you are trying to enter the <strong id="tld">{NETWORK}</strong> network, and your Ethereum
            wallet is set to other network.
          </div>
          <div className="givesomedetailof">
            To continue, please change the Ethereum network in your wallet to{' '}
            <strong id="web3NetGoal">{NETWORK}</strong> and click "Reload".
          </div>
          <div className="cta">
            <button
              className="retry"
              onClick={() => {
                window.location.reload()
              }}
            >
              Reload
            </button>
          </div>
        </div>
        <div className="errorimage col">
          <div className="imagewrapper">
            <img alt="" className="error-image" src={errorImage} />
          </div>
        </div>
      </div>
    </div>
  )
}
