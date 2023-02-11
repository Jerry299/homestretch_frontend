import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Home/Header";
import style from "./ContentsList.module.scss";
import { Link } from "react-router-dom";
import Footer from "../Home/Footer";

export default function ContentsList() {
  const token = localStorage.getItem("token");
  const { content_type } = useParams();

  const [contents, setContents] = useState([]);

  useEffect(() => {
    const fetchContents = async () => {
      fetch(`https://homestretch-api.onrender.com/contents/${content_type}`)
        .then((response) => response.json())
        .then((result) => {
          setContents(result);
        })
        .catch((error) => console.log("error", error));
    };
    fetchContents();
  }, [content_type, token]);

  const inlineStyle = {
    backgroundImage: `linear-gradient(
      90deg,
      rgba(7, 26, 68, 0.45) 0%,
      rgba(7, 26, 68, 0.45) 100%
    ),
    url("https://i.ibb.co/LPyXjW2/Education-center-image-min.jpg")`,
    backgroundSize: "100% auto",
    backgroundPosition: "0 -60px",
    height: "45vw",
  };

  return (
    <div className={style.main}>
      <Header inlineStyle={inlineStyle}>
        <h1 className={style.header_title}>HomeStretch Education Center</h1>
        <p className={style.header_paragraph}>
          The home buying process can be very stressful, but we are here to help
          mitigate the stress that comes with buying that perfect home that you
          love.
        </p>
      </Header>
      <h2>Recommended Contents</h2>
      <p>
        Explore recommended homebuying educational content based on your
        profile.
      </p>
      <div className={style.cards}>
        {contents.map((content) => (
          <Link
            to={
              token
                ? `/contents/education/${content.id}/${content.title.replace(
                    /[^a-z0-9]/gi,
                    "-"
                  )}`
                : `/sign_in`
            }
            className={`${style.card} ${token && style.signed_in}`}
          >
            <img src={content.thumbnail} alt={content.title} />
            <h3>{content.title}</h3>
          </Link>
        ))}
      </div>
      <Footer />
    </div>
  );
}
