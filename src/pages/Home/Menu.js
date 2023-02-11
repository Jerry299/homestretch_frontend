import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { BiChevronDown } from "react-icons/bi";
import style from "./Menu.module.scss";

export default function Menu(props) {
  const user = useSelector((state) => state.user);
  const [resources, setResources] = useState([]);
  const token = localStorage.getItem("token");
  const [showResources, setShowResources] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const ul = useRef(null);
  const resourceList = useRef(null);
  const avatar = useRef(null);
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [ulStyle, setUlStyle] = useState({
    top: rect.y + rect.height + window.scrollY,
    left: rect.x,
    maxHeight: props.maxHeight + "px",
  });

  useOutsideAlerter(ul, () => {
    setShowResources(false);
    setShowUserMenu(false);
  });

  useEffect(() => {
    const getRes = async () => {
      fetch(`https://homestretch-api.onrender.com/contents/resource`)
        .then((response) => response.json())
        .then((result) => {
          setResources(
            result.map((res) => {
              return { id: res.id, title: res.title };
            })
          );
        })
        .catch((error) => console.log("error", error));
    };
    getRes();
  }, [token]);

  const handleResourceMenuClick = (e) => {
    e.preventDefault();
    let rect = resourceList.current.getBoundingClientRect();
    setRect({ rect });
    setUlStyle({
      ...ulStyle,
      top: rect.y + rect.height + window.scrollY,
      left: rect.x,
    });
    setShowResources(true);
  };

  const handleUserMenuClick = (e) => {
    e.preventDefault();
    let rect = avatar.current.getBoundingClientRect();
    setRect({ rect });
    setUlStyle({
      ...ulStyle,
      top: rect.y + rect.height + window.scrollY + 5,
      left: rect.x,
    });
    setShowUserMenu(true);
  };

  const signOut = (e) => {
    e.preventDefault();
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <nav className={style.main}>
      <Link
        className={`${style.logo} ${props.alt ? style.alt : ""}`}
        to="/"
      ></Link>
      <p className={`${style.links} ${props.alt ? style.alt : ""}`}>
        <Link to="/contents/education">Education center</Link>
        <Link
          to=""
          onClick={(e) => handleResourceMenuClick(e)}
          ref={resourceList}
        >
          Resources
          <BiChevronDown />
        </Link>
        <Link to="/contents/education">Blog</Link>
        <Link to="/contents/education">About</Link>
        <Link to="/contents/education">Contact</Link>
      </p>
      {token && (
        <img
          className={style.avatar}
          src={
            user.avatar
              ? user.avatar
              : "https://icon-library.com/images/guest-account-icon/guest-account-icon-12.jpg"
          }
          alt="avatar"
          ref={avatar}
          onClick={(e) => handleUserMenuClick(e)}
        />
      )}
      {!token && (
        <div>
          <Link
            to="/sign_in"
            className={`${style.button} ${style.btnSignIn} ${
              props.alt ? style.alt : ""
            }`}
          >
            Log in
          </Link>
          <Link
            to="/sign_up"
            className={`${style.button} ${style.btnSignUp} ${
              props.alt ? style.alt : ""
            }`}
          >
            Sign up
          </Link>
        </div>
      )}
      {showResources && (
        <ul className={style.ul} ref={ul} style={ulStyle}>
          {resources.map((item, i) => {
            return (
              <li key={item.id}>
                <Link
                  to={`/contents/resource/${item.id}/${item.title.replace(
                    /[^a-z0-9]/gi,
                    "-"
                  )}`}
                  onClick={() => setShowResources(false)}
                >
                  {item.title}
                </Link>
              </li>
            );
          })}
        </ul>
      )}
      {showUserMenu && (
        <ul className={style.ul} ref={ul} style={ulStyle}>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/" onClick={(e) => signOut(e)}>
              Sign Out
            </Link>
          </li>
        </ul>
      )}
    </nav>
  );
}

function useOutsideAlerter(ref, callback) {
  useEffect(() => {
    function handleClickOutside(event) {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, callback]);
}
