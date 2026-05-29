export function getCaseReportById (state) {
  return (user, id) => state.caseReports.filter(rec => rec.id === id && user && rec.actions[0].user === user.email).pop()
}

export function getCaseReportsCount (state) {
  return (user) => state.caseReports.filter(rec => user && rec.actions[0].user === user.email).length
}

export function getCaseReports (state) {
  return (user) => state.caseReports.filter(rec => user && rec.actions[0].user === user.email)
}
