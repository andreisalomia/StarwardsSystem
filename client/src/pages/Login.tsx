import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const auth = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.login(email, password);
      nav("/");
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="container mt-4">
      <PublicHeader />
      <form onSubmit={submit} style={{ maxWidth: 400 }}>
        <h2>Login</h2>
        <div>
          <label>Email</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mt-2">
          <label>Password</label>
          <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button className="btn btn-primary mt-3" type="submit">Login</button>
      </form>
    </div>
  );
}
