import { LogLevel } from '@azure/msal-browser'

const env = import.meta.env

export const msalConfig = {
  auth: {
    clientId: env.VITE_ENTRA_CLIENT_ID || '',
    authority: env.VITE_ENTRA_TENANT_ID
      ? `https://login.microsoftonline.com/${env.VITE_ENTRA_TENANT_ID}`
      : undefined,
    redirectUri: env.VITE_ENTRA_REDIRECT_URI || window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
  system: {
    loggerOptions: {
      loggerCallback: (level, message, containsPii) => {
        if (containsPii) {
          return
        }

        if (level === LogLevel.Error) {
          console.error(`[MSAL] ${message}`)
        } else if (level === LogLevel.Info || level === LogLevel.Warning) {
          console.info(`[MSAL] ${message}`)
        }
      },
      logLevel: LogLevel.Info,
      piiLoggingEnabled: false,
    },
  },
}

export const loginRequest = {
  scopes: ['User.Read'],
}
