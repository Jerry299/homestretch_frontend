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
      var myHeaders = new Headers();
      myHeaders.append("Authorization", token);

      fetch(`https://homestretch-api.onrender.com/contents/${content_type}`, {
        headers: myHeaders,
      })
        .then((response) => response.json())
        .then((result) => {
          setContents(result);
        })
        .catch((error) => console.log("error", error));
    };
    fetchContents();
  }, [content_type, token]);

  return (
    <div className={style.main}>
      <Header>
        <h1 className={style.header_title}>HomeStretch Education Center</h1>
        <p className={style.header_paragraph}>
          The home buying process can be very stressful, but we are here to help
          mitigate the stress that comes with buying that perfect home that you
          love.
        </p>
      </Header>
      <h2>Recommended Contents</h2>
      <p>
        Explore recommend homebuying educational content based on your profile.
      </p>
      <div className={style.cards}>
        {contents.map((content) => (
          <Link
            to={`/contents/education/${content.id}/${content.title.replace(
              /[^a-z0-9]/gi,
              "-"
            )}`}
            className={style.card}
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
