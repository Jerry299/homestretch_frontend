import style from "./Confirmation.module.scss";

export default function ConfirmNeeded() {
  return (
    <div className={style.main}>
      <h1>
        We sent you an email to confirm your email address. Please check your
        inbox. In case you did not receive the email, please check your spam
        folder.
      </h1>
    </div>
  );
}
