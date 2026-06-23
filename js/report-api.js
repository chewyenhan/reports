const API_BASE = 'https://hualianhistory-reports.chewyenhan.workers.dev';

async function getMyReports() { return fetchWithAuth('/api/reports/my-subjects'); }
async function saveReport(studentId, subjectCode, feedback, isComplete) {
  return fetchWithAuth('/api/reports/' + studentId + '/' + subjectCode, {
    method: 'PUT', body: JSON.stringify({ feedback, is_complete: isComplete ? 1 : 0 }),
  });
}
async function markSubjectComplete(subjectCode) {
  return fetchWithAuth('/api/reports/mark-complete/' + subjectCode, { method: 'POST' });
}
async function getSummary() { return fetchWithAuth('/api/form-teacher/summary'); }
async function generateLinks(baseUrl) {
  return fetchWithAuth('/api/form-teacher/generate-links', {
    method: 'POST', body: JSON.stringify({ base_url: baseUrl || '' }),
  });
}
async function resetPassword(username, newPassword) {
  return fetchWithAuth('/api/form-teacher/reset-password', {
    method: 'POST', body: JSON.stringify({ username, new_password: newPassword }),
  });
}
async function changePassword(oldPwd, newPwd) {
  return fetchWithAuth('/api/auth/change-password', {
    method: 'POST', body: JSON.stringify({ old_password: oldPwd, new_password: newPwd }),
  });
}
async function getParentReport(code) {
  const res = await fetch(API_BASE + '/api/parent/report/' + code); return res.json();
}
async function getClassConfig() {
  const res = await fetch(API_BASE + '/api/config/class'); return res.json();
}
