import { useEffect, useState } from "react";
import axios from "axios";

interface Perm {
  id: number;
  role: string;
  resource: string;
  can_read: boolean;
  can_write: boolean;
}

export default function Permissions() {
  const [perms, setPerms] = useState<Perm[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("/api/permissions")
      .then((res) => setPerms(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const toggle = (id: number, key: "can_read" | "can_write") => {
    const p = perms.find((x) => x.id === id);
    if (!p) return;
    const body = { ...p, [key]: !p[key] };
    axios
      .put(`/api/permissions/${id}`, body)
      .then((res) => setPerms((prev) => prev.map((x) => (x.id === id ? res.data : x))))
      .catch((err) => alert("Update failed"));
  };

  if (loading)
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border" />
      </div>
    );

  return (
    <div className="container py-4">
      <h2 className="mb-4">Permissions</h2>
      <div className="table-responsive">
        <table className="table table-sm table-hover">
          <thead className="table-dark">
            <tr>
              <th>Role</th>
              <th>Resource</th>
              <th>Read</th>
              <th>Write</th>
            </tr>
          </thead>
          <tbody>
            {perms.map((p) => (
              <tr key={p.id}>
                <td>{p.role}</td>
                <td>{p.resource}</td>
                <td>
                  <input type="checkbox" checked={p.can_read} onChange={() => toggle(p.id, "can_read")} />
                </td>
                <td>
                  <input type="checkbox" checked={p.can_write} onChange={() => toggle(p.id, "can_write")} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
