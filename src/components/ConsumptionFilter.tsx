import { useState, type FormEvent } from "react";
import { Button, Form } from "react-bootstrap";
import type { FuelConsumptionRange } from "../modules/fuel_consumptions";
interface Props {
  value: FuelConsumptionRange;
  onApply: (range: FuelConsumptionRange) => void;
}
export default function ConsumptionFilter({ value, onApply }: Props) {
  const [draft, setDraft] = useState(value);
  const invalid =
    draft.minimum !== "" &&
    draft.maximum !== "" &&
    Number(draft.minimum) > Number(draft.maximum);
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!invalid) onApply(draft);
  }
  return (
    <Form className="fuel-filter" onSubmit={submit}>
      <Form.Label className="filter-title">Расход топлива, л/100 км</Form.Label>
      <div className="filter-fields">
        <Form.Group controlId="fuel-min">
          <Form.Label>От</Form.Label>
          <Form.Control
            type="number"
            min="0"
            step="0.1"
            placeholder="0"
            value={draft.minimum}
            onChange={(e) => setDraft({ ...draft, minimum: e.target.value })}
          />
        </Form.Group>
        <Form.Group controlId="fuel-max">
          <Form.Label>До</Form.Label>
          <Form.Control
            type="number"
            min="0"
            step="0.1"
            placeholder="Любой"
            value={draft.maximum}
            onChange={(e) => setDraft({ ...draft, maximum: e.target.value })}
          />
        </Form.Group>
        <Button type="submit" disabled={invalid}>
          Найти
        </Button>
      </div>
      {invalid && (
        <p className="filter-error" role="alert">
          Нижняя граница должна быть не больше верхней.
        </p>
      )}
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
    </Form>
  );
}
