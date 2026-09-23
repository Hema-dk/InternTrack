
import { useEffect, useState } from "react";
import "./App.css";

const statuses = [
  "Interested",
  "Applied",
  "Assessment",
  "Interview",
  "Selected",
  "Rejected",
];

function App() {
  const [internships, setInternships] = useState(() => {
    const saved = localStorage.getItem("internships");
    return saved ? JSON.parse(saved) : [];
  });

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  const [form, setForm] = useState({
    company: "",
    role: "",
    location: "",
    date: "",
    deadline: "",
    status: "Applied",
  });

  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    localStorage.setItem("internships", JSON.stringify(internships));
  }, [internships]);

  function handleChange(e) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!form.company || !form.role || !form.date) {
      alert("Please fill in company, role and application date.");
      return;
    }

    if (editingId) {
      setInternships(
        internships.map((internship) =>
          internship.id === editingId
            ? { ...form, id: editingId }
            : internship
        )
      );

      setEditingId(null);
    } else {
      const newInternship = {
        ...form,
        id: Date.now(),
      };

      setInternships([...internships, newInternship]);
    }

    resetForm();
  }

  function resetForm() {
    setForm({
      company: "",
      role: "",
      location: "",
      date: "",
      deadline: "",
      status: "Applied",
    });
  }

  function editInternship(internship) {
    setForm({
      company: internship.company,
      role: internship.role,
      location: internship.location,
      date: internship.date,
      deadline: internship.deadline,
      status: internship.status,
    });

    setEditingId(internship.id);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  function deleteInternship(id) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this internship?"
    );

    if (confirmed) {
      setInternships(
        internships.filter((internship) => internship.id !== id)
      );
    }
  }

  function changeStatus(id, newStatus) {
    setInternships(
      internships.map((internship) =>
        internship.id === id
          ? { ...internship, status: newStatus }
          : internship
      )
    );
  }

  const filteredInternships = internships.filter((internship) => {
    const matchesSearch =
      internship.company.toLowerCase().includes(search.toLowerCase()) ||
      internship.role.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      filterStatus === "All" || internship.status === filterStatus;

    return matchesSearch && matchesStatus;
  });

  const total = internships.length;

  const applied = internships.filter(
    (item) => item.status === "Applied"
  ).length;

  const interviews = internships.filter(
    (item) => item.status === "Interview"
  ).length;

  const selected = internships.filter(
    (item) => item.status === "Selected"
  ).length;

  return (
    <div className="app">

      <nav className="navbar">
        <div className="logo">
          <span>📋</span> InternTrack
        </div>

        <p>Track your internship journey</p>
      </nav>

      <main>

        <section className="dashboard">

          <div>
            <h1>Internship Dashboard</h1>

            <p className="subtitle">
              Keep track of your applications and opportunities.
            </p>
          </div>

          <div className="stats">

            <div className="stat-card">
              <span className="stat-icon">📁</span>

              <div>
                <h3>{total}</h3>
                <p>Total Applications</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">📨</span>

              <div>
                <h3>{applied}</h3>
                <p>Applied</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🎤</span>

              <div>
                <h3>{interviews}</h3>
                <p>Interviews</p>
              </div>
            </div>

            <div className="stat-card">
              <span className="stat-icon">🎉</span>

              <div>
                <h3>{selected}</h3>
                <p>Selected</p>
              </div>
            </div>

          </div>

        </section>


        <section className="form-section">

          <h2>
            {editingId ? "Edit Internship" : "Add Internship"}
          </h2>

          <form onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="input-group">

                <label>Company Name *</label>

                <input
                  type="text"
                  name="company"
                  placeholder="e.g. Zoho"
                  value={form.company}
                  onChange={handleChange}
                />

              </div>


              <div className="input-group">

                <label>Position *</label>

                <input
                  type="text"
                  name="role"
                  placeholder="e.g. Software Intern"
                  value={form.role}
                  onChange={handleChange}
                />

              </div>


              <div className="input-group">

                <label>Location</label>

                <input
                  type="text"
                  name="location"
                  placeholder="e.g. Chennai"
                  value={form.location}
                  onChange={handleChange}
                />

              </div>


              <div className="input-group">

                <label>Application Date *</label>

                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                />

              </div>


              <div className="input-group">

                <label>Deadline</label>

                <input
                  type="date"
                  name="deadline"
                  value={form.deadline}
                  onChange={handleChange}
                />

              </div>


              <div className="input-group">

                <label>Status</label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>

              </div>

            </div>


            <div className="form-buttons">

              <button
                className="primary-btn"
                type="submit"
              >
                {editingId
                  ? "Update Internship"
                  : "+ Add Internship"}
              </button>


              {editingId && (

                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditingId(null);
                    resetForm();
                  }}
                >
                  Cancel
                </button>

              )}

            </div>

          </form>

        </section>


        <section className="applications">

          <div className="section-header">

            <div>
              <h2>My Applications</h2>

              <p>
                Manage and track your internship applications.
              </p>
            </div>


            <div className="controls">

              <input
                type="text"
                placeholder="🔍 Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />


              <select
                value={filterStatus}
                onChange={(e) =>
                  setFilterStatus(e.target.value)
                }
              >

                <option value="All">
                  All Statuses
                </option>

                {statuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}

              </select>

            </div>

          </div>


          {filteredInternships.length === 0 ? (

            <div className="empty">

              <div>📭</div>

              <h3>No internships found</h3>

              <p>
                Add your first internship application above.
              </p>

            </div>

          ) : (

            <div className="internship-grid">

              {filteredInternships.map((internship) => (

                <div
                  className="internship-card"
                  key={internship.id}
                >

                  <div className="card-top">

                    <div className="company-icon">
                      {internship.company
                        .charAt(0)
                        .toUpperCase()}
                    </div>

                    <div className="company-info">

                      <h3>{internship.company}</h3>

                      <p>{internship.role}</p>

                    </div>

                  </div>


                  <div className="details">

                    <p>
                      📍{" "}
                      {internship.location ||
                        "Location not specified"}
                    </p>

                    <p>
                      📅 Applied: {internship.date}
                    </p>

                    {internship.deadline && (

                      <p>
                        ⏰ Deadline: {internship.deadline}
                      </p>

                    )}

                  </div>


                  <div className="status-area">

                    <label>Status</label>

                    <select
                      value={internship.status}
                      onChange={(e) =>
                        changeStatus(
                          internship.id,
                          e.target.value
                        )
                      }
                    >

                      {statuses.map((status) => (

                        <option
                          key={status}
                          value={status}
                        >
                          {status}
                        </option>

                      ))}

                    </select>

                  </div>


                  <div className="card-actions">

                    <button
                      className="edit-btn"
                      onClick={() =>
                        editInternship(internship)
                      }
                    >
                      Edit
                    </button>


                    <button
                      className="delete-btn"
                      onClick={() =>
                        deleteInternship(internship.id)
                      }
                    >
                      Delete
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>

      </main>


      <footer>
        <p>
          InternTrack © 2026 | Internship Management System
        </p>
      </footer>

    </div>
  );
}

export default App;
