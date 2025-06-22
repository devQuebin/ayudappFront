const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const login = async (email: string, password: string): Promise<void> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Login fallido");
  }

  const data = await response.json();
  document.cookie = `token=${data.token}; path=/;`;
  document.cookie = `uid=${data.user.uid}; path=/;`;
  // Guardar token en localStorage
  localStorage.setItem("token", data.token);
  localStorage.setItem("uid", data.user.uid); 
  window.location.reload();
};
