import { useState, useEffect } from "react"
import { useRouter } from "next/router"
import { authService } from "../../ayudappFront/src/services/authService"

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const user = await authService.getCurrentUser()
      if (user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
        router.push("/login") // Redirect to login if not authenticated
      }
      setLoading(false)
    }

    checkAuth()
  }, [router])

  const login = async (credentials) => {
    setLoading(true)
    const success = await authService.login(credentials)
    setIsAuthenticated(success)
    setLoading(false)
    if (success) {
      router.push("/") // Redirect to home after login
    }
  }

  const logout = async () => {
    await authService.logout()
    setIsAuthenticated(false)
    router.push("/login") // Redirect to login after logout
  }

  return { isAuthenticated, loading, login, logout }
}

export default useAuth
