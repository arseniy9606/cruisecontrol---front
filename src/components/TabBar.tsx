import { Nav, Navbar } from "react-bootstrap";
import { Link, useLocation } from "react-router-dom";
import { FUEL_TILES, fuelFeedPath } from "../Routes";
interface Props {
  firstId: number;
}
export default function TabBar({ firstId }: Props) {
  const { pathname } = useLocation();
  return (
    <Navbar className="tab-bar" aria-label="Основная навигация">
      <Nav>
        <Nav.Link
          as={Link}
          active={pathname.startsWith(`${FUEL_TILES}/feed/`)}
          to={fuelFeedPath(firstId)}
        >
          <span aria-hidden="true">▷</span>Лента
        </Nav.Link>
        <Nav.Link as="button" disabled title="Добавление недоступно в ЛР5">
          <span aria-hidden="true">＋</span>Добавление
        </Nav.Link>
        <Nav.Link as={Link} active={pathname === FUEL_TILES} to={FUEL_TILES}>
          <span aria-hidden="true">▦</span>Плитка
        </Nav.Link>
        <Nav.Link as="button" disabled title="Вход недоступен в ЛР5">
          <span aria-hidden="true">↪</span>Войти
        </Nav.Link>
      </Nav>
    </Navbar>
  );
}
