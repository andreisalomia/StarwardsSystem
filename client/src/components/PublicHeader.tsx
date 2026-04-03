import { Link } from "react-router-dom";

export default function PublicHeader() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark mb-4">
            <div className="container-fluid px-4">
                <Link className="navbar-brand fw-semibold" to="/">
                    Starwards
                </Link>
                <div>
                    <Link className="btn btn-outline-light btn-sm me-2" to="/login">
                        Login
                    </Link>
                    <Link className="btn btn-light btn-sm" to="/register">
                        Register
                    </Link>
                </div>
            </div>
        </nav>
    );
}
