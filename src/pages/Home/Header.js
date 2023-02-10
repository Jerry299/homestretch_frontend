import style from "./Header.module.scss";
import Menu from "./Menu";

export default function Header({ inlineStyle, children }) {
  return (
    <header className={style.main} style={inlineStyle}>
      <div className={style.layout}>
        <div className={style.content}>
          <Menu />
          {children}
        </div>
      </div>
    </header>
  );
}
