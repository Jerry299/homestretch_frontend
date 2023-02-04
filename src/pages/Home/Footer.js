import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import style from "./Footer.module.scss";
export default function Footer() {
  return (
    <div className={style.main}>
      <div>
        <div>
          <div className={style.img}></div>
          <p>
            Lorem ipsum dolor sit amet consectetur. Aliquam sit blandit amet
            turpis auctor urna a venenatis turpis.
          </p>
          <div className={style.socials}>
            <Link to="">
              <FaFacebookF />
            </Link>
            <Link to="">
              <FaTwitter />
            </Link>
            <Link to="">
              <FaInstagram />
            </Link>
            <Link to="">
              <FaLinkedinIn />
            </Link>
          </div>
        </div>
        <div>
          <h3>Quick Links</h3>
          <Link to="/about">About us</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/faq">FAQs</Link>
        </div>
        <div>
          <h3>Quick Links</h3>
          <Link to="/about">About us</Link>
          <Link to="/blog">Blog</Link>
          <Link to="/careers">Careers</Link>
          <Link to="/faq">FAQs</Link>
        </div>
        <div>
          <h3>Subscribe to our news letter</h3>
          <p>
            Get latest information, tips, market trends directly in your inbox.
          </p>
          <form>
            <input type="email" placeholder="Enter your email address here" />
            <button className={style.button}>Subscribe</button>
          </form>
        </div>
      </div>
      <div>
        <p>© All rights reserved Home Stretch 2023</p>
        <p> Terms of Use | Privacy Policy</p>
      </div>
    </div>
  );
}
