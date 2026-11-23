import { Button } from "react-bootstrap";
import type { FuelConsumption } from "../modules/fuel_consumptions";
import { useFuelDispatch } from "../store";
import { deleteFuelConsumption } from "../store/fuelConsumptionThunks";

export default function DeleteFuelConsumptionButton({ automobile }: { automobile: FuelConsumption }) {
  const dispatch = useFuelDispatch();
  return (
    <Button
      type="button"
      variant="outline-danger"
      size="sm"
      aria-label={`Удалить «${automobile.name}»`}
      onClick={() => {
        if (window.confirm(`Удалить «${automobile.name}»?`)) {
          dispatch(deleteFuelConsumption(automobile.id));
        }
      }}
    >
      Удалить
    </Button>
  );
}
