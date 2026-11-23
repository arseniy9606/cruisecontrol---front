import { useEffect } from "react";
import { Alert, Spinner } from "react-bootstrap";
import { Navigate, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { clearFuelJwt, fuelAuthHeaders, fuelRequestError, fuelUserHttp } from "./api";
import { FUEL_DRAFT, FUEL_FEED, FUEL_LOGIN, FUEL_TILES } from "./Routes";
import TabBar from "./components/TabBar";
import FuelDraftPage from "./pages/FuelDraftPage";
import FuelFeedPage from "./pages/FuelFeedPage";
import FuelLoginPage from "./pages/FuelLoginPage";
import FuelTilesPage from "./pages/FuelTilesPage";
import { useFuelDispatch, useFuelSelector } from "./store";
import { fuelAuthFinished, fuelAuthStarted, setFuelRequestError } from "./store/fuelInterfaceSlice";
import { fuelUserLoggedOut } from "./store/fuelUserSlice";

export default function App() {
  const dispatch = useFuelDispatch();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { pending, error } = useFuelSelector((state) => state.fuelInterface);
  const authenticated = useFuelSelector((state) => state.fuelUser.login !== null);
  const busy = pending > 0;

  useEffect(() => {
    dispatch(setFuelRequestError(""));
  }, [dispatch, pathname]);

  async function logout() {
    dispatch(fuelAuthStarted());
    try {
      await fuelUserHttp.post("/users/logout", undefined, {
        headers: fuelAuthHeaders(),
        validateStatus: (status) => status === 200 || status === 403,
      });
      clearFuelJwt();
      dispatch(fuelUserLoggedOut());
      navigate(FUEL_TILES, { replace: true });
    } catch (error) {
      dispatch(setFuelRequestError(fuelRequestError(error, "Не удалось выйти из системы.")));
    } finally {
      dispatch(fuelAuthFinished());
    }
  }

  return (
    <div className="mobile-app">
      <div inert={busy} aria-busy={busy}>
        {error && (
          <Alert variant="danger" className="fuel-request-error" dismissible
            onClose={() => dispatch(setFuelRequestError(""))}>
            {error}
          </Alert>
        )}
        <Routes>
          <Route path={FUEL_TILES} element={<FuelTilesPage />} />
          <Route path={`${FUEL_FEED}/:id?`} element={<FuelFeedPage />} />
          <Route path={FUEL_DRAFT} element={authenticated ? <FuelDraftPage /> : <Navigate to={FUEL_LOGIN} replace />} />
          <Route path={FUEL_LOGIN} element={authenticated ? <Navigate to={FUEL_TILES} replace /> : <FuelLoginPage />} />
          <Route path="*" element={<Navigate to={FUEL_TILES} replace />} />
        </Routes>
        <TabBar authenticated={authenticated} onLogout={logout} />
      </div>
      {busy && (
        <div className="fuel-request-cover" role="status" aria-live="polite">
          <Spinner animation="border" aria-hidden="true" />
          <span className="visually-hidden">Выполняется запрос…</span>
        </div>
      )}
    </div>
  );
}
