import React, { useState } from "react";

interface LoginFormProps {
  onSubmit: (data: { email: string; password: string }) => Promise<void>;
  isLoading?: boolean;
}

export const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  isLoading,
}) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError("Please fill all fields");
      return;
    }
    setError("");
    try {
      await onSubmit({ email, password });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to login");
    }
  };

  return (
    <div
      style={{
        maxWidth: "400px",
        margin: "0 auto",
        padding: "20px",
        border: "1px solid #ccc",
        borderRadius: "8px",
      }}
    >
      <h2>Login</h2>
      {error && (
        <div style={{ color: "red", marginBottom: "10px" }}>{error}</div>
      )}
      <form
        onSubmit={handleSubmit}
        style={{ display: "flex", flexDirection: "column", gap: "15px" }}
      >
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <div>
          <label style={{ display: "block", marginBottom: "5px" }}>
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            style={{ width: "100%", padding: "8px", boxSizing: "border-box" }}
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          style={{
            padding: "10px",
            backgroundColor: "#0070f3",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: isLoading ? "not-allowed" : "pointer",
          }}
        >
          {isLoading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};
