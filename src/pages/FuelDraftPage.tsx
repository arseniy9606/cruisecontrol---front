import { useEffect, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FUEL_TILES } from "../Routes";
import DeleteFuelConsumptionButton from "../components/DeleteFuelConsumptionButton";
import FuelImage from "../components/FuelImage";
import FuelVideo from "../components/FuelVideo";
import type { FuelConsumption } from "../modules/fuel_consumptions";
import { useFuelDispatch, useFuelSelector } from "../store";
import {
  createFuelConsumptionDraft,
  loadFuelConsumptionDraft,
  publishFuelConsumption,
} from "../store/fuelConsumptionThunks";
import { setFuelRequestError } from "../store/fuelInterfaceSlice";

export default function FuelDraftPage() {
  const dispatch = useFuelDispatch();
  const { draftAutomobile, draftLoaded } = useFuelSelector((state) => state.fuelConsumptions);

  useEffect(() => {
    const request = dispatch(loadFuelConsumptionDraft());
    return () => request.abort();
  }, [dispatch]);

  return (
    <main className="fuel-form-page">
      <h1>Добавление автомобиля</h1>
      {draftLoaded ? (draftAutomobile
        ? <FuelPublicationForm key={draftAutomobile.id} automobile={draftAutomobile} />
        : <FuelDraftForm />
      ) : (
        <Button type="button" onClick={() => dispatch(loadFuelConsumptionDraft())}>Загрузить черновик</Button>
      )}
    </main>
  );
}

function FuelDraftForm() {
  const dispatch = useFuelDispatch();

  function createDraft(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const name = String(fields.get("name")).trim();
    const image = fields.get("image");
    const video = fields.get("video");
    if (!name || !(image instanceof File) || !(video instanceof File) || !image.size || !video.size) {
      dispatch(setFuelRequestError("Укажите название и выберите фото и видео автомобиля."));
      return;
    }
    dispatch(createFuelConsumptionDraft({ name, image, video }));
  }

  return (
    <Form className="fuel-form" onSubmit={createDraft}>
      <Form.Group controlId="fuel-draft-name">
        <Form.Label>Название автомобиля</Form.Label>
        <Form.Control name="name" maxLength={120} required />
      </Form.Group>
      <Form.Group controlId="fuel-draft-image">
        <Form.Label>Фото (JPEG или PNG)</Form.Label>
        <Form.Control name="image" type="file" accept=".jpg,.jpeg,.png" required />
      </Form.Group>
      <Form.Group controlId="fuel-draft-video">
        <Form.Label>Видео (MP4)</Form.Label>
        <Form.Control name="video" type="file" accept=".mp4" required />
      </Form.Group>
      <Button type="submit">Создать черновик</Button>
    </Form>
  );
}

function FuelPublicationForm({ automobile }: { automobile: FuelConsumption }) {
  const dispatch = useFuelDispatch();
  const navigate = useNavigate();

  async function publish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const fields = new FormData(event.currentTarget);
    const description = String(fields.get("description")).trim();
    if (!description) {
      dispatch(setFuelRequestError("Введите описание автомобиля."));
      return;
    }
    const result = await dispatch(publishFuelConsumption({
      id: automobile.id,
      description,
      consumption_rate: Number(fields.get("consumption_rate")),
      fuel_tank_volume: Number(fields.get("fuel_tank_volume")),
    }));
    if (publishFuelConsumption.fulfilled.match(result)) navigate(FUEL_TILES);
  }

  return (
    <Form className="fuel-form" onSubmit={publish}>
      <h2>{automobile.name}</h2>
      <div className="fuel-draft-media">
        <FuelImage source={automobile.image_url} name={automobile.name} />
        <FuelVideo automobile={automobile} />
      </div>
      <Form.Group controlId="fuel-draft-description">
        <Form.Label>Описание</Form.Label>
        <Form.Control as="textarea" rows={3} name="description" maxLength={1000}
          defaultValue={automobile.description} required />
      </Form.Group>
      <Form.Group controlId="fuel-draft-consumption">
        <Form.Label>Расход, л/100 км</Form.Label>
        <Form.Control type="number" name="consumption_rate" min="0.01" max="99999" step="0.01"
          defaultValue={automobile.consumption_rate || ""} required />
      </Form.Group>
      <Form.Group controlId="fuel-draft-tank">
        <Form.Label>Объём бака, л</Form.Label>
        <Form.Control type="number" name="fuel_tank_volume" min="0.01" max="99999" step="0.01"
          defaultValue={automobile.fuel_tank_volume || ""} required />
      </Form.Group>
      <Button type="submit">Опубликовать</Button>
      <DeleteFuelConsumptionButton automobile={automobile} />
    </Form>
  );
}
