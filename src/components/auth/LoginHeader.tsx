import React from 'react'
import { MainIsologotipo } from '../common/MainIsologotipo'
import './LoginHeader.css'

export const LoginHeader: React.FC = () => (
  <div className="eth-login-description">
    <MainIsologotipo />
    <p className="login-header-inmerse-dialog">
      Immerse yourself into the first virtual world fully owned by its users.
    </p>
  </div>
)
