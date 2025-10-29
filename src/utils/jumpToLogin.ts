function jumpToLogin() {
  if (
    typeof window !== 'undefined' &&
    window.location.pathname !== '/login' &&
    window.location.pathname !== '/register'
  ) {
    window.location.replace('/login')
  }
}

export default jumpToLogin
