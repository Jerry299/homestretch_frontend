import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import ContentsList from "./pages/Content/ContentsList";
import Home from "./pages/Home/Home";
import Profile from "./pages/Profile/Profile";
import Signin from "./pages/Signin/Signin";
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
    } else {
      console.log("no token");
    }
  }, [dispatch]);

  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/sign_up" element={<Signup />} />
        <Route path="/sign_in" element={<Signin />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/contents/:content_type" element={<ContentsList />} />
      </Routes>
    </div>
  );
}

export default App;
