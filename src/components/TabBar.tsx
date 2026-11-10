import { Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FUEL_TILES, fuelFeedPath } from "../Routes";
import CarIcon from "./CarIcon";
interface Props {
  firstId: number;
}
export default function TabBar({ firstId }: Props) {
  const { pathname } = useLocation();
  return (
    <Navbar className="tab-bar" aria-label="Основная навигация">
      <Nav className="car-tab-items">
        <Nav.Link
          as={Link}
          active={pathname.startsWith(`${FUEL_TILES}/feed/`)}
          to={fuelFeedPath(firstId)}
        >
          <span className="tab-icon">
            <CarIcon name="feed" />
          </span>
          <span className="tab-label">Лента</span>
        </Nav.Link>
        <Nav.Link as="button" disabled title="Добавление недоступно в ЛР5">
          <span className="tab-icon">
            <CarIcon name="add" />
          </span>
          <span className="tab-label">Добавление</span>
        </Nav.Link>
        <Nav.Link as={Link} active={pathname === FUEL_TILES} to={FUEL_TILES}>
          <span className="tab-icon">
            <CarIcon name="tiles" />
          </span>
          <span className="tab-label">Плитка</span>
        </Nav.Link>
        <Nav.Link as="button" disabled title="Вход недоступен в ЛР5">
          <span className="tab-icon">
            <CarIcon name="login" />
          </span>
          <span className="tab-label">Вход</span>
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
