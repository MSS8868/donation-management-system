import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";


function Dashboard() {
  const navigate = useNavigate();

  const [donations, setDonations] = useState([]);
  const [donorName, setDonorName] = useState("");
  const [amount, setAmount] = useState("");
  const [donationDate, setDonationDate] = useState("");
  const [isEditing, setIsEditing] = useState(false);
const [editId, setEditId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
    } else {
      fetchDonations();
    }
  }, [navigate]);

  const fetchDonations = async () => {
    try {
      const res = await API.get("/donations");
      setDonations(res.data);
    } catch (err) {
      console.error(err);
    }
  };
const handleEdit = (donation) => {
  setDonorName(donation.donor_name);
  setAmount(donation.amount);
  setDonationDate(donation.donation_date);
  setEditId(donation.id);
  setIsEditing(true);
};const handleAddDonation = async (e) => {
  e.preventDefault();

  try {
    if (isEditing) {
      await API.put(`/donations/${editId}`, {
        donor_name: donorName,
        amount,
        donation_date: donationDate,
      });
    } else {
      await API.post("/donations", {
        donor_name: donorName,
        amount,
        donation_date: donationDate,
      });
    }

    // Reset form
    setDonorName("");
    setAmount("");
    setDonationDate("");
    setIsEditing(false);
    setEditId(null);

    fetchDonations();
  } catch (err) {
    alert("Operation failed");
  }
};
  
const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this donation?")) {
    return;
  }
  

  try {
    await API.delete(`/donations/${id}`);
    fetchDonations();
  } catch (err) {
    alert("Failed to delete donation");
  }
};
  return (
  <div className="min-h-screen bg-gray-100">

    {/* HEADER */}
    <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold">Donation Management System</h1>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/");
        }}
        className="bg-white text-blue-600 px-4 py-2 rounded font-semibold"
      >
        Logout
      </button>
    </div>

    <div className="p-6">

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white shadow rounded p-6">
          <h2 className="text-gray-500">Total Donations</h2>
          <p className="text-2xl font-bold text-green-600">
            ₹ {donations.reduce((sum, d) => sum + Number(d.amount), 0)}
          </p>
        </div>

        <div className="bg-white shadow rounded p-6">
          <h2 className="text-gray-500">Total Records</h2>
          <p className="text-2xl font-bold text-blue-600">
            {donations.length}
          </p>
        </div>
      </div>

      {/* FORM */}
      <div className="bg-white shadow rounded p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Update Donation" : "Add Donation"}
        </h2>

        <form onSubmit={handleAddDonation} className="flex gap-4">
          <input
            type="text"
            placeholder="Donor Name"
            value={donorName}
            onChange={(e) => setDonorName(e.target.value)}
            className="border p-2 rounded w-1/4"
            required
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-2 rounded w-1/4"
            required
          />

          <input
            type="date"
            value={donationDate}
            onChange={(e) => setDonationDate(e.target.value)}
            className="border p-2 rounded w-1/4"
            required
          />

          <button
            type="submit"
            className={`px-4 py-2 rounded text-white ${
              isEditing ? "bg-yellow-500" : "bg-green-600"
            }`}
          >
            {isEditing ? "Update" : "Add"}
          </button>
        </form>
      </div>

      {/* TABLE */}
      <div className="bg-white shadow rounded p-6">
        <h2 className="text-xl font-semibold mb-4">All Donations</h2>

        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Donor</th>
              <th className="p-3 text-left">Amount</th>
              <th className="p-3 text-left">Date</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {donations.map((donation) => (
              <tr key={donation.id} className="border-b">
                <td className="p-3">{donation.id}</td>
                <td className="p-3">{donation.donor_name}</td>
                <td className="p-3 text-green-600 font-semibold">
                  ₹ {donation.amount}
                </td>
                <td className="p-3">{donation.donation_date}</td>
                <td className="p-3">
                  <button
                    onClick={() => handleEdit(donation)}
                    className="bg-yellow-400 px-3 py-1 rounded mr-2"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(donation.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  </div>
);
}

export default Dashboard;