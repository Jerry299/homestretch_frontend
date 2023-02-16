import Footer from "../Home/Footer";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
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
        .then((response) => response.json())
        .then((result) => {
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

  const scrollTo = (e, id) => {
    e.preventDefault();
    const element = document.getElementById(id);
    const offset = 30;
    const bodyRect = document.body.getBoundingClientRect().top;
    const elementRect = element.getBoundingClientRect().top;
    const elementPosition = elementRect - bodyRect;
    const offsetPosition = elementPosition - offset;
    document.documentElement.scrollTop = offsetPosition;
  };

  const [titlesStyle, setTitlesStyle] = useState({});
  const [activeTitle, setActiveTitle] = useState(
    content.pages ? content.pages[0].title : ""
  );

  useEffect(() => {
    const handleScroll = () => {
      let titles = Array.from(document.getElementsByClassName("title"));
      setActiveTitle(
        titles
          .map((el) => {
            return {
              title: el,
              top: el.getBoundingClientRect().top,
            };
          })
          .filter((el) => el.top > 25)[0].title.innerHTML
      );
      setTitlesStyle(
        window.scrollY > document.body.scrollHeight - 760
          ? {
              position: "fixed",
              top: -(window.scrollY - document.body.scrollHeight + 750) + "px",
              width: "250px",
            }
          : window.scrollY > 120
          ? { position: "fixed", top: "10px", width: "250px" }
          : {}
      );
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <Menu alt="true" />
      <div className={style.main}>
        {loading && <p>Loading...</p>}
        {!loading &&
          content_type == "education" &&
          content.pages
            .filter((page) => page.active)
            .map((page, i) => (
              <div key={page.id} className={style.education}>
                <h1>{content.title}</h1>
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
                    __html: videoRenderedBody(
                      page.body +
                        (page.index == content.pages.length - 1
                          ? `<a href="/contents/education" class="${style.button}" 
                              style="margin: 100px auto 0 auto; 
                                     display: block;
                                     width: 200px;
                                     text-align: center;
                              }">
                                Back to learning center
                             </a>`
                          : "")
                    ),
                  }}
                />
              </div>
            ))}
        {!loading && content_type == "resource" && (
          <div className={style.resource}>
            <div className={style.titlesContainer}>
              <div className={style.titles} style={titlesStyle}>
                <h3>CONTENTS ON THIS PAGE</h3>
                <ul>
                  {content.pages.map((page, i) => (
                    <li
                      key={page.id}
                      className={`${
                        activeTitle === page.title ? style.active : ""
                      }`}
                    >
                      <Link
                        onClick={(e) =>
                          scrollTo(e, page.title.replace(/[^a-z0-9]/gi, "-"))
                        }
                      >
                        {page.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div>
              <h1>{content.title}</h1>
              {content.pages.map((page, i) => (
                <div key={page.id}>
                  <h2
                    className="title"
                    id={page.title.replace(/[^a-z0-9]/gi, "-")}
                  >
                    {page.title}
                  </h2>
                  <div dangerouslySetInnerHTML={{ __html: page.body }}></div>
                </div>
              ))}
            </div>
          </div>
        )}
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
    const iframeElement = `<iframe src="${oembedUrl}" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
    return body.replace(oembedRegex, iframeElement);
  }
  return body;
};
