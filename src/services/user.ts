const API_URL = process.env.NEXT_PUBLIC_API_URL

const token = localStorage.getItem("token");

export const getUserData = async (uid: string) => {
  const response = await fetch(`${API_URL}/user/${uid}`)
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "No se pudo obtener el perfil")
  }
  return await response.json()
}

export const updateUserData = async (uid: string, data: { name: string, lastName: string }) => {
  const response = await fetch(`${API_URL}/user/${uid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify(data),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error al actualizar los datos")
  }
}

export const updatePassword = async (uid: string, newPassword: string) => {
  const response = await fetch(`${API_URL}/user/${uid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`
    },
    body: JSON.stringify({ password: newPassword }),
  })
  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || "Error al cambiar la contraseña")
  }

  
}


export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    throw new Error("Token no encontrado");
  }

  const response = await fetch(`${API_URL}/user/me`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "No se pudo obtener el usuario");
  }

  return await response.json(); // { uid, email, name, lastName }
};


