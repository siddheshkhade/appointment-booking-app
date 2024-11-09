import React, { useState } from "react";
import "./App.css";

const App = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [currentTab, setCurrentTab] = useState("appointments");
    const [loggedInUser, setLoggedInUser] = useState(null); // Track logged-in user
    const [role, setRole] = useState(""); // Track user role (doctor or patient)
    const [notifications, setNotifications] = useState({});

    // Handle login to set the logged-in user and role
    const handleLogin = (username, password, userRole) => {
        if (username && password) {
            setLoggedInUser(username);
            setRole(userRole); // Set the role to doctor or patient
        }
    };

    // Add an appointment
    const addAppointment = (appointment) => {
        setAppointments([...appointments, { ...appointment, status: "pending" }]);

        // Add patient to the list if not already present, otherwise update date
        const existingPatient = patients.find(
            (patient) => patient.name === appointment.name
        );

        if (existingPatient) {
            existingPatient.date += `, ${appointment.date}`;
            setPatients([...patients]);
        } else {
            setPatients([
                ...patients,
                { id: patients.length + 1, name: appointment.name, date: appointment.date },
            ]);
        }
    };

    // Delete an appointment
    const deleteAppointment = (index) => {
        const deletedAppointment = appointments[index];
        const updatedAppointments = [...appointments];
        updatedAppointments.splice(index, 1);
        setAppointments(updatedAppointments);

        // Remove the deleted patient's appointment from the patients list
        const updatedPatients = patients.filter(
            (patient) => patient.name !== deletedAppointment.name
        );
        setPatients(updatedPatients);
    };

    // Approve an appointment (only for doctors)
    const handleApprove = (index) => {
        const updatedAppointments = [...appointments];
        updatedAppointments[index].status = "approved";
        setAppointments(updatedAppointments);

        const patientName = updatedAppointments[index].name;
        alert(`${patientName}, your appointment request has been approved!`);

        // Notify the patient about the approval
        setNotifications((prev) => ({
            ...prev,
            [patientName]: "Your appointment request has been approved.",
        }));
    };

    // Reject an appointment (only for doctors)
    const handleReject = (index) => {
        const updatedAppointments = [...appointments];
        updatedAppointments[index].status = "rejected";
        setAppointments(updatedAppointments);

        const patientName = updatedAppointments[index].name;
        alert(`${patientName}, your appointment request has been rejected.`);

        // Notify the patient about the rejection
        setNotifications((prev) => ({
            ...prev,
            [patientName]: "Your appointment request has been rejected.",
        }));

        // Remove the rejected patient from the patients list
        const rejectedPatient = updatedAppointments[index].name;
        const updatedPatients = patients.filter(
            (patient) => patient.name !== rejectedPatient
        );
        setPatients(updatedPatients);
    };

    // Handle logout
    const handleLogout = () => {
        setLoggedInUser(null);
        setRole("");
    };

    return (
        <div>
            {!loggedInUser ? (
                <LoginForm handleLogin={handleLogin} />
            ) : (
                <div>
                    <h1>Welcome, {loggedInUser}</h1>
                    <button onClick={handleLogout}>Logout</button>
                    <div className="tabs">
                        {role === "doctor" && (
                            <button
                                onClick={() => setCurrentTab("appointments")}
                                className={currentTab === "appointments" ? "active" : ""}
                            >
                                Appointments
                            </button>
                        )}
                        {role === "patient" && (
                            <>
                                <button
                                    onClick={() => setCurrentTab("appointments")}
                                    className={currentTab === "appointments" ? "active" : ""}
                                >
                                    View Appointments
                                </button>
                                <button
                                    onClick={() => setCurrentTab("bookAppointment")}
                                    className={currentTab === "bookAppointment" ? "active" : ""}
                                >
                                    Book Appointment
                                </button>
                            </>
                        )}
                    </div>

                    {/* Doctor's Appointments Tab */}
                    {role === "doctor" && currentTab === "appointments" && (
                        <div className="appointments-list">
                            <h2>Appointments</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Appointment Date(s)</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {appointments
                                        .filter((appointment) => appointment.status === "pending")
                                        .map((appointment, index) => (
                                            <tr key={index}>
                                                <td>{index + 1}</td>
                                                <td>{appointment.name}</td>
                                                <td>{appointment.date}</td>
                                                <td>{appointment.status}</td>
                                                <td>
                                                    <button onClick={() => handleApprove(index)}>
                                                        Approve
                                                    </button>
                                                    <button onClick={() => handleReject(index)}>
                                                        Reject
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Patient's Appointments Tab */}
                    {role === "patient" && currentTab === "appointments" && (
                        <div className="patient-appointments">
                            <h2>Your Appointments</h2>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Appointment Date(s)</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {patients
                                        .filter((patient) => patient.name === loggedInUser)
                                        .map((patient, index) => (
                                            <tr key={index}>
                                                <td>{patient.id}</td>
                                                <td>{patient.name}</td>
                                                <td>{patient.date}</td>
                                                <td>{notifications[patient.name]}</td>
                                            </tr>
                                        ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Patient's Book Appointment Form */}
                    {role === "patient" && currentTab === "bookAppointment" && (
                        <AppointmentForm addAppointment={addAppointment} />
                    )}
                </div>
            )}
        </div>
    );
};

// Patient's Appointment Form
const AppointmentForm = ({ addAppointment }) => {
    const [name, setName] = useState("");
    const [date, setDate] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        addAppointment({ name, date });
        alert("Appointment booked successfully!");
    };

    return (
        <div className="appointment-form">
            <h2>Book Appointment</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label>Appointment Date:</label>
                    <input
                        type="date"
                        value={date}
                        onChange={(e) => setDate(e.target.value)}
                    />
                </div>
                <button type="submit">Book Appointment</button>
            </form>
        </div>
    );
};

// Login Form for both Doctor and Patient
const LoginForm = ({ handleLogin }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [role, setRole] = useState("doctor");

    const handleSubmit = (e) => {
        e.preventDefault();
        handleLogin(username, password, role);
    };

    return (
      <div className="login-form">
    <h2>Login</h2>
    <form onSubmit={handleSubmit}>
        <div className="form-group">
            <label>Username:</label>
            <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
            />
        </div>
        <div className="form-group">
            <label>Password:</label>
            <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
            />
        </div>
        <div className="form-group">
            <label>Role:</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="doctor">Doctor</option>
                <option value="patient">Patient</option>
            </select>
        </div>
        <button type="submit">Login</button>
    </form>
</div>

    );
};

export default App;
