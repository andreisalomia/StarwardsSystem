import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  hotel_id?: number | null;
  group_id?: number | null;
}

const ROLES = ["Traveler", "Hotel Manager", "Group Manager", "Administrator", "Data Operator"];

export default function Users() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState<any>({ name: "", email: "", password: "", role: "Traveler", hotel_id: null, group_id: null });
  const auth = useAuth();

  const load = () => {
    setLoading(true);
    axios
      .get("/api/users")
      .then((res) => setUsers(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const startCreate = () => {
    setEditing(null);
    setForm({ name: "", email: "", password: "", role: "Traveler", hotel_id: null, group_id: null });
  };

  const startEdit = (u: User) => {
    setEditing(u);
    setForm({ name: u.name, email: u.email, password: "", role: u.role, hotel_id: u.hotel_id, group_id: u.group_id });
  };

  const save = async () => {
    try {
      if (editing) {
        await axios.put(`/api/users/${editing.id}`, form);
      } else {
        await axios.post(`/api/users`, form);
      }
      load();
      setEditing(null);
    } catch (err: any) {
      alert(err.response?.data?.error || "Save failed");
    }
  };

  const remove = async (id: number) => {
    if (!confirm("Delete user?")) return;
    try {
      await axios.delete(`/api/users/${id}`);
      load();
    } catch (err) {
      alert("Delete failed");
    }
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" />
      </div>
    );

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0">Users</h2>
        {auth.user?.role === "Administrator" && (
          <button className="btn btn-primary btn-sm" onClick={startCreate}>
            New User
          </button>
        )}
      </div>

      {auth.user?.role === "Administrator" && (
        <div className="card mb-4">
          <div className="card-body">
            <h5 className="card-title">{editing ? `Edit user ${editing.name}` : "Create user"}</h5>
            <div className="row g-2">
              <div className="col-sm-4">
                <input className="form-control" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
              </div>
              <div className="col-sm-4">
                <input className="form-control" placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
              </div>
              <div className="col-sm-4">
                <input className="form-control" placeholder="Password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
              </div>
              <div className="col-sm-3 mt-2">
                <select className="form-select" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
                  {ROLES.map((r) => (
                    <option key={r}>{r}</option>
                  ))}
                </select>
              </div>
              <div className="col-sm-3 mt-2">
                <input className="form-control" placeholder="Hotel ID" value={form.hotel_id || ""} onChange={(e) => setForm({ ...form, hotel_id: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div className="col-sm-3 mt-2">
                <input className="form-control" placeholder="Group ID" value={form.group_id || ""} onChange={(e) => setForm({ ...form, group_id: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <div className="col-sm-12 mt-3">
                <button className="btn btn-success btn-sm me-2" onClick={save}>
                  Save
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => setEditing(null)}>
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="table-responsive">
        <table className="table table-sm table-hover">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Hotel</th>
              <th>Group</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>{u.hotel_id || "—"}</td>
                <td>{u.group_id || "—"}</td>
                <td>
                  {auth.user?.role === "Administrator" && (
                    <>
                      <button className="btn btn-sm btn-outline-primary me-2" onClick={() => startEdit(u)}>
                        Edit
                      </button>
                      <button className="btn btn-sm btn-outline-danger" onClick={() => remove(u.id)}>
                        Delete
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
