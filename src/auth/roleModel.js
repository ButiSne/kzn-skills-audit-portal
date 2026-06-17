const ROLE_LABELS = {
  'SkillsAudit.Respondent': 'Respondent',
  'SkillsAudit.HRAdmin': 'HR / Business Administrator',
  'SkillsAudit.SystemAdmin': 'System Administrator',
  'SkillsAudit.ReportingUser': 'Reporting User',
}

function getAccountRoles(account) {
  const roles = account?.idTokenClaims?.roles || account?.idTokenClaims?.appRoles || []
  return Array.isArray(roles) ? roles : []
}

function getRoleAccess(account) {
  const roles = new Set(getAccountRoles(account))

  return {
    canAccessForm: roles.has('SkillsAudit.Respondent') || roles.has('SkillsAudit.HRAdmin') || roles.has('SkillsAudit.SystemAdmin'),
    canAccessDashboard: roles.has('SkillsAudit.HRAdmin') || roles.has('SkillsAudit.SystemAdmin') || roles.has('SkillsAudit.ReportingUser'),
    canAdministerUsers: roles.has('SkillsAudit.SystemAdmin'),
    canManageCycles: roles.has('SkillsAudit.HRAdmin') || roles.has('SkillsAudit.SystemAdmin'),
  }
}

export { getAccountRoles, getRoleAccess, ROLE_LABELS }
