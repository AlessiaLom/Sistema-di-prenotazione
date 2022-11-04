import { Link, useMatch, useResolvedPath } from "react-router-dom"
import Logo from "./Logo";

export default function Navbar(props) {
  return (
    <nav className="nav">
      <Logo/>
      <a href="/" target={'_blank'} className="site-title"></a>
      <ul>
        <CustomLink to={props.restaurantId + "/booking"}>Prenota</CustomLink>
        <CustomLink to={props.restaurantId + "/cancelation"}>Cancella</CustomLink>
      </ul>
    </nav>
  )
}

function CustomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to)
  const isActive = useMatch({ path: resolvedPath.pathname, end: true })
  return (
    <li className={isActive ? "active" : ""}>
      <Link to={to} {...props}>
        {children}
      </Link>
    </li>
  )
}