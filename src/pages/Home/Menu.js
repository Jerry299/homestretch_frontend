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
  const ul = useRef(null);
  const resourceList = useRef(null);
  const [rect, setRect] = useState({ x: 0, y: 0, width: 0, height: 0 });
  const [ulStyle, setUlStyle] = useState({
    top: rect.y + rect.height + window.scrollY,
    left: rect.x,
    maxHeight: props.maxHeight + "px",
  });

  useOutsideAlerter(ul, () => {
    setShowResources(false);
  });

  useEffect(() => {
    const getRes = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", token);

      fetch(`https://homestretch-api.onrender.com/contents/resource`, {
        headers: myHeaders,
      })
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
      <img
        className={style.avatar}
        src={
          user.avatar
            ? user.avatar
            : "https://icon-library.com/images/guest-account-icon/guest-account-icon-12.jpg"
        }
        alt="avatar"
      />
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
