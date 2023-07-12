import React, { useState } from "react";
import Form from "react-bootstrap/Form";
import "bootstrap/dist/css/bootstrap.min.css";
import "./login.css";
import axios from "axios";
import swal from 'sweetalert';


const Home = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();


    setErrors("Invalid credentials");

    const validationErrors = {};

    // Validate email
    if (!email) {
      validationErrors.email = "Email is required";
      console.log("Email is required");
    }

    // Validate password
    if (!password) {
      validationErrors.password = "Password is required";
    } else if (password.length < 8) {
      validationErrors.password = "Password must be at least 8 characters long";
    } else if (!/(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*\W)/.test(password)) {
      validationErrors.password =
        "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character";
    }

    axios
      .post("/api/login", {
        email,
        password,
      })
      .then((response) => {
        const { token } = response.data;
        // Save the token in local storage or any other secure location
        localStorage.setItem("token", token);
        // Reset form and errors
        setEmail("");
        setPassword("");
        setErrors({});
        axios
          .get("api/user", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })

          .then((response) => {
            const data = response.data.data;
            swal("Success", "Successfully logged in", "success");
            localStorage.setItem("user_id", data._id);
            localStorage.setItem("user_email", data.email);
            localStorage.setItem("user_role", data.role);
            
            setTimeout(() => {
              window.location.href = "/dashboard";
            }, 2000);

          });
      })
      .catch((error) => {
        // Handle error response from the backend (e.g., incorrect credentials)
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          
          swal({
            title: "Error",
            text: error.response.data.message,
            icon: "error",
            button: "OK",
          });
          console.log(error.response.data.message);
        } else {
          
          swal({
            title: "Error",
            text: "An error occurred. Please try again later.",
            icon: "error",
            button: "OK",
          });
          
        }
      });
  };

  const pageStyles = {
    margin: 0,
    padding: 0,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    minHeight: "100vh",
    fontFamily: "Jost, sans-serif",
  };

  const mainStyles = {
    width: "350px",
    height: "500px",
    background: "lightgreen",
    overflow: "hidden",
    backgroundImage:
      'url("https://doc-08-2c-docs.googleusercontent.com/docs/securesc/68c90smiglihng9534mvqmq1946dmis5/fo0picsp1nhiucmc0l25s29respgpr4j/1631524275000/03522360960922298374/03522360960922298374/1Sx0jhdpEpnNIydS4rnN4kHSJtU1EyWka?e=view&authuser=0&nonce=gcrocepgbb17m&user=03522360960922298374&hash=tfhgbs86ka6divo3llbvp93mg4csvb38")',
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    backgroundSize: "cover",
    borderRadius: "10px",
    boxShadow: "5px 20px 50px #000",
  };

  const signupStyles = {
    position: "relative",
    width: "100%",
    height: "100%",
  };

  const labelStyles = {
    fontSize: "1.5em",
    justifyContent: "center",
    display: "flex",
    margin: "60px",
    fontWeight: "bold",
    cursor: "pointer",
    transition: "0.5s ease-in-out",
  };

  const inputStyles = {
    width: "80%",
    height: "40px",
    background: "#e0ffff	",
    justifyContent: "center",
    display: "flex",
    margin: "20px auto",
    padding: "10px",
    border: "none",
    outline: "none",
    borderRadius: "5px",
  };

  const buttonStyles = {
    width: "50%",
    height: "40px",
    margin: "10px auto",
    justifyContent: "center",
    display: "block",
    background: "pink",
    fontSize: "1em",
    fontWeight: "bold",
    marginTop: "20px",
    outline: "none",
    border: "none",
    borderRadius: "5px",
    transition: "0.2s ease-in",
    cursor: "pointer",
  };

  return (
    <div style={pageStyles}>
      <div className="main" style={mainStyles}>
        <div className="signup" style={signupStyles}>
          <label htmlFor="chk" style={labelStyles}>
            IRO <br />
            Leave Management System
          </label>
          <Form onSubmit={handleSubmit}>
            <span>
              <strong>Email address</strong>
            </span>
            <input
              type="text"
              placeholder="email@example.com..."
              style={inputStyles}
              value={email}
              onChange={handleEmailChange}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
            <span>
              <strong>Password</strong>
            </span>
            <input
              type="password"
              placeholder="enter your password..."
              style={inputStyles}
              value={password}
              onChange={handlePasswordChange}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password}
            </Form.Control.Feedback>

            <button style={buttonStyles} type="submit">
              Login
            </button>
          </Form>
        </div>
      </div>
    </div>
  );
};

export default Home;
