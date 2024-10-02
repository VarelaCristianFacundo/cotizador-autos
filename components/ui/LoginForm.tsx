// components/LoginForm.tsx
import { saveToken } from "@/utils/auth";
import React, { useState } from "react";
import { Input } from "./input";
import { Button } from "./button";
import { saveEmailUser } from "@/utils/emailUser";

interface LoginProps {
  onSuccess?: () => void; // Opcional, se llama cuando el login es exitoso
}

export const LoginForm: React.FC<LoginProps> = ({ onSuccess }) => {
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para manejar la carga

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true); // Iniciar la carga
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ emailUser: email }),
      });

      const data = await res.json();
      setIsLoading(false); // Finalizar la carga

      if (res.ok) {
        saveToken(data.token!);
        saveEmailUser(email);
        if (onSuccess) {
          onSuccess(); // Esto debería cerrar el modal si todo está conectado correctamente
        }
      } else {
        setError(data.message || "Error desconocido");
      }
    } catch (err) {
      setIsLoading(false); // Finalizar la carga en caso de error
      setError("No se pudo conectar al servidor");
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      <Input
        type="email"
        placeholder="Tu correo electrónico"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <Button
        type="submit"
        className="w-full bg-logo-blue1"
        disabled={isLoading}
      >
        {isLoading ? "Enviando..." : "Enviar"}
      </Button>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </form>
  );
};
