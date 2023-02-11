import { useEffect } from "react";
import { useDispatch } from "react-redux";
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
import { updateUser } from "./redux/reducers/user";

function App() {
  const dispatch = useDispatch();
  useEffect(() => {
    const token = localStorage.getItem("token");
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
  }, [dispatch]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign_up" element={<Signup />} />
        <Route path="/sign_in" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cms/:content_type" element={<ContentManagement />} />
        <Route path="/contents/:content_type" element={<ContentsList />} />
        <Route path="/confirm_account/:token" element={<Confirmation />} />
        <Route path="/confirm_your_account" element={<ConfirmNeeded />} />
        <Route
          path="/contents/:content_type/:id/:title"
          element={<Content />}
        />
      </Routes>
    </div>
  );
}

export default App;
