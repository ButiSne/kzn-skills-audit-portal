import React from 'react'
import { AuthenticatedTemplate, UnauthenticatedTemplate, useIsAuthenticated, useMsal } from '@azure/msal-react'
import App from './App'
import { loginRequest } from './authConfig'
import { getAccountRoles, getRoleAccess, ROLE_LABELS } from './auth/roleModel'

function SignInPanel() {
  const { instance } = useMsal()

  const handleLogin = async () => {
    await instance.loginRedirect(loginRequest)
  }

  return (
    <div className="auth-wrap">
      <section className="auth-panel">
        <img src="/transport-logo.png" alt="KwaZulu-Natal Department of Transport logo" className="auth-logo" />
        <p className="eyebrow">KwaZulu-Natal Province</p>
        <h1>Department of Transport</h1>
        <p className="auth-copy">
          Sign in with your Microsoft Entra ID account to access the Skills Audit questionnaire and administrator dashboard.
        </p>
        <button className="primary-button" onClick={handleLogin}>Sign in with Microsoft</button>
        <div className="auth-note">
          <strong>Configuration required</strong>
          <span>Populate the VITE_ENTRA_CLIENT_ID, VITE_ENTRA_TENANT_ID and VITE_ENTRA_REDIRECT_URI values in your environment file before deployment.</span>
        </div>
      </section>
    </div>
  )
}

function AuthBanner() {
  const { instance, accounts } = useMsal()
  const isAuthenticated = useIsAuthenticated()
  const account = accounts?.[0]
  const name = account?.name || account?.username || 'Authenticated user'
  const roleNames = getAccountRoles(account).map((role) => ROLE_LABELS[role] || role)

  if (!isAuthenticated) return null

  return (
    <div className="page-wrap auth-banner-wrap">
      <div className="auth-banner">
        <div>
          <span className="eyebrow green">Microsoft Entra ID</span>
          <strong>{name}</strong>
          <div className="role-chip-row">
            {roleNames.length > 0 ? roleNames.map((role) => <span className="role-chip" key={role}>{role}</span>) : <span className="role-chip muted">No app role assigned</span>}
          </div>
        </div>
        <button className="ghost-button compact" onClick={() => instance.logoutRedirect()}>Sign out</button>
      </div>
    </div>
  )
}

function AccessDeniedPanel() {
  return (
    <div className="page-wrap">
      <section className="panel access-denied-panel">
        <h2>Access assignment required</h2>
        <p>
          Your Microsoft Entra ID account is authenticated, but no application role has been assigned for this solution.
          Ask the System Administrator to assign one of the supported roles before you proceed.
        </p>
        <ul>
          <li>SkillsAudit.Respondent</li>
          <li>SkillsAudit.HRAdmin</li>
          <li>SkillsAudit.SystemAdmin</li>
          <li>SkillsAudit.ReportingUser</li>
        </ul>
      </section>
    </div>
  )
}

export default function SecureApp() {
  const { accounts } = useMsal()
  const account = accounts?.[0]
  const access = getRoleAccess(account)
  const hasAnyAccess = access.canAccessForm || access.canAccessDashboard || access.canAdministerUsers

  return (
    <>
      <UnauthenticatedTemplate>
        <SignInPanel />
      </UnauthenticatedTemplate>

      <AuthenticatedTemplate>
        <AuthBanner />
        {hasAnyAccess ? <App access={access} /> : <AccessDeniedPanel />}
      </AuthenticatedTemplate>
    </>
  )
}
