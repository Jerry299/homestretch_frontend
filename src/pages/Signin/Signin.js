import { useState } from "react";
import style from "./Signin.module.scss";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import host from "../../utils/host";

export default function Signin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (email === "" || password === "") {
      setError("");
      setTimeout(() => {
        return setError("Please fill in all fields");
      }, 10);
    } else {
      try {
        setError("");
        setLoading(true);
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
          user: { email, password },
        });

        var requestOptions = {
          method: "POST",
          headers: myHeaders,
          body: raw,
          redirect: "follow",
        };

        const response = await fetch(`${host}/users/sign_in`, requestOptions);

        const result = await response.json();
        if (result.success === true) {
          const token = [...response.headers][0][1];
          localStorage.setItem("token", token);
          if (result.data.first_update_date) {
            window.location.href = "/";
          } else {
            window.location.href = "/profile";
          }
        } else if (result.error === "Invalid Email or password.") {
          setError("");
          setTimeout(() => {
            setError("Invalid Email or password.");
          }, 10);
        }
      } catch {
        setError("");
        setTimeout(() => {
          setError("Sining in failed");
        }, 10);
      }
    }

    setLoading(false);
  };

  return (
    <div class={style.main}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <header>
          <div>
            <Link to="/sign_in"> Sign in </Link>
          </div>
          <div>
            <Link to="/sign_up"> Create account </Link>
          </div>
        </header>
        <label>
          Email address
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Choose password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <input
          type="submit"
          value={loading ? "Signing in ... " : "Sign in"}
          className={loading ? style.loading : ""}
        />
        {error && <p>{error}</p>}
      </form>
      <div>
        <img src="https://i.ibb.co/d0T7zsC/homestretch.png" alt="logo" />
        <h1>Welcome to HomeStretch</h1>
        <p>
          Sign up for a HomeStretch account to access all resources and
          educational content to help you navigate the home buying process.
        </p>
      </div>
    </div>
  );
}
