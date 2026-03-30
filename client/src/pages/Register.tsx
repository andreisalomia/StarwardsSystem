import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Traveler");
  const auth = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await auth.register({ name, email, password, role });
      alert("Registered. Please login.");
      nav("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <form onSubmit={submit} style={{ maxWidth: 500 }}>
      <h2>Register</h2>
      <div>
        <label>Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <label>Email</label>
        <input value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div>
        <label>Role</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option>Traveler</option>
          <option>Hotel Manager</option>
          <option>Group Manager</option>
          <option>Administrator</option>
          <option>Data Operator</option>
        </select>
      </div>
      <button type="submit">Register</button>
    </form>
  );
}
