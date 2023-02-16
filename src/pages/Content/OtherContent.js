import { useEffect, useState } from "react";
import Menu from "../Home/Menu";
import Footer from "../Home/Footer";
import style from "./OtherContent.module.scss";

export default function Home({ content_type }) {
  const [content, setContent] = useState(null);

  useEffect(() => {
    const fetchContent = async () => {
      fetch(
        `https://homestretch-api.onrender.com/contents/other/${content_type}`
      )
        .then((response) => response.json())
        .then((result) => {
          setContent({
            body: result[0].pages[0].body,
          });
        })
        .catch((error) => console.log("error", error));
    };
    fetchContent();
  }, [content_type]);

  return (
    <div>
      <Menu alt="true" />
      {!content && <h2>Loading...</h2>}
      {content && (
        <div
          dangerouslySetInnerHTML={{ __html: content.body }}
          className={style.main}
        ></div>
      )}
      <Footer />
    </div>
  );
}
