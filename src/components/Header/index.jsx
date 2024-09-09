import "./index.css";
import { FaUserCircle } from "react-icons/fa";
import { Link } from "react-router-dom";
import logo from "/logo.jpg";

const Header = () => {
  return (
    <div className="headerComponent">
      <Link className="webLogo" to="/">
        <img className="webLogo" src={logo} />
      </Link>
      <FaUserCircle className="profile" />
    </div>
  );
};

export default Header;
