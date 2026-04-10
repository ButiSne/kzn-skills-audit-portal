import React, { useMemo, useState } from 'react'

const dashboardCards = [
  { label: 'Identified Employees', value: '4,862' },
  { label: 'Completed', value: '3,914' },
  { label: 'Outstanding', value: '948' },
  { label: 'Current Cycle', value: '2025 Skills Audit' },
]

const departmentData = [
  { name: 'Transport', completion: 91, outstanding: 64 },
  { name: 'Health', completion: 83, outstanding: 171 },
  { name: 'Education', completion: 78, outstanding: 312 },
  { name: 'Provincial Treasury', completion: 96, outstanding: 12 },
  { name: 'Office of the Premier', completion: 88, outstanding: 19 },
  { name: 'Public Works', completion: 81, outstanding: 77 },
]

const reportItems = [
  'Overall completion dashboard',
  'Completion by department',
  'Completion by branch or chief directorate',
  'Qualification profile analysis',
  'Field of study analysis',
  'Salary level distribution',
  'Gender distribution',
  'Race distribution',
  'Disability declaration summary',
  'Training needs summary',
  'Competency gap summary',
  'Career aspiration summary',
]

const departmentOptions = [
  'Agriculture and Rural Development',
  'Community Safety and Liaison',
  'Cooperative Governance and Traditional Affairs',
  'Economic Development Tourism and Environmental Affairs',
  'Education',
  'Health',
  'Human Settlements',
  'Office of the Premier',
  'Provincial Treasury',
  'Public Works',
  'Social Development',
  'Sport Arts and Culture',
  'Transport',
]

const fieldOfStudyOptions = [
  'Agricultural and Environmental Sciences',
  'Arts and Creative Studies',
  'Business, Economics, and Management Sciences',
  'Education',
  'Engineering',
  'Humanities / Social Sciences',
  'Information Technology',
  'Interdisciplinary Studies',
  'Law',
  'Medicine and Health Sciences',
  'Natural Sciences',
  'Other',
]

const defaultForm = {
  fullNames: '',
  persalNumber: '',
  idType: 'South African ID',
  countryOfOrigin: '',
  idNumber: '',
  ageCategory: '',
  race: '',
  gender: '',
  disability: 'No',
  disabilityType: '',
  salaryLevel: '',
  highestEducationLevel: '',
  highestQualification: '',
  highestInstitution: '',
  highestYear: '',
  highestField: '',
  qualification1: '',
  institution1: '',
  year1: '',
  field1: '',
  qualification2: '',
  institution2: '',
  year2: '',
  field2: '',
  qualification3: '',
  institution3: '',
  year3: '',
  field3: '',
  department: 'Transport',
  employmentType: 'Permanent',
  jobTitle: '',
  branch: '',
  chiefDirectorate: '',
  directorate: '',
  subDirectorate: '',
  yearsInPublicService: '',
  employer1: '',
  jobTitle1: '',
  period1: '',
  employer2: '',
  jobTitle2: '',
  period2: '',
  employer3: '',
  jobTitle3: '',
  period3: '',
  additionalTraining: 'No',
  trainingDescription: '',
  professionalMember: 'No',
  professionalBodyName: '',
  hasRequiredSkills: 'Yes',
  skillsNeeded: '',
  nextCareerGoal: '',
  projectedRetirementAge: '',
  additionalInformation: '',
  declarationAccepted: false,
}

const sectionLabels = [
  'Personal Particulars',
  'Education',
  'Employment Particulars',
  'Work Experience',
  'Learning Audit',
  'Professional Registration',
  'Competency Assessment and Career Progression',
  'Conclusion and Declaration',
]

function App({ access = { canAccessForm: true, canAccessDashboard: true, canAdministerUsers: true } }) {
  const defaultView = access.canAccessForm ? 'form' : 'dashboard'
  const [activeView, setActiveView] = useState(defaultView)
  return (
    <div className="app-shell">
      <PortalHeader activeView={activeView} setActiveView={setActiveView} access={access} />
      <main className="page-wrap">
        {activeView === 'form' ? <SkillsAuditForm /> : <AdminDashboard access={access} />}
      </main>
    </div>
  )
}

function PortalHeader({ activeView, setActiveView, access }) {
  return (
    <header className="portal-header">
      <div className="brand-block">
        <img src="/transport-logo.png" alt="KwaZulu-Natal Department of Transport logo" className="brand-logo" />
        <div>
          <p className="eyebrow">KwaZulu-Natal Province</p>
          <h1>Department of Transport</h1>
          <p className="subtitle">Generic Skills Audit digital portal prototype</p>
        </div>
      </div>

      <div className="top-meta-grid">
        <div className="meta-card">
          <span>Portal Status</span>
          <strong>Prototype</strong>
        </div>
        <div className="meta-card">
          <span>Current Cycle</span>
          <strong>2025 Skills Audit</strong>
        </div>
        <div className="meta-card">
          <span>Access Model</span>
          <strong>Role Based</strong>
        </div>
        <div className="meta-card">
          <span>Exports</span>
          <strong>Excel / PDF</strong>
        </div>
      </div>

      <div className="view-switcher">
        {access?.canAccessForm && (
          <button
            className={activeView === 'form' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveView('form')}
          >
            Live Government Form
          </button>
        )}
        {access?.canAccessDashboard && (
          <button
            className={activeView === 'dashboard' ? 'tab-button active' : 'tab-button'}
            onClick={() => setActiveView('dashboard')}
          >
            Administrator Dashboard
          </button>
        )}
      </div>
    </header>
  )
}

function AdminDashboard({ access = {} }) {
  return (
    <section className="dashboard-grid">
      <div className="dashboard-summary-grid">
        {dashboardCards.map((card) => (
          <article className="panel stat-panel" key={card.label}>
            <span>{card.label}</span>
            <strong>{card.value}</strong>
          </article>
        ))}
      </div>

      <article className="panel role-model-panel">
        <div className="panel-heading-row">
          <div>
            <h2>Application role model</h2>
            <p>This application provides open access to both the questionnaire form and administrator dashboard.</p>
          </div>
        </div>
        <div className="role-model-grid">
          <div className="role-model-card">
            <span className="role-title">Respondent</span>
            <p>Complete and submit the questionnaire for the assigned audit cycle.</p>
          </div>
          <div className="role-model-card">
            <span className="role-title">HR / Business Administrator</span>
            <p>Manage employee loads, audit cycles, reopen cases and operational reporting.</p>
          </div>
          <div className="role-model-card">
            <span className="role-title">System Administrator</span>
            <p>Manage reference data, platform settings, role assignment model and audit controls.</p>
          </div>
          <div className="role-model-card">
            <span className="role-title">Reporting User</span>
            <p>Access dashboard views and exports on a read-only basis.</p>
          </div>
        </div>
        <div className="role-access-summary">
          <span className={access.canAccessForm ? 'access-pill success' : 'access-pill'}>Form Access: {access.canAccessForm ? 'Enabled' : 'Not Assigned'}</span>
          <span className={access.canAccessDashboard ? 'access-pill success' : 'access-pill'}>Dashboard Access: {access.canAccessDashboard ? 'Enabled' : 'Not Assigned'}</span>
          <span className={access.canManageCycles ? 'access-pill success' : 'access-pill'}>Cycle Admin: {access.canManageCycles ? 'Enabled' : 'Not Assigned'}</span>
          <span className={access.canAdministerUsers ? 'access-pill success' : 'access-pill'}>System Admin: {access.canAdministerUsers ? 'Enabled' : 'Not Assigned'}</span>
        </div>
      </article>

      <article className="panel wide-panel">
        <div className="panel-heading-row">
          <div>
            <h2>Completion dashboard by department</h2>
            <p>Monitor completion, outstanding submissions and operational pressure points.</p>
          </div>
          <button className="ghost-button">Refresh view</button>
        </div>

        <div className="filter-row">
          <select defaultValue="All Departments">
            <option>All Departments</option>
            <option>Transport</option>
            <option>Education</option>
            <option>Health</option>
            <option>Provincial Treasury</option>
          </select>
          <select defaultValue="Current Cycle">
            <option>Current Cycle</option>
            <option>2025 Skills Audit</option>
            <option>2024 Skills Audit</option>
          </select>
          <select defaultValue="All Statuses">
            <option>All Statuses</option>
            <option>Completed</option>
            <option>Outstanding</option>
            <option>Reopened</option>
          </select>
          <button className="primary-button small">Apply Filter</button>
        </div>

        <div className="progress-list">
          {departmentData.map((item) => (
            <div key={item.name} className="progress-item">
              <div className="progress-item-head">
                <div>
                  <h3>{item.name}</h3>
                  <p>Outstanding employees: {item.outstanding}</p>
                </div>
                <div className="status-pill">{item.completion}% complete</div>
              </div>
              <div className="progress-bar-track">
                <div className="progress-bar-fill" style={{ width: `${item.completion}%` }} />
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="panel">
        <div className="panel-heading-row">
          <div>
            <h2>Administrative actions</h2>
            <p>Operational tools for cycle management and submission control.</p>
          </div>
        </div>
        <div className="action-grid">
          <button className="primary-button">Create Audit Cycle</button>
          <button className="ghost-button">Upload Target Employees</button>
          <button className="ghost-button">Reopen Submission</button>
          <button className="ghost-button">Send Reminder Notices</button>
          <button className="ghost-button">Export Audit Log</button>
          <button className="ghost-button">Manage Reference Data</button>
        </div>
      </article>

      <article className="panel">
        <div className="panel-heading-row">
          <div>
            <h2>Reports and exports</h2>
            <p>Read-only and administrator reporting outputs.</p>
          </div>
        </div>
        <div className="report-list">
          {reportItems.map((item) => (
            <div key={item} className="report-row">
              <span>{item}</span>
              <div className="row-actions">
                <button className="ghost-button compact">Excel</button>
                <button className="ghost-button compact">PDF</button>
              </div>
            </div>
          ))}
        </div>
      </article>

      <article className="panel wide-panel">
        <div className="panel-heading-row">
          <div>
            <h2>Role-based user model</h2>
            <p>Functional responsibilities aligned to the requirements.</p>
          </div>
        </div>
        <div className="role-grid">
          <div className="role-card">
            <h3>Respondent</h3>
            <p>Completes and submits the questionnaire against an identified employee profile.</p>
          </div>
          <div className="role-card">
            <h3>HR / Business Administrator</h3>
            <p>Creates questionnaire cycles, loads target employees, monitors progress and generates reports.</p>
          </div>
          <div className="role-card">
            <h3>System Administrator</h3>
            <p>Manages user access, reference data, parameters and audit logs.</p>
          </div>
          <div className="role-card">
            <h3>Reporting User</h3>
            <p>Accesses dashboards and exports on a read-only basis.</p>
          </div>
        </div>
      </article>
    </section>
  )
}

function SkillsAuditForm() {
  const [activeSection, setActiveSection] = useState(0)
  const [form, setForm] = useState(defaultForm)
  const [message, setMessage] = useState('')

  const progress = useMemo(() => Math.round(((activeSection + 1) / sectionLabels.length) * 100), [activeSection])

  function updateField(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function nextSection() {
    setActiveSection((prev) => Math.min(prev + 1, sectionLabels.length - 1))
    setMessage('')
  }

  function previousSection() {
    setActiveSection((prev) => Math.max(prev - 1, 0))
    setMessage('')
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!form.declarationAccepted) {
      setMessage('The declaration must be accepted before final submission.')
      return
    }
    const referenceNumber = `SKA-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 100000)).padStart(5, '0')}`
    setMessage(`Submission successful. Reference number: ${referenceNumber}`)
  }

  return (
    <section className="form-layout">
      <aside className="panel side-nav-panel">
        <div className="section-nav-head">
          <h2>Questionnaire Flow</h2>
          <p>Government-style section navigation with visible progress.</p>
        </div>
        <div className="completion-block">
          <div className="completion-meta">
            <span>Completion progress</span>
            <strong>{progress}%</strong>
          </div>
          <div className="progress-bar-track slim">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="section-nav-list">
          {sectionLabels.map((section, index) => (
            <button
              key={section}
              className={activeSection === index ? 'section-link active' : 'section-link'}
              onClick={() => {
                setActiveSection(index)
                setMessage('')
              }}
            >
              <span>{section}</span>
              <strong>{index + 1}</strong>
            </button>
          ))}
        </div>
      </aside>

      <form className="panel form-panel" onSubmit={handleSubmit}>
        <div className="form-banner">
          <div className="form-brand-row">
            <img src="/transport-logo.png" alt="KwaZulu-Natal Department of Transport logo" className="form-logo" />
            <div>
              <p className="eyebrow green">KwaZulu-Natal Province</p>
              <h2>Generic Skills Audit Questionnaire</h2>
              <p>Department of Transport</p>
            </div>
          </div>
          <div className="cycle-badge">Active cycle: 2025 Skills Audit</div>
        </div>

        <div className="notice-block">
          <h3>Introduction</h3>
          <p>
            The Skills Audit is intended to evaluate the knowledge, skills and experience of employees within the
            Provincial Administration. Its purpose is also to identify gaps that must be addressed to support the
            effective delivery of the Provincial Government’s mandate and objectives. All information gathered will be
            treated with strict confidentiality.
          </p>
          <p className="notice-strong">It is compulsory for identified employees to complete the questionnaire.</p>
        </div>

        {activeSection === 0 && <SectionA form={form} updateField={updateField} />}
        {activeSection === 1 && <SectionB form={form} updateField={updateField} />}
        {activeSection === 2 && <SectionC form={form} updateField={updateField} />}
        {activeSection === 3 && <SectionD form={form} updateField={updateField} />}
        {activeSection === 4 && <SectionE form={form} updateField={updateField} />}
        {activeSection === 5 && <SectionF form={form} updateField={updateField} />}
        {activeSection === 6 && <SectionG form={form} updateField={updateField} />}
        {activeSection === 7 && <SectionH form={form} updateField={updateField} />}

        {message ? <div className={message.startsWith('Submission successful') ? 'success-box' : 'error-box'}>{message}</div> : null}

        <div className="form-footer-actions">
          <button type="button" className="ghost-button" onClick={previousSection} disabled={activeSection === 0}>
            Previous
          </button>
          {activeSection < sectionLabels.length - 1 ? (
            <button type="button" className="primary-button" onClick={nextSection}>
              Next Section
            </button>
          ) : (
            <button type="submit" className="primary-button">
              Submit Questionnaire
            </button>
          )}
        </div>
      </form>
    </section>
  )
}

function SectionA({ form, updateField }) {
  return (
    <div className="section-wrap">
      <SectionHeader
        title="Section A: Personal Particulars"
        description="You are requested to respond to the following questions by completing the required information or selecting the appropriate option."
      />
      <div className="form-grid two-col">
        <Field label="1. Surname and full names">
          <input value={form.fullNames} onChange={(e) => updateField('fullNames', e.target.value)} placeholder="Example: Mkhize Emmanuel Sipho" />
        </Field>
        <Field label="2. PERSAL number">
          <input value={form.persalNumber} onChange={(e) => updateField('persalNumber', e.target.value.replace(/[^0-9]/g, ''))} placeholder="Numeric only" />
        </Field>
      </div>

      <Field label="3. ID type">
        <RadioGroup name="idType" value={form.idType} onChange={(value) => updateField('idType', value)} options={['South African ID', 'Passport']} />
      </Field>

      {form.idType === 'Passport' && (
        <Field label="4. Country of origin">
          <input value={form.countryOfOrigin} onChange={(e) => updateField('countryOfOrigin', e.target.value)} />
        </Field>
      )}

      <div className="form-grid two-col">
        <Field label="5. ID or Passport number">
          <input value={form.idNumber} onChange={(e) => updateField('idNumber', e.target.value)} />
        </Field>
        <Field label="6. Age category">
          <select value={form.ageCategory} onChange={(e) => updateField('ageCategory', e.target.value)}>
            <option value="">Select age category</option>
            <option>Below 35</option>
            <option>35 - 44</option>
            <option>45 - 54</option>
            <option>55 - 60</option>
            <option>61 - 65</option>
          </select>
        </Field>
      </div>

      <Field label="7. Racial identity">
        <RadioGroup name="race" value={form.race} onChange={(value) => updateField('race', value)} options={['Black', 'White', 'Indian', 'Coloured', 'Other']} />
      </Field>

      <Field label="8. Gender">
        <RadioGroup name="gender" value={form.gender} onChange={(value) => updateField('gender', value)} options={['Male', 'Female', 'Other']} />
      </Field>

      <Field label="9. Do you have a disability?">
        <RadioGroup name="disability" value={form.disability} onChange={(value) => updateField('disability', value)} options={['Yes', 'No']} />
      </Field>

      {form.disability === 'Yes' && (
        <Field label="10. Please indicate your disability">
          <RadioGroup
            name="disabilityType"
            value={form.disabilityType}
            onChange={(value) => updateField('disabilityType', value)}
            options={['Physical', 'Sensory (Visual / Hearing)', 'Intellectual', 'Psychosocial', 'Neurological', 'Other']}
          />
        </Field>
      )}

      <Field label="11. Salary level">
        <select value={form.salaryLevel} onChange={(e) => updateField('salaryLevel', e.target.value)}>
          <option value="">Select salary level</option>
          {Array.from({ length: 16 }).map((_, index) => {
            const level = String(index + 1)
            return (
              <option key={level} value={level}>
                {level}
              </option>
            )
          })}
        </select>
      </Field>
    </div>
  )
}

function SectionB({ form, updateField }) {
  return (
    <div className="section-wrap">
      <SectionHeader title="Section B: Education" description="Education details include highest education level, highest qualification and up to three additional post-school qualifications." />
      <div className="form-grid two-col">
        <Field label="12. Highest level of education">
          <select value={form.highestEducationLevel} onChange={(e) => updateField('highestEducationLevel', e.target.value)}>
            <option value="">Select highest level</option>
            <option>No Schooling</option>
            <option>Grade 1 - 8</option>
            <option>Grade 9 / NQF 1</option>
            <option>Grade 10 / NQF 2</option>
            <option>Grade 11 / NQF 3</option>
            <option>Grade 12 / Matric / National Certificate Level 4</option>
            <option>Higher Certificate / Advanced National Certificate</option>
            <option>Diploma / Advanced Certificate</option>
            <option>Bachelor’s degree / Advanced Diploma</option>
            <option>Post-Graduate Diploma / Honours Degree</option>
            <option>Master’s Degree</option>
            <option>Doctoral Degree</option>
          </select>
        </Field>
        <Field label="13. Highest post-school qualification">
          <input value={form.highestQualification} onChange={(e) => updateField('highestQualification', e.target.value)} />
        </Field>
        <Field label="14. Institution where highest qualification was obtained">
          <input value={form.highestInstitution} onChange={(e) => updateField('highestInstitution', e.target.value)} />
        </Field>
        <Field label="15. Year obtained">
          <input value={form.highestYear} onChange={(e) => updateField('highestYear', e.target.value.replace(/[^0-9]/g, '').slice(0, 4))} placeholder="YYYY" />
        </Field>
      </div>

      <Field label="16. Field of study for highest qualification">
        <select value={form.highestField} onChange={(e) => updateField('highestField', e.target.value)}>
          <option value="">Select field of study</option>
          {fieldOfStudyOptions.map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
      </Field>

      <RepeatQualification title="Other post-school qualification 1" qualificationKey="qualification1" institutionKey="institution1" yearKey="year1" fieldKey="field1" form={form} updateField={updateField} />
      <RepeatQualification title="Other post-school qualification 2" qualificationKey="qualification2" institutionKey="institution2" yearKey="year2" fieldKey="field2" form={form} updateField={updateField} />
      <RepeatQualification title="Other post-school qualification 3" qualificationKey="qualification3" institutionKey="institution3" yearKey="year3" fieldKey="field3" form={form} updateField={updateField} />
    </div>
  )
}

function SectionC({ form, updateField }) {
  return (
    <div className="section-wrap">
      <SectionHeader title="Section C: Employment Particulars" description="Provide employment information used for department, branch and salary-level reporting." />
      <div className="form-grid two-col">
        <Field label="29. Name of Department">
          <select value={form.department} onChange={(e) => updateField('department', e.target.value)}>
            {departmentOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
        <Field label="30. Nature of employment">
          <RadioGroup name="employmentType" value={form.employmentType} onChange={(value) => updateField('employmentType', value)} options={['Permanent', 'Contract', 'Other']} />
        </Field>
        <Field label="31. Job title">
          <input value={form.jobTitle} onChange={(e) => updateField('jobTitle', e.target.value)} />
        </Field>
        <Field label="32. Branch / Cluster">
          <input value={form.branch} onChange={(e) => updateField('branch', e.target.value)} />
        </Field>
        <Field label="33. Chief Directorate">
          <input value={form.chiefDirectorate} onChange={(e) => updateField('chiefDirectorate', e.target.value)} />
        </Field>
        <Field label="34. Directorate">
          <input value={form.directorate} onChange={(e) => updateField('directorate', e.target.value)} />
        </Field>
        <Field label="35. Sub-Directorate / Unit">
          <input value={form.subDirectorate} onChange={(e) => updateField('subDirectorate', e.target.value)} />
        </Field>
        <Field label="36. Years employed in the Public Service">
          <input value={form.yearsInPublicService} onChange={(e) => updateField('yearsInPublicService', e.target.value)} placeholder="Example: less than 1 year / 5 years" />
        </Field>
      </div>
    </div>
  )
}

function SectionD({ form, updateField }) {
  return (
    <div className="section-wrap">
      <SectionHeader title="Section D: Work Experience" description="Provide the last three previous work experience entries starting with the most recent one." />
      <WorkExperienceCard title="Work experience 1" employerKey="employer1" jobKey="jobTitle1" periodKey="period1" form={form} updateField={updateField} />
      <WorkExperienceCard title="Work experience 2" employerKey="employer2" jobKey="jobTitle2" periodKey="period2" form={form} updateField={updateField} />
      <WorkExperienceCard title="Work experience 3" employerKey="employer3" jobKey="jobTitle3" periodKey="period3" form={form} updateField={updateField} />
    </div>
  )
}

function SectionE({ form, updateField }) {
  return (
    <div className="section-wrap">
      <SectionHeader title="Section E: Learning Audit (Completed Training)" description="Capture additional training that adds value to the respondent’s work in the department." />
      <Field label="46. Additional training attended that adds value to your work">
        <RadioGroup name="additionalTraining" value={form.additionalTraining} onChange={(value) => updateField('additionalTraining', value)} options={['Yes', 'No']} />
      </Field>
      {form.additionalTraining === 'Yes' && (
        <Field label="47. If yes, what training was it?">
          <textarea value={form.trainingDescription} onChange={(e) => updateField('trainingDescription', e.target.value)} rows={5} />
        </Field>
      )}
    </div>
  )
}

function SectionF({ form, updateField }) {
  return (
    <div className="section-wrap">
      <SectionHeader title="Section F: Professional Registration" description="Capture professional body or association membership information where applicable." />
      <Field label="48. Are you a member of any Professional Body or Association?">
        <RadioGroup name="professionalMember" value={form.professionalMember} onChange={(value) => updateField('professionalMember', value)} options={['Yes', 'No']} />
      </Field>
      {form.professionalMember === 'Yes' && (
        <Field label="49. Which Professional Body or Association are you a member of?">
          <input value={form.professionalBodyName} onChange={(e) => updateField('professionalBodyName', e.target.value)} />
        </Field>
      )}
    </div>
  )
}

function SectionG({ form, updateField }) {
  return (
    <div className="section-wrap">
      <SectionHeader title="Section G: Competency Assessment and Career Progression" description="This section supports competency gap analysis, training needs planning and career aspiration reporting." />
      <Field label="50. Do you believe that you possess all the knowledge and skills to perform the job you are appointed to?">
        <RadioGroup name="hasRequiredSkills" value={form.hasRequiredSkills} onChange={(value) => updateField('hasRequiredSkills', value)} options={['Yes', 'No']} />
      </Field>
      {form.hasRequiredSkills === 'No' && (
        <Field label="51. Which knowledge or skills do you need?">
          <textarea value={form.skillsNeeded} onChange={(e) => updateField('skillsNeeded', e.target.value)} rows={5} />
        </Field>
      )}
      <div className="form-grid two-col">
        <Field label="52. What is your next career goal?">
          <input value={form.nextCareerGoal} onChange={(e) => updateField('nextCareerGoal', e.target.value)} placeholder="Example: Assistant Director" />
        </Field>
        <Field label="53. What is your projected retirement age?">
          <input value={form.projectedRetirementAge} onChange={(e) => updateField('projectedRetirementAge', e.target.value.replace(/[^0-9]/g, '').slice(0, 2))} placeholder="Numeric only" />
        </Field>
      </div>
    </div>
  )
}

function SectionH({ form, updateField }) {
  return (
    <div className="section-wrap">
      <SectionHeader title="Section H: Conclusion" description="Provide any relevant additional information and confirm the declaration before final submission." />
      <Field label="54. Additional information relevant to the skills audit exercise">
        <textarea value={form.additionalInformation} onChange={(e) => updateField('additionalInformation', e.target.value)} rows={6} />
      </Field>
      <div className="declaration-card">
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.declarationAccepted}
            onChange={(e) => updateField('declarationAccepted', e.target.checked)}
          />
          <span>
            <strong>55. Declaration</strong>
            <small>I confirm that the responses provided here are, to the best of my knowledge, true.</small>
          </span>
        </label>
      </div>
    </div>
  )
}

function SectionHeader({ title, description }) {
  return (
    <div className="section-head">
      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <label className="field-wrap">
      <span>{label}</span>
      {children}
    </label>
  )
}

function RadioGroup({ name, value, onChange, options }) {
  return (
    <div className="radio-grid">
      {options.map((option) => (
        <label key={`${name}-${option}`} className={value === option ? 'radio-pill active' : 'radio-pill'}>
          <input type="radio" name={name} checked={value === option} onChange={() => onChange(option)} />
          <span>{option}</span>
        </label>
      ))}
    </div>
  )
}

function RepeatQualification({ title, qualificationKey, institutionKey, yearKey, fieldKey, form, updateField }) {
  return (
    <div className="repeat-card">
      <h4>{title}</h4>
      <div className="form-grid two-col">
        <Field label="Qualification name">
          <input value={form[qualificationKey]} onChange={(e) => updateField(qualificationKey, e.target.value)} />
        </Field>
        <Field label="Institution">
          <input value={form[institutionKey]} onChange={(e) => updateField(institutionKey, e.target.value)} />
        </Field>
        <Field label="Year obtained">
          <input value={form[yearKey]} onChange={(e) => updateField(yearKey, e.target.value.replace(/[^0-9]/g, '').slice(0, 4))} placeholder="YYYY" />
        </Field>
        <Field label="Field of study">
          <select value={form[fieldKey]} onChange={(e) => updateField(fieldKey, e.target.value)}>
            <option value="">Select field of study</option>
            {fieldOfStudyOptions.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </Field>
      </div>
    </div>
  )
}

function WorkExperienceCard({ title, employerKey, jobKey, periodKey, form, updateField }) {
  return (
    <div className="repeat-card">
      <h4>{title}</h4>
      <div className="form-grid three-col">
        <Field label="Employer">
          <input value={form[employerKey]} onChange={(e) => updateField(employerKey, e.target.value)} />
        </Field>
        <Field label="Job title">
          <input value={form[jobKey]} onChange={(e) => updateField(jobKey, e.target.value)} />
        </Field>
        <Field label="Period">
          <input value={form[periodKey]} onChange={(e) => updateField(periodKey, e.target.value)} placeholder="Example: 5 years" />
        </Field>
      </div>
    </div>
  )
}

export default App
