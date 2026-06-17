import React from 'react'
import ReactDOM from 'react-dom/client'
import { PublicClientApplication } from '@azure/msal-browser'
import { MsalProvider } from '@azure/msal-react'
import SecureApp from './SecureApp'
import { msalConfig } from './authConfig'
import './styles.css'

const msalInstance = new PublicClientApplication(msalConfig)

void msalInstance.initialize().catch((error) => {
  console.error('MSAL initialization failed:', error)
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance}>
      <SecureApp />
    </MsalProvider>
  </React.StrictMode>,
)
