import React from 'react'
import './errors.css'
import errorImage from '../../images/errors/error-robotdown.png'

export const ErrorComms: React.FC = () => (
  <div id="error-comms" className="error-container">
    <div className="error-background" />
    <div className="errormessage">
      <div className="errortext col">
        <div className="error">Oops</div>
        <div className="communicationslink">
          A communication link could not be
          <br />
          established with other peers
        </div>
        <div className="givesomedetailof">
          This might be because you are behind a restrictive network firewall, or a temporary problem with the selected realm. <br />
          <br />
          If you have any ad blocking extensions try turning them off for this site, and then reload.
          <br />
          You can also try a different realm.
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
