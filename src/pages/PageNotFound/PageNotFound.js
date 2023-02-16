import { Link } from "react-router-dom";
import Footer from "../Home/Footer";
import Menu from "../Home/Menu";
import style from "./PageNotFound.module.scss";

export default function PageNotFound() {
  return (
    <div>
      <Menu alt="true" />
      <div className={style.main}>
        <img src="page_not_found.svg" alt="404" sty />
        <h2>Oops Page Not Found!!!</h2>
        <p>
          Sorry, the page you’re looking for doesn’t exist or has been moved but
          have no fear, we’re working on it.
        </p>
        <Link to="/" className={style.button}>
          Go Back to Homepage
        </Link>
      </div>
      <Footer />
    </div>
  );
}
