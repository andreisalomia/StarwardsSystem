import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

interface Hotel {
    GlobalPropertyID: number;
    GlobalPropertyName: string;
    PropertyAddress1: string | null;
    SabrePropertyRating: number | null;
    CityID: number | null;
}

const PER_PAGE = 50;

export default function Hotels() {
    const [hotels, setHotels] = useState<Hotel[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get("/api/hotels").then((res) => {
            console.log(res.data);
            setHotels(res.data);
            setLoading(false);
        });
    }, []);

    const filtered = hotels.filter((h) => h.GlobalPropertyName.toLowerCase().includes(search.toLowerCase()));
    const totalPages = Math.ceil(filtered.length / PER_PAGE);
    const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

    if (loading)
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border" />
            </div>
        );

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h2 className="mb-0">Hotels</h2>
                <input
                    type="text"
                    className="form-control w-25"
                    placeholder="Search by name..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                />
            </div>
            <div className="table-responsive">
                <table className="table table-hover table-bordered align-middle">
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginated.map((hotel) => (
                            <tr key={hotel.GlobalPropertyID} style={{ cursor: "pointer" }} onClick={() => navigate(`/hotels/${hotel.GlobalPropertyID}`)}>
                                <td className="text-muted small">{hotel.GlobalPropertyID}</td>
                                <td className="fw-medium">{hotel.GlobalPropertyName}</td>
                                <td className="text-muted small">{hotel.PropertyAddress1 || "—"}</td>
                                <td>{hotel.SabrePropertyRating ? <span className="badge bg-primary">{hotel.SabrePropertyRating}</span> : <span className="text-muted">—</span>}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div className="d-flex justify-content-between align-items-center mt-2">
                <p className="text-muted small mb-0">{filtered.length} hotels</p>
                <nav>
                    <ul className="pagination pagination-sm mb-0">
                        <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPage(page - 1)}>
                                Previous
                            </button>
                        </li>
                        {Array.from({ length: Math.min(totalPages, 10) }, (_, i) => i + 1).map((p) => (
                            <li key={p} className={`page-item ${p === page ? "active" : ""}`}>
                                <button className="page-link" onClick={() => setPage(p)}>
                                    {p}
                                </button>
                            </li>
                        ))}
                        <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
                            <button className="page-link" onClick={() => setPage(page + 1)}>
                                Next
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
    );
}
