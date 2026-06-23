// ============================================================
// API 调用封装
// ============================================================

// 获取当前教师的评语数据
async function getMyReports() {
  return fetchWithAuth('/api/reports/my-subjects');
}

// 保存单条评语
async function saveReport(studentId, subjectCode, feedback, isComplete) {
  return fetchWithAuth(`/api/reports/${studentId}/${subjectCode}`, {
    method: 'PUT',
    body: JSON.stringify({
      feedback: feedback,
      is_complete: isComplete ? 1 : 0,
    }),
  });
}

// 标记某科目全部完成
async function markSubjectComplete(subjectCode) {
  return fetchWithAuth(`/api/reports/mark-complete/${subjectCode}`, {
    method: 'POST',
  });
}

// 班主任：获取全科矩阵
async function getSummary() {
  return fetchWithAuth('/api/form-teacher/summary');
}

// 班主任：生成家长链接
async function generateLinks(baseUrl) {
  return fetchWithAuth('/api/form-teacher/generate-links', {
    method: 'POST',
    body: JSON.stringify({ base_url: baseUrl || '' }),
  });
}

// 班主任：重置教师密码
async function resetPassword(username, newPassword) {
  return fetchWithAuth('/api/form-teacher/reset-password', {
    method: 'POST',
    body: JSON.stringify({ username, new_password: newPassword }),
  });
}

// 公开：家长查看报告
async function getParentReport(code) {
  const res = await fetch(`${WORKER_URL}/api/parent/report/${code}`);
  return res.json();
}

// 公开：获取班级配置
async function getClassConfig() {
  const res = await fetch(`${WORKER_URL}/api/config/class`);
  return res.json();
}
