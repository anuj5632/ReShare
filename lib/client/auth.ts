export async function signOutClient() {
  try {
    // call server to clear httpOnly cookie
    await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' })
  } catch (e) {
    // ignore network errors; still clear client state
    console.warn('signOutClient: logout request failed', e)
  }

  try {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token')
      localStorage.removeItem('userRole')
      // navigate home
      window.location.href = '/'
    }
  } catch (e) {
    console.warn('signOutClient: cleanup failed', e)
  }
}

export default signOutClient
