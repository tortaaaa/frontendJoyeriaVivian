// src/utils/logout.ts
export function logoutCMS() {
  localStorage.removeItem('cms_token');
  window.location.href = '/cms/login';
}
