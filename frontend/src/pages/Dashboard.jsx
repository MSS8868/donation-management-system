import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import toast from "react-hot-toast";

function Dashboard() {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const donationsPerPage = 5;

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/");
    else fetchDonations();
  }, [navigate]);

  const fetchDonations = async () => {
    const res = await API.get("/donations");
    setDonations(res.data);
  };

  const handleAddDonation = async (e) => {
    e.preventDefault();

    if (isEditing) {
      await API.put(`/donations/${editId}`, {
        donor_name: donorName,
        amount,
        donation_date: donationDate,
      });
      toast.success("Donation updated 🤍");
    } else {
      await API.post("/donations", {
        donor_name: donorName,
        amount,
        donation_date: donationDate,
      });
      toast.success("Donation added 🤍");
    }

    setDonorName("");
    setAmount("");
    setDonationDate("");
    setIsEditing(false);
    fetchDonations();
  };

  const handleDelete = async (id) => {
    await API.delete(`/donations/${id}`);
    toast.success("Donation removed 🧁");
    fetchDonations();
  };

  const processedDonations = useMemo(() => {
    return donations
      .filter((d) =>
        d.donor_name.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .sort((a, b) =>
        sortOrder === "asc"
          ? new Date(a.donation_date) - new Date(b.donation_date)
          : new Date(b.donation_date) - new Date(a.donation_date)
      );
  }, [donations, searchTerm, sortOrder]);

  const indexOfLast = currentPage * donationsPerPage;
  const indexOfFirst = indexOfLast - donationsPerPage;
  const currentDonations = processedDonations.slice(indexOfFirst, indexOfLast);
  const totalPages = Math.ceil(processedDonations.length / donationsPerPage);
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-[#F5F1EB]" style={{ fontFamily: "Inter, sans-serif" }}>

      {/* HEADER */}
      <div className="bg-[#B08968] text-white p-6 flex justify-between items-center shadow-md">
        <h1
          className="text-3xl tracking-wide"
          style={{ fontFamily: "'Playfair Display', serif" }}
        >
          Donation Dashboard
        </h1>

        <button
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/");
          }}
          className="bg-white text-[#B08968] px-5 py-2 rounded-xl hover:bg-[#EFE7E1] transition"
        >
          Logout
        </button>
      </div>

      <div className="p-10">

        {/* STATS */}
        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-[#FAF7F2] p-6 rounded-2xl shadow-md">
            <h2 className="text-[#5C534E]">Total Donations</h2>
            <p className="text-2xl font-semibold text-[#B08968]">
              ₹ {processedDonations.reduce((s, d) => s + Number(d.amount), 0)}
            </p>
          </div>

          <div className="bg-[#FAF7F2] p-6 rounded-2xl shadow-md">
            <h2 className="text-[#5C534E]">Records</h2>
            <p className="text-2xl font-semibold text-[#B08968]">
              {processedDonations.length}
            </p>
          </div>
        </div>

        {/* FORM */}
        <div className="bg-[#FAF7F2] p-8 rounded-2xl shadow-md mb-10">
          <form onSubmit={handleAddDonation} className="flex gap-4">
            <input
              type="text"
              placeholder="Donor"
              value={donorName}
              onChange={(e) => setDonorName(e.target.value)}
              className="p-3 rounded-xl bg-[#F5F1EB] border border-[#E4DAD2]"
              required
            />
            <input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-3 rounded-xl bg-[#F5F1EB] border border-[#E4DAD2]"
              required
            />
            <input
  type="date"
  value={donationDate}
  max={today}
  onChange={(e) => setDonationDate(e.target.value)}
  className="p-3 rounded-xl bg-[#F5F1EB] border border-[#E4DAD2]"
  required
/>
            <button className="bg-[#B08968] text-white px-6 rounded-xl hover:bg-[#9C7455] transition">
              {isEditing ? "Update" : "Add"}
            </button>
          </form>
        </div>

        {/* TABLE */}
        <div className="bg-[#FAF7F2] p-8 rounded-2xl shadow-md">
          <div className="flex justify-between mb-6">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="p-3 rounded-xl bg-[#F5F1EB] border border-[#E4DAD2]"
            />

            <button
              onClick={() =>
                setSortOrder(sortOrder === "asc" ? "desc" : "asc")
              }
              className="bg-[#D6CFC7] px-4 rounded-xl hover:bg-[#C8BEB6] transition"
            >
              {sortOrder === "asc" ? "Oldest" : "Newest"}
            </button>
          </div>

          <table className="w-full text-[#3E3A37]">
            <thead className="text-[#5C534E] uppercase text-sm tracking-wider">
              <tr>
                <th>ID</th>
                <th>Donor</th>
                <th>Amount</th>
                <th>Date</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {currentDonations.map((d) => (
                <tr
                  key={d.id}
                  className="border-t border-[#E4DAD2] hover:bg-[#EFE7E1] transition duration-200"
                >
                  <td className="py-3">{d.id}</td>
                  <td>{d.donor_name}</td>
                  <td className="text-[#B08968] font-medium">
                    ₹ {d.amount}
                  </td>
                  <td>{d.donation_date}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(d.id)}
                      className="text-rose-400 hover:text-rose-600 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* PAGINATION */}
          <div className="flex justify-center mt-6 gap-2">
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-3 py-1 rounded-xl ${
                  currentPage === i + 1
                    ? "bg-[#B08968] text-white"
                    : "bg-[#E4DAD2]"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}

export default Dashboard;