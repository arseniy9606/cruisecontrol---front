import { useState, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import type { FuelConsumptionRange } from "../modules/fuel_consumptions";
import { formatFuel } from "../modules/fuel_consumptions";
interface Props {
  value: FuelConsumptionRange;
  onApply: (range: FuelConsumptionRange) => void;
}
export default function ConsumptionFilter({ value, onApply }: Props) {
  const [draft, setDraft] = useState(value);
  const maximum = draft.maximum === "" ? 60 : Number(draft.maximum);
  const invalid = draft.minimum !== "" && Number(draft.minimum) > maximum;
  const active = value.minimum !== "" || value.maximum !== "";
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!invalid) onApply({ minimum: draft.minimum, maximum: String(maximum) });
  }
  return (
    <Form className="fuel-filter" onSubmit={submit}>
      <div className="filter-title">
        Расход топлива <span>л/100 км</span>
      </div>
      <div className="filter-fields">
        <Form.Label htmlFor="fuel-min">От</Form.Label>
        <Form.Control
          id="fuel-min"
          type="number"
          min="0"
          max="60"
          step="0.1"
          placeholder="0"
          value={draft.minimum}
          onChange={(e) => setDraft({ ...draft, minimum: e.target.value })}
        />
        <Form.Label htmlFor="fuel-max">До</Form.Label>
        <output htmlFor="fuel-max">{formatFuel(maximum)}</output>
      </div>
      <Form.Range
        id="fuel-max"
        aria-label="Максимальный расход топлива"
        min="0"
        max="60"
        step="0.1"
        value={maximum}
        onChange={(e) => setDraft({ ...draft, maximum: e.target.value })}
      />
      <div className="range-labels">
        <span>0</span>
        <span>60 л/100 км</span>
      </div>
      <Button type="submit" disabled={invalid}>
        Показать автомобили
      </Button>
      {invalid && (
        <p className="filter-error" role="alert">
          Нижняя граница должна быть не больше верхней.
        </p>
      )}
      {active && (
        <Button
          className="reset-filter"
          variant="link"
          type="button"
          onClick={() => {
            const empty = { minimum: "", maximum: "" };
            setDraft(empty);
            onApply(empty);
          }}
        >
          Сбросить фильтр
        </Button>
      )}
    </Form>
  );
}
