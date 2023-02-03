import style from "./Header.module.scss";
import Menu from "./Menu";

export default function Header(props) {
  return (
    <header className={style.main}>
      <div className={style.layout}>
        <div></div>
        <div></div>
        <div className={style.content}>
          <Menu />
          {props.children}
        </div>
      </div>
    </header>
  );
}
