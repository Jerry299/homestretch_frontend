import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import style from "./Menu.module.scss";
export default function Menu(props) {
  const user = useSelector((state) => state.user);
  return (
    <nav className={style.main}>
      <Link className={style.logo} to="/"></Link>
      <p className={`${style.links} ${props.alt ? style.alt : ""}`}>
        <Link to="/contents/education">Learning center</Link>
        <Link to="/contents/education">Learning center</Link>
        <Link to="/contents/education">Blog</Link>
        <Link to="/contents/education">About</Link>
        <Link to="/contents/education">Contact</Link>
      </p>
      <img
        className={style.avatar}
        src={
          user.avatar
            ? user.avatar
            : "https://icon-library.com/images/guest-account-icon/guest-account-icon-12.jpg"
        }
        alt="avatar"
      />
    </nav>
  );
}
