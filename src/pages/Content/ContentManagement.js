import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { IoAddOutline } from "react-icons/io5";
import { IoMdTrash } from "react-icons/io";

import style from "./ContentManagement.module.scss";
import editorStyle from "./Contents_editor.css";
import axios from "axios";

import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

export default function ContentManagement() {
  const { content_type } = useParams();
  const [contents, setContents] = useState([]);
  const tabClickControl = useRef(false);
  const [saving, setSaving] = useState(false);
  const [loadingContent, setLoadingContent] = useState(false);

  const defaultContent = {
    id: null,
    title: "",
    thumbnail: "",
    content_type,
    pages: [
      {
        id: 1,
        title: "New Page",
        body: "",
        active: true,
      },
    ],
    activePage: 1,
  };

  const [content, setContent] = useState(defaultContent);

  const token = localStorage.getItem("token");

  const [uploading, setUploading] = useState(false);
  const fileInput = useRef();

  const uploadFile = (e) => {
    if (e.target.files.length == 0) return;

    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);

    setUploading(true);
    axios
      .post(
        `https://api.imgbb.com/1/upload?key=17376f325381f791797a46f76f1df6ca`,
        formData
      )
      .then((res) => {
        setUploading(false);
        setContent({ ...content, thumbnail: res.data.data.url });
      });
  };

  useEffect(() => {
    const fetchContents = async () => {
      var myHeaders = new Headers();
      myHeaders.append("Authorization", token);

      const url = ["resource", "education"].includes(content_type)
        ? `https://homestretch-api.onrender.com/contents/${content_type}`
        : `https://homestretch-api.onrender.com/contents/other/${content_type}`;
      fetch(url, {
        headers: myHeaders,
      })
        .then((response) => response.json())
        .then((result) => setContents(result))
        .catch((error) => console.log("error", error));
    };
    fetchContents();
  }, [content_type, token]);

  const selectFile = () => {
    if (!uploading) fileInput.current.click();
  };

  const addPage = (e) => {
    e.preventDefault();
    tabClickControl.current = true;
    const tempId = new Date().getTime();
    const newPage = {
      id: tempId,
      title: "New Page",
      body: "",
      active: true,
    };
    setContent({
      ...content,
      pages: [
        ...content.pages.map((page) => {
          return { ...page, active: false };
        }),
        newPage,
      ],
    });
  };

  const removeTab = (e, id) => {
    e.stopPropagation();
    tabClickControl.current = true;
    const newPages = content.pages.filter((page) => page.id != id);
    if (newPages.length == 0) return;
    setContent({
      ...content,
      pages: newPages.map((el, i) => {
        if (i == 0 && newPages.filter((page) => page.active).length == 0)
          return { ...el, active: true };
        return el;
      }),
    });
  };

  const handleTabClick = (id) => {
    tabClickControl.current = true;
    setContent({
      ...content,
      pages: content.pages.map((page) => {
        if (page.id == id) {
          return { ...page, active: true };
        }
        return { ...page, active: false };
      }),
    });
  };

  const handleBodyChange = (data, id) => {
    const newPages = content.pages.map((page) => {
      if (page.id == id) {
        return { ...page, body: data };
      }
      return page;
    });
    setContent({ ...content, pages: newPages });
  };

  const handlePageTitleChaneg = (e, id) => {
    const newPages = content.pages.map((page) => {
      if (page.id == id) {
        return { ...page, title: e.target.value };
      }
      return page;
    });
    setContent({ ...content, pages: newPages });
  };

  const handleSelectContent = (id) => {
    tabClickControl.current = true;
    // const selectedContent = contents.find((content) => content.id == id);
    var myHeaders = new Headers();
    myHeaders.append("Authorization", token);

    setLoadingContent(true);
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
            if (i == 0) return { ...page, active: true };
            return page;
          }),
        });
        setLoadingContent(false);
        setUploading(false);
      })
      .catch((error) => console.log("error", error));
  };

  const handleSave = (e) => {
    e.preventDefault();

    if (!content.id) {
      let myHeaders = new Headers();
      myHeaders.append("Authorization", token);
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        title: content.title,
        thumbnail: content.thumbnail,
        content_type,
        pages_attributes: content.pages.map((page) => {
          return { title: page.title, body: page.body };
        }),
      });

      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      setSaving(true);
      fetch("https://homestretch-api.onrender.com/contents", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          setSaving(false);
          setContents([...contents, { ...content, id: result.id }]);
        })
        .catch((error) => console.log("error", error));
    } else {
      let myHeaders = new Headers();
      myHeaders.append("Authorization", token);
      myHeaders.append("Content-Type", "application/json");

      let raw = JSON.stringify({
        title: content.title,
        thumbnail: content.thumbnail,
        content_type,
        pages_attributes: content.pages.map((page) => {
          return { title: page.title, body: page.body };
        }),
      });

      var requestOptions = {
        method: "PATCH",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      setSaving(true);
      fetch(
        `https://homestretch-api.onrender.com/contents/${content.id}`,
        requestOptions
      )
        .then((response) => response.text())
        .then((result) => {
          setSaving(false);
          setContents(
            contents.map((el) => {
              if (el.id == content.id) {
                return { ...el, title: content.title };
              } else {
                return el;
              }
            })
          );
        })
        .catch((error) => console.log("error", error));
    }
  };

  const changeContentTitle = (e) => {
    setContent({ ...content, title: e.target.value });
  };

  const handleNewContent = (e) => {
    e.preventDefault();
    tabClickControl.current = true;
    setContent(defaultContent);
  };

  return (
    <div className={style.main}>
      <div>
        <button
          className={style.button_alt}
          onClick={(e) => handleNewContent(e)}
        >
          Add New Education Content
        </button>
        <ul>
          {contents.map((content) => {
            return (
              <li
                key={content.id}
                onClick={() => handleSelectContent(content.id)}
              >
                {content.title}
              </li>
            );
          })}
        </ul>
      </div>
      <div>
        {loadingContent && <h2>Loading. Please wait ...</h2>}
        {!loadingContent && (
          <div>
            <div className={style.header}>
              <textarea
                type="text"
                placeholder="Type title here ..."
                onChange={(e) => changeContentTitle(e)}
                value={content.title}
              ></textarea>
              <div
                className={`${style.thumbnail} 
            ${content.thumbnail ? "" : style.empty}
            ${uploading ? style.uploading : ""}
            `}
                style={{
                  backgroundImage:
                    content.thumbnail && !uploading
                      ? `url(${content.thumbnail})`
                      : "",
                }}
                onClick={() => selectFile()}
              ></div>
              <input
                type="file"
                ref={fileInput}
                onChange={(e) => uploadFile(e)}
                style={{ display: "none" }}
              />
            </div>
            <div className={style.tabs}>
              {content.pages.map((page) => (
                <div
                  key={page.id}
                  className={`${style.tab} ${
                    page.active ? style.activeTab : ""
                  }`}
                  onClick={() => handleTabClick(page.id)}
                >
                  <span title={page.title}>{page.title}</span>
                  <IoMdTrash onClick={(e) => removeTab(e, page.id)} />
                </div>
              ))}
              <button onClick={(e) => addPage(e)} className={style.button}>
                <IoAddOutline />
              </button>
            </div>
            {content.pages
              .filter((page) => page.active)
              .map((page) => (
                <>
                  <div className={style.page} key={page.id}>
                    <input
                      type="text"
                      placeholder="Type page title here ..."
                      value={page.title}
                      onChange={(e) => handlePageTitleChaneg(e, page.id)}
                    />
                    <CKEditor
                      onReady={(editor) => {
                        this.editor = editor.ui
                          .getEditableElement()
                          .parentElement.insertBefore(
                            editor.ui.view.toolbar.element,
                            editor.ui.getEditableElement()
                          );

                        // this.editor = editor;
                      }}
                      data={page.body}
                      onChange={(e, editor) => {
                        const data = editor.getData();
                        if (!tabClickControl.current) {
                          handleBodyChange(data, page.id);
                        } else {
                          tabClickControl.current = false;
                        }
                      }}
                      editor={DecoupledEditor}
                      config={{}}
                    />
                  </div>
                  <button
                    className={`${style.button} ${saving ? style.saving : ""}`}
                    onClick={(e) => handleSave(e)}
                  >
                    {saving ? "Please wait ... " : "Save and publich content"}
                  </button>
                </>
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
