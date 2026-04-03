import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Hotels from "./pages/Hotels";
import HotelDetail from "./pages/HotelDetail";
import Users from "./pages/Users";
import Permissions from "./pages/Permissions";

export default function App() {
    return (
        <>
            <Navbar />
            <Routes>
                <Route path="/" element={<Hotels />} />
                <Route path="/hotels" element={<Hotels />} />
                <Route path="/hotels/:id" element={<HotelDetail />} />
                <Route path="/users" element={<Users />} />
                <Route path="/permissions" element={<Permissions />} />
            </Routes>
        </>
    );
}