import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Dashboard({ user }) {
  const [file, setFile] = useState(null); // File upload for patients
  const [reports, setReports] = useState([]); // Stores diagnosis reports

  // Handle file selection (Patients Only)
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle file upload for diagnosis (Patients Only)
  const handleUpload = async () => {
    if (!file) {
      alert("Please upload an image first.");
      return;
    }

    const formData = new FormData();
    formData.append("image", file);
    formData.append("user_email", user.email);

    try {
      await axios.post("http://127.0.0.1:5000/predict", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Diagnosis submitted successfully");
      fetchReports(); // Refresh reports
    } catch (error) {
      alert("Failed to submit image");
    }
  };

  // Fetch reports (Patients see their own, Doctors see all)
  const fetchReports = async () => {
    try {
      const response = await axios.get(`http://127.0.0.1:5000/history?user_email=${user.email}`);
      setReports(response.data);
    } catch (error) {
      alert("Failed to fetch reports");
    }
  };

  // Fetch reports when component mounts
  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="flex flex-col items-center h-screen p-5 bg-gray-700">
      <h2 className="text-3xl font-bold mb-4">
        Welcome, {user.role === "doctor" ? "Doctor" : "Patient"}
      </h2>

      {/* Patient Dashboard - Upload Scans */}
      {user.role === "patient" && (
        <div className="p-4 bg-slate-900 shadow-md rounded-lg w-96">
          <h3 className="text-xl font-semibold mb-2">Upload MRI/CT Scan</h3>
          <input type="file" accept="image/*" onChange={handleFileChange} className="mb-3 w-full" />
          <button onClick={handleUpload} className="px-4 py-2 bg-blue-500 text-white rounded w-full">
            Submit for Diagnosis
          </button>
        </div>
      )}

      {/* Reports Section (Both Patients & Doctors) */}
      <div className="mt-6 w-96">
        <h3 className="text-xl font-semibold">Reports</h3>
        {reports.length === 0 ? (
          <p className="text-gray-500">No reports available.</p>
        ) : (
          reports.map((report, index) => (
            <div key={index} className="p-3 border rounded mt-2 bg-white shadow">
              <p><strong>Patient:</strong> {report.user_email}</p>
              <p><strong>Diagnosis:</strong> {JSON.stringify(report.result)}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
