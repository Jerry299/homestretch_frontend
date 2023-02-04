import Footer from "../Home/Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Menu from "../Home/Menu";
import style from "./Content.module.scss";

export default function Content() {
  const { content_type, id } = useParams();
  const token = localStorage.getItem("token");
  const [content, setContent] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContent = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", token);

      fetch(`https://homestretch-api.onrender.com/contents/${id}`, {
        headers: myHeaders,
      })
        .then((response) => {
          console.log(response);
          return response.json();
        })
        .then((result) => {
          console.log(result);
          setContent({
            id: result.content.id,
            title: result.content.title,
            thumbnail: result.content.thumbnail,
            pages: result.pages.map((page, i) => {
              if (i == 0) return { ...page, active: true, index: i };
              return { ...page, active: false, index: i };
            }),
          });
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    };
    fetchContent();
  }, [id, token]);

  console.log(content);

  const handleNext = (e, index) => {
    e.preventDefault();
    const newContent = {
      ...content,
      pages: content.pages.map((page, i) => {
        if (i === index + 1) return { ...page, active: true };
        return { ...page, active: false };
      }),
    };
    setContent(newContent);
  };

  const handlePrevious = (e, index) => {
    e.preventDefault();
    const newContent = {
      ...content,
      pages: content.pages.map((page, i) => {
        if (i === index - 1) return { ...page, active: true };
        return { ...page, active: false };
      }),
    };
    setContent(newContent);
  };

  return (
    <>
      <Menu alt="true" />
      <div className={style.main}>
        <h1>{content.title}</h1>
        {loading && <p>Loading...</p>}
        {!loading &&
          content.pages
            .filter((page) => page.active)
            .map((page, i) => (
              <div key={page.id}>
                <div className={style.header}>
                  <h2>{page.title}</h2>
                  <div className={style.navigate}>
                    {page.index > 0 && (
                      <button
                        className={style.button_alt}
                        onClick={(e) => handlePrevious(e, page.index)}
                      >
                        Previous
                      </button>
                    )}
                    {page.index < content.pages.length - 1 && (
                      <button
                        className={style.button}
                        onClick={(e) => handleNext(e, page.index)}
                      >
                        Next
                      </button>
                    )}
                  </div>
                </div>
                <div
                  className={style.body}
                  dangerouslySetInnerHTML={{
                    __html: videoRenderedBody(page.body),
                  }}
                />
              </div>
            ))}
      </div>
      <Footer />
    </>
  );
}

const videoRenderedBody = (body) => {
  const oembedRegex = /<oembed[^>]*>/g;
  const oembedMatch = body.match(oembedRegex);
  if (oembedMatch) {
    const oembedUrl = oembedMatch[0]
      .match(/url="([^"]*)"/)[1]
      .replace("watch?v=", "embed/");
    console.log(oembedUrl);
    const iframeElement = `<iframe src="${oembedUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    return body.replace(oembedRegex, iframeElement);
  }
};
