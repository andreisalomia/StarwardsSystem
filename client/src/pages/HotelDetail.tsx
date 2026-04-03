import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../auth/AuthContext";

interface Hotel {
    GlobalPropertyID: number;
    GlobalPropertyName: string;
    PropertyAddress1: string | null;
    PropertyAddress2: string | null;
    PropertyPhoneNumber: string | null;
    SabrePropertyRating: number | null;
    HotelStars: number | null;
    FloorsNumber: number | null;
    RoomsNumber: number | null;
    DistanceToAirport: number | null;
}

interface Rating {
    AmenitiesRate: number | null;
    CleanlinessRate: number | null;
    FoodBeverage: number | null;
    SleepQuality: number | null;
    InternetQuality: number | null;
    MetadataScore: number | null;
    FinalScore: number | null;
    ReviewCount: number;
}

function ScoreRow({ label, value }: { label: string; value: number | null }) {
    if (value === null)
        return (
            <tr>
                <td>{label}</td>
                <td className="text-muted">—</td>
                <td></td>
            </tr>
        );
    const num = Number(value);
    const pct = ((num - 1) / 4) * 100;
    const color = num >= 4 ? "success" : num >= 3 ? "warning" : "danger";
    return (
        <tr>
            <td>{label}</td>
            <td>
                <span className={`badge bg-${color}`}>{num.toFixed(2)}</span>
            </td>
            <td style={{ width: "40%" }}>
                <div className="progress" style={{ height: 6 }}>
                    <div className={`progress-bar bg-${color}`} style={{ width: `${pct}%` }} />
                </div>
            </td>
        </tr>
    );
}

export default function HotelDetail() {
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [hotel, setHotel] = useState<Hotel | null>(null);
    const [rating, setRating] = useState<Rating | null>(null);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState<Partial<Hotel>>({});
    const [loadingHotel, setLoadingHotel] = useState(true);
    const [loadingRating, setLoadingRating] = useState(false);

    const canEdit = user?.role === "Administrator" || user?.role === "Hotel Manager";

    useEffect(() => {
        axios.get(`/api/hotels/${id}`).then((res) => {
            setHotel(res.data);
            setForm(res.data);
            setLoadingHotel(false);
        });

        setLoadingRating(true);
        axios
            .get(`/api/hotels/${id}/rating`)
            .then((res) => {
                setRating(res.data);
                setLoadingRating(false);
            })
            .catch(() => setLoadingRating(false));
    }, [id]);

    const loadRating = () => {
        setLoadingRating(true);
        axios
            .get(`/api/hotels/${id}/rating`)
            .then((res) => {
                setRating(res.data);
                setLoadingRating(false);
            })
            .catch(() => setLoadingRating(false));
    };

    const handleSave = () => {
        axios.put(`/api/hotels/${id}`, form).then((res) => {
            setHotel(res.data);
            setEditing(false);
        });
    };

    if (loadingHotel)
        return (
            <div className="d-flex justify-content-center mt-5">
                <div className="spinner-border" />
            </div>
        );

    if (!hotel)
        return (
            <div className="container py-4">
                <p className="text-muted">Hotel not found.</p>
            </div>
        );

    return (
        <div className="container py-4">
            <div className="d-flex justify-content-between align-items-start mb-4">
                <div>
                    <h2 className="mb-1">{hotel.GlobalPropertyName}</h2>
                    <p className="text-muted mb-0">{hotel.PropertyAddress1}</p>
                </div>
                <div className="d-flex gap-2">
                    {canEdit && !editing && (
                        <button className="btn btn-outline-primary btn-sm" onClick={() => setEditing(true)}>
                            Edit
                        </button>
                    )}
                    {editing && (
                        <>
                            <button className="btn btn-primary btn-sm" onClick={handleSave}>
                                Save
                            </button>
                            <button className="btn btn-outline-secondary btn-sm" onClick={() => setEditing(false)}>
                                Cancel
                            </button>
                        </>
                    )}
                </div>
            </div>

            <div className="row g-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header fw-medium">Hotel info</div>
                        <div className="card-body">
                            {editing ? (
                                <div className="d-flex flex-column gap-2">
                                    {(["GlobalPropertyName", "PropertyAddress1", "PropertyAddress2", "PropertyPhoneNumber"] as const).map((field) => (
                                        <div key={field}>
                                            <label className="form-label small text-muted">{field}</label>
                                            <input className="form-control form-control-sm" value={(form[field] as string) || ""} onChange={(e) => setForm({ ...form, [field]: e.target.value })} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <table className="table table-sm mb-0">
                                    <tbody>
                                        <tr>
                                            <td className="text-muted">ID</td>
                                            <td>{hotel.GlobalPropertyID}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted">Phone</td>
                                            <td>{hotel.PropertyPhoneNumber || "—"}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted">Stars</td>
                                            <td>{hotel.HotelStars || "—"}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted">Floors</td>
                                            <td>{hotel.FloorsNumber || "—"}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted">Rooms</td>
                                            <td>{hotel.RoomsNumber || "—"}</td>
                                        </tr>
                                        <tr>
                                            <td className="text-muted">Distance to airport</td>
                                            <td>{hotel.DistanceToAirport ? `${hotel.DistanceToAirport} km` : "—"}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-md-6">
                    <div className="card">
                        <div className="card-header d-flex justify-content-between align-items-center">
                            <span className="fw-medium">Rating scores</span>
                            {!rating && !loadingRating && (
                                <button className="btn btn-sm btn-outline-primary" onClick={loadRating}>
                                    Compute rating
                                </button>
                            )}
                            {loadingRating && <div className="spinner-border spinner-border-sm" />}
                            {rating && !loadingRating && <span className="badge bg-dark fs-6">Final: {Number(rating.FinalScore).toFixed(2)}</span>}
                        </div>
                        <div className="card-body">
                            {!rating ? (
                                <p className="text-muted small mb-0">{loadingRating ? "Analyzing reviews..." : 'Click "Compute rating" to analyze this hotel.'}</p>
                            ) : (
                                <>
                                    <table className="table table-sm mb-2">
                                        <thead>
                                            <tr>
                                                <th>Category</th>
                                                <th>Score</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <ScoreRow label="Amenities" value={rating.AmenitiesRate} />
                                            <ScoreRow label="Cleanliness" value={rating.CleanlinessRate} />
                                            <ScoreRow label="Food & Beverage" value={rating.FoodBeverage} />
                                            <ScoreRow label="Sleep Quality" value={rating.SleepQuality} />
                                            <ScoreRow label="Internet" value={rating.InternetQuality} />
                                            <ScoreRow label="Metadata Score" value={rating.MetadataScore} />
                                        </tbody>
                                    </table>
                                    <p className="text-muted small mb-0">Based on {rating.ReviewCount} reviews</p>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
