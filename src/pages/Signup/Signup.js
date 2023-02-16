import { useRef, useState } from "react";
import style from "./Signup.module.scss";
import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";
import host from "../../utils/host";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const confirmPassword = useRef();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (loading) return;

    if (
      email === "" ||
      password === "" ||
      confirmPassword.current.value === ""
    ) {
      setError("");
      setTimeout(() => {
        return setError("Please fill in all fields");
      }, 10);
    } else if (password !== confirmPassword.current.value) {
      setError("");
      setTimeout(() => {
        return setError("Passwords do not match");
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

        await fetch(`${host}/users`, requestOptions)
          .then((response) => response.json())
          .then((result) => {
            if (result.success === true) {
              window.location.href = "/confirm_your_account";
            } else if (result.error === "Email has already been taken") {
              setError("");
              setTimeout(() => {
                setError("Email has already been taken");
              }, 10);
            }
          })
          .catch((error) => console.log("error", error));
      } catch {
        setError("");
        setTimeout(() => {
          setError("Failed to create an account");
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
        <label>
          Confirm password
          <input type="password" ref={confirmPassword} />
        </label>
        <input
          type="submit"
          value={loading ? "Signing up ... " : "Sign me up"}
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
