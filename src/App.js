import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Content from "./pages/Content/Content";
import ContentManagement from "./pages/Content/ContentManagement";
import ContentsList from "./pages/Content/ContentsList";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Signin from "./pages/Signin/Signin";
import Confirmation from "./pages/Signup/Confirmation";
import ConfirmNeeded from "./pages/Signup/ConfirmNeeded";
import Signup from "./pages/Signup/Signup";
import OtherContent from "./pages/Content/OtherContent";
import { updateUser } from "./redux/reducers/user";
import PageNotFound from "./pages/PageNotFound/PageNotFound";

function App() {
  const dispatch = useDispatch();
  const token = localStorage.getItem("token");
  const userData = useSelector((state) => state.user);
  useEffect(() => {
    if (token) {
      const fetchUser = async () => {
        var myHeaders = new Headers();
        myHeaders.append("Authorization", token);

        var requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow",
        };

        fetch(
          "https://homestretch-api.onrender.com/users/profile",
          requestOptions
        )
          .then((response) => response.json())
          .then((result) => {
            dispatch(updateUser(result));
          })
          .catch((error) => console.log("error", error));
      };

      fetchUser();
    }
  }, [dispatch, token]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign_up" element={<Signup />} />
        <Route path="/sign_in" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        {userData && userData.user.role === "admin" && (
          <Route
            path="/cms/:content_type"
            element={
              userData && userData.user.role === "admin" ? (
                <ContentManagement />
              ) : (
                <PageNotFound />
              )
            }
          />
        )}
        <Route path="/contents/:content_type" element={<ContentsList />} />
        <Route path="/confirm_account/:token" element={<Confirmation />} />
        <Route path="/confirm_your_account" element={<ConfirmNeeded />} />
        <Route path="/blog" element={<OtherContent content_type="blog" />} />
        <Route path="/about" element={<OtherContent content_type="about" />} />
        <Route
          path="/contact"
          element={<OtherContent content_type="contact" />}
        />
        <Route path="/faq" element={<OtherContent content_type="faq" />} />
        <Route
          path="/career"
          element={<OtherContent content_type="career" />}
        />
        <Route
          path="/terms-of-use"
          element={<OtherContent content_type="terms-of-use" />}
        />
        <Route
          path="/privacy-policy"
          element={<OtherContent content_type="privacy-policy" />}
        />
        <Route
          path="/contents/:content_type/:id/:title"
          element={<Content />}
        />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </div>
  );
}

export default App;
