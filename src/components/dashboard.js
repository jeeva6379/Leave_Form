import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactHTMLTableToExcel from "react-html-table-to-excel";

import {
  FaRegFileAlt,
  FaUserPlus,
  FaUsers,
  FaSearch,
  FaUser,
  FaEdit,
  FaCalendarAlt,
  FaClock,
  FaTag,
  FaTasks,
  FaUserShield,
  FaTrash,
} from "react-icons/fa";
import "bootstrap/dist/css/bootstrap.min.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

import "../styles.css";

const Dashboard = () => {
  const [userRole, setUserRole] = useState("");
  const [chartData, setChartData] = useState([]);

  const [tableDisplayName, setTableDisplayName] = useState("");

  const [employeeData, setEmployeeData] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");

  useEffect(() => {
    fetchEmployeeData();
  }, []);

  const fetchEmployeeData = async () => {
    try {
      const response = await fetch("/api/employeedata");
      const data = await response.json();
      if (response.ok) {
        setEmployeeData(data.data);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error fetching employee data:", error);
    }
  };

  const handleRoleSelect = (e) => {
    const id = e.target.value;
    setSelectedRole("");

    if (id) {
      fetch(`/api/employeeleaveapplications/${id}`)
        .then((res) => res.json())
        .then((json) => setChartData(json.data));

      employeeData.map((e) => {
        if (e._id === id) {
          setTableDisplayName(` - ${e.name}`);
        }
      });
    } else {
      fetch("/api/allleaveapplications")
        .then((res) => res.json())
        .then((json) => setChartData(json.data));
      setTableDisplayName(" - All Employees");
    }

    setSelectedRole(e.target.value);
  };

  const fetchData = async () => {
    if (userRole === "Admin" || userRole === "HR") {
      fetch("/api/allleaveapplications")
        .then((res) => res.json())
        .then((json) => setChartData(json.data));
      setTableDisplayName(" - All Employees");
    }
    if (userRole === "Employee") {
      const user_id = localStorage.getItem("user_id");
      fetch(`/api/employeeleaveapplications/${user_id}`)
        .then((res) => res.json())
        .then((json) => setChartData(json.data));
    }
  };

  useEffect(() => {
    const user_role = localStorage.getItem("user_role");

    if (!user_role) {
      window.location.href = "/";
    }

    setUserRole(user_role);
    fetchData();
  }, [userRole]);

  const handleButtonClick = (path) => {
    window.location.href = path;
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/allleaveapplications/${id}`);
      fetchData(); // Fetch updated data after successful deletion
    } catch (error) {
      console.log(error);
    }
  };
  //to design on the inline style in react css

  const navButtonStyles = {
    display: "flex",
    alignItems: "center",
    margin: "0 10px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };

  const dropdownStyles = {
    display: "flex",
    alignItems: "center",
    position: "relative",
    margin: "0 10px",
    padding: "5px 10px",
    border: "none",
    borderRadius: "5px",
    fontSize: "14px",
    cursor: "pointer",
    transition: "background-color 0.3s ease",
  };
  const dropdownIconStyles = {
    marginRight: "5px",
  };

  //get total leave calculate in the function

  const getTotalLeave = () => {
    let totalLeave = 0;
    chartData.forEach((item) => {
      totalLeave += item.daysCount;
    });
    return totalLeave;
  };

  const totalLeave = getTotalLeave();

  // Calculate total leave for each employee
  const employeeLeaveData = employeeData.map((employee) => {
    const employeeLeaveDays = chartData.reduce((totalDays, item) => {
      if (item.user_id === employee._id) {
        return totalDays + item.daysCount;
      }
      return totalDays;
    }, 0);

    return {
      name: employee.name,
      totalLeave: employeeLeaveDays,
    };
  });

  return (
    <div>
      {/* to try oin sample data chart in react js program without error */}

      <h1>Welcome To Dashboard</h1>
      <br />
      <div className="d-flex flex-col flex-wrap  flex-md-row justify-content-between">
        <div className="d-flex flex-col flex-wrap  flex-md-row">
          <button
            className="ml-3 ms-3  my-2 btn btn-info"
            style={navButtonStyles}
            onClick={() => handleButtonClick("/userleaveform")}
          >
            <FaRegFileAlt style={dropdownIconStyles} />
            Leave Application Form
          </button>

          {userRole === "Admin" && (
            <button
              className="ml-3 ms-3  my-2  btn btn-secondary "
              style={navButtonStyles}
              onClick={() => handleButtonClick("/Createnewuser")}
            >
              <FaUserPlus style={dropdownIconStyles} />
              Create New User
            </button>
          )}

          {userRole === "Admin" && (
            <button
              className="ml-3 ms-3 my-2 btn btn-warning"
              style={navButtonStyles}
              onClick={() => handleButtonClick("/userstored")}
            >
              <FaUsers style={dropdownIconStyles} />
              Manage Employees
            </button>
          )}
        </div>
        {userRole !== "Employee" && (
          <div style={dropdownStyles} className="ml-3 ms-3">
            <span className="text-nowrap my-auto h6 mr-2 me-2 btn btn-primary ">
              {" "}
              Filter Employees:
            </span>
            <div className="input-group">
              <select
                className="custom-select form-select"
                value={selectedRole}
                onChange={handleRoleSelect}
              >
                <option value="">All Employees</option>
                {employeeData.map((user) => (
                  <option key={user._id} value={user._id}>
                    {user.name}
                  </option>
                ))}
              </select>
              <div className="input-group-append">
                <div className="input-group-text">
                  <FaSearch className="h4 my-auto" />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className="row mt-5">
        <div className="col-lg-4 mb-5">
          {/* Render the BarChart component */}
          <div className="chart-container ">
            <div
              style={{ width: "100%", maxWidth: "500px", overflowX: "auto" }}
            >
              <BarChart
                className="barchart mx-auto "
                height={500}
                width={500}
                data={employeeLeaveData}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="totalLeave" fill="#8a3ffc" name="Total Leave" />
              </BarChart>
            </div>
          </div>
        </div>

        <div className="col-lg-8 mb-5">
          {/* <h5 className="text-start ">
            {" "}
            Leave Applications{" "}
            <span className="text-start text-primary">{tableDisplayName}</span>
            &nbsp;
            <span className="text-end">
              <ReactHTMLTableToExcel
                id="exportButton"
                className="btn btn-primary"
                table="leaveTable"
                filename="leave_data"
                sheet="leave_sheet"
                buttonText="Export to Excel"
              />
            </span>
          </h5> */}




<h5 className="text-start">
          Leave Applications{' '}
          <span className="text-start text-primary">{tableDisplayName}</span>
          &nbsp;
          <span className=" btn-lg float-right">
            <ReactHTMLTableToExcel
              id="exportButton"
              className="btn btn-primary"
              table="leaveTable"
              filename="leave_data"
              sheet="leave_sheet"
              buttonText="Export to Excel"
            />
          </span>
        </h5>

          <br />
          <div className="table-responsive">
            <table
              id="leaveTable"
              className="table shadow-sm"
              style={{ width: "100%" }}
            >
              <thead>
                <tr>
                  <th scope="row">No</th>
                  {userRole !== "Employee" && <th>Name</th>}
                  <th>
                    <FaCalendarAlt />
                    Starting Date
                  </th>
                  <th>
                    <FaCalendarAlt />
                    Ending Date
                  </th>
                  <th>
                    <FaClock />
                    Number of days
                  </th>
                  <th>
                    <FaTag />
                    Mode of Leave
                  </th>
                  <th>
                    <FaTasks />
                    Work Responsibility / Alteration
                  </th>
                  <th>
                    <FaUserShield />
                    Admin Status
                  </th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {chartData.map((item, index) => (
                  <tr key={item._id}>
                    <td>{index + 1}</td>
                    {userRole !== "Employee" && (
                      <td>
                        {employeeData.map((e) => {
                          if (e._id === item.user_id) {
                            return e.name;
                          }
                        })}
                      </td>
                    )}
                    <td>{item.startingDate}</td>
                    <td>{item.endingDate}</td>
                    <td>{item.daysCount}</td>
                    <td>{item.modeOfLeave}</td>
                    <td>
                      <div className="row">
                        {item.workAlteration.map((i) => {
                          return (
                            <>
                              <div className="col-lg-6 my-1">
                                <FaEdit className="opacity-50 mr-1 ms-1 small" />{" "}
                                {i[0]}
                              </div>
                              <div className="col-lg-6 my-1">
                                <FaUser className="opacity-50 mr-1 ms-1 small" />{" "}
                                {i[1]}
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </td>
                    <td>
                      {item.decision === "Accepted" ? (
                        <span className="text-success">{item.decision}</span>
                      ) : item.decision === "Rejected" ? (
                        <span className="text-danger">{item.decision}</span>
                      ) : (
                        item.decision
                      )}
                    </td>
                    <td>
                      {userRole === "Admin" && (
                        <button
                          style={{ color: "darkred" }}
                          onClick={() => handleDelete(item._id)}
                        >
                          <FaTrash />
                        </button>
                      )}{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <br />
            {userRole !== "Employee" && (
              <div>
                <table id="employeeTable">
                  <thead>
                    <tr>
                      <th style={{ border: "1px solid black", padding: "5px" }}>
                        Name
                      </th>
                      <th style={{ border: "1px solid black", padding: "5px" }}>
                        Leave Days Taken
                      </th>
                      <th style={{ border: "1px solid black", padding: "5px" }}>
                        Total Leave Allowed
                      </th>
                      <th style={{ border: "1px solid black", padding: "5px" }}>
                        Remaining Leave
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {employeeData.map((employee) => {
                      const employeeLeaveDays = chartData.reduce(
                        (totalDays, item) => {
                          if (item.user_id === employee._id) {
                            return totalDays + item.daysCount;
                          }
                          return totalDays;
                        },
                        0
                      );

                      const leaveDaysAllowed = 18;
                      const remainingLeave =
                        leaveDaysAllowed - employeeLeaveDays;

                      const remainingLeaveStyle =
                        remainingLeave > 18 ? { color: "red" } : {};

                      return (
                        <tr key={employee._id}>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {employee.name}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {employeeLeaveDays}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                            }}
                          >
                            {leaveDaysAllowed}
                          </td>
                          <td
                            style={{
                              border: "1px solid black",
                              padding: "5px",
                              ...remainingLeaveStyle,
                            }}
                          >
                            {remainingLeave >= 0 ? (
                              remainingLeave
                            ) : (
                              <span className="text-danger">
                                {"0 + extra " +
                                  Math.abs(remainingLeave) +
                                  " days leave taken"}
                              </span>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>{" "}
                  <br />
                </table>

                <ReactHTMLTableToExcel
                  id="downloadExcelBtn"
                  className="download-table-xls-button btn btn-warning"
                  table="employeeTable"
                  filename="employee_data"
                  sheet="employee_data"
                  buttonText="Export to Excel"
                />
              </div>
            )}

            <p style={{ textAlign: "center" }}>Total Leave: {totalLeave}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
