import { Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FUEL_DRAFT, FUEL_FEED, FUEL_LOGIN, FUEL_TILES } from "../Routes";
import CarIcon from "./CarIcon";

interface Props {
  authenticated: boolean;
  onLogout: () => void;
}

export default function TabBar({ authenticated, onLogout }: Props) {
  const { pathname } = useLocation();
  const addTab = <><span className="tab-icon"><CarIcon name="add" /></span><span className="tab-label">Добавление</span></>;
  const authTab = (
    <>
      <span className="tab-icon"><CarIcon name={authenticated ? "logout" : "login"} /></span>
      <span className="tab-label">{authenticated ? "Выход" : "Вход"}</span>
    </>
  );
  return (
    <Navbar className="tab-bar" aria-label="Основная навигация">
      <Nav className="car-tab-items">
        <Nav.Link as={Link} active={pathname.startsWith(FUEL_FEED)} to={FUEL_FEED}>
          <span className="tab-icon"><CarIcon name="feed" /></span>
          <span className="tab-label">Лента</span>
        </Nav.Link>
        {authenticated ? (
          <Nav.Link as={Link} active={pathname === FUEL_DRAFT} to={FUEL_DRAFT}>{addTab}</Nav.Link>
        ) : (
          <Nav.Link as="button" type="button" disabled title="Войдите, чтобы добавить автомобиль">{addTab}</Nav.Link>
        )}
        <Nav.Link as={Link} active={pathname === FUEL_TILES} to={FUEL_TILES}>
          <span className="tab-icon"><CarIcon name="tiles" /></span>
          <span className="tab-label">Плитка</span>
        </Nav.Link>
        {authenticated ? (
          <Nav.Link as="button" type="button" onClick={onLogout}>{authTab}</Nav.Link>
        ) : (
          <Nav.Link as={Link} active={pathname === FUEL_LOGIN} to={FUEL_LOGIN}>{authTab}</Nav.Link>
        )}
      </Nav>
    </Navbar>
  );
}
