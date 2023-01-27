import { useRef, useState } from "react";
import style from "./Signin.module.scss";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

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

        const response = await fetch(
          "https://homestretch-api.onrender.com/users/sign_in",
          requestOptions
        );

        const result = await response.json();
        if (result.message === "Signed in successfully.") {
          const token = [...response.headers][0][1];
          localStorage.setItem("token", token);
          window.location.href = "/profile";
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
        <h1>Welcome to Homestretch</h1>
        <p>
          Sign up for a HomeStretch account to access all resources and
          educational content to help you navigate the home buying process.
        </p>
        <div className={style.socials}>
          <Link to="">
            <FaFacebookF />
          </Link>
          <Link to="">
            <FaTwitter />
          </Link>
          <Link to="">
            <FaInstagram />
          </Link>
          <Link to="">
            <FaLinkedinIn />
          </Link>
        </div>
      </div>
    </div>
  );
}
