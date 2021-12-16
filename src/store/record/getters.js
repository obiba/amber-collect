export function getCaseReportById (state) {
  return (id) => state.caseReports.filter(rec => rec.id === id).pop()
}

export function getCaseReportsCount (state) {
  return state.caseReports.length
}
