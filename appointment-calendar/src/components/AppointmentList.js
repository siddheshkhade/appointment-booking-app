import React from "react";

const AppointmentList = ({
    appointments,
    deleteAppointment,
    clearAppointments,
    editAppointment,
    reorderAppointments,
    handleApprove,
    handleReject
}) => {

    return (
        <div>
            <h2>Appointments</h2>
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Appointment Date</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment, index) => (
                        <tr key={index}>
                            <td>{appointment.name}</td>
                            <td>{appointment.date}</td>
                            <td>{appointment.status}</td>
                            <td>
                                {appointment.status === "pending" && (
                                    <>
                                        <button onClick={() => handleApprove(index)}>Approve</button>
                                        <button onClick={() => handleReject(index)}>Reject</button>
                                    </>
                                )}
                                <button onClick={() => deleteAppointment(index)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={clearAppointments}>Clear All Appointments</button>
        </div>
    );
};

export default AppointmentList;
