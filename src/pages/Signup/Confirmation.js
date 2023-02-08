import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import host from "../../utils/host";
import style from "./Confirmation.module.scss";

export default function Confirmation() {
  const [confirming, setConfirming] = useState(true);
  const [countDown, setCountDown] = useState(5);
  const { token } = useParams();

  useEffect(() => {
    const confirmEmail = async () => {
      const response = await fetch(
        `${host}/users/confirmation?confirmation_token=${token}`
      );

      if (response.status === 200) {
        setConfirming(false);
        setInterval(() => {
          setCountDown((prev) => prev - 1);
        }, 1000);
      }
    };

    confirmEmail();
  }, []);

  if (countDown === 1) {
    window.location.href = "/";
  }

  return (
    <div className={style.main}>
      {confirming && (
        <h1>We are confirming your email address. Please wait...</h1>
      )}
      {!confirming && (
        <h1>
          Congratulations! Your email address has been confirmed. You will be
          redirected to the login page in {countDown} seconds.
        </h1>
      )}
    </div>
  );
}
