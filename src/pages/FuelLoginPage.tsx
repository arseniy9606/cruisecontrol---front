import type { FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import axios from "axios";
import { fuelRequestError, fuelUserHttp, saveFuelJwt } from "../api";
import { useFuelDispatch } from "../store";
import { fuelAuthFinished, fuelAuthStarted, setFuelRequestError } from "../store/fuelInterfaceSlice";
import { fuelUserLoggedIn } from "../store/fuelUserSlice";

export default function FuelLoginPage() {
  const dispatch = useFuelDispatch();

  async function login(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const login = String(fields.get("login")).trim();
    const password = fields.get("password");
    dispatch(fuelAuthStarted());
    try {
      const { data } = await fuelUserHttp.post<{ access_token: string }>("/users/login", { login, password });
      if (!data?.access_token) throw new Error("JWT отсутствует в ответе");
      saveFuelJwt(data.access_token);
      dispatch(fuelUserLoggedIn(login));
    } catch (error) {
      dispatch(setFuelRequestError(axios.isAxiosError(error) && error.response?.status === 403
        ? "Неверный логин или пароль."
        : fuelRequestError(error, "Не удалось войти в систему.")));
    } finally {
      dispatch(fuelAuthFinished());
    }
  }

  return (
    <main className="fuel-form-page">
      <h1>Вход</h1>
      <Form className="fuel-form" onSubmit={login}>
        <Form.Group controlId="fuel-login">
          <Form.Label>Логин</Form.Label>
          <Form.Control name="login" autoComplete="username" required />
        </Form.Group>
        <Form.Group controlId="fuel-password">
          <Form.Label>Пароль</Form.Label>
          <Form.Control name="password" autoComplete="current-password" type="password" required />
        </Form.Group>
        <Button type="submit">Войти</Button>
      </Form>
    </main>
  );
}
