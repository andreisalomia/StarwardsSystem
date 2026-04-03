import React, { useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import PublicHeader from "../components/PublicHeader";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Traveler");
  const [hotelId, setHotelId] = useState<number | null>(null);
  const [groupId, setGroupId] = useState<number | null>(null);
  const auth = useAuth();
  const nav = useNavigate();

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { name, email, password, role };
      if (role === "Hotel Manager") payload.hotel_id = hotelId;
      if (role === "Group Manager") payload.group_id = groupId;
      if (role === "Hotel Manager" && groupId) payload.group_id = groupId;

      await auth.register(payload);
      alert("Registered. Please login.");
      nav("/login");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="container mt-4">
      <PublicHeader />
      <form onSubmit={submit} style={{ maxWidth: 500 }}>
        <h2>Register</h2>
        <div>
          <label>Name</label>
          <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="mt-2">
          <label>Email</label>
          <input className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div className="mt-2">
          <label>Password</label>
          <input className="form-control" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <div className="mt-2">
          <label>Role</label>
          <select className="form-select" value={role} onChange={(e) => setRole(e.target.value)}>
            <option>Traveler</option>
            <option>Hotel Manager</option>
            <option>Group Manager</option>
            <option>Administrator</option>
            <option>Data Operator</option>
          </select>
        </div>

        {role === "Hotel Manager" && (
          <div className="mt-2">
            <label>Hotel ID (assign the manager to a hotel)</label>
            <input className="form-control" value={hotelId ?? ""} onChange={(e) => setHotelId(e.target.value ? Number(e.target.value) : null)} placeholder="Numeric Hotel ID" />
          </div>
        )}

        {role === "Hotel Manager" && (
          <div className="mt-2">
            <label>Group ID (optional) — assign manager to a group</label>
            <input className="form-control" value={groupId ?? ""} onChange={(e) => setGroupId(e.target.value ? Number(e.target.value) : null)} placeholder="Numeric Group ID (optional)" />
          </div>
        )}

        {role === "Group Manager" && (
          <div className="mt-2">
            <label>Group ID (assign the manager to a group)</label>
            <input className="form-control" value={groupId ?? ""} onChange={(e) => setGroupId(e.target.value ? Number(e.target.value) : null)} placeholder="Numeric Group ID" />
          </div>
        )}

        <button className="btn btn-primary mt-3" type="submit">Register</button>
      </form>
    </div>
  );
}
