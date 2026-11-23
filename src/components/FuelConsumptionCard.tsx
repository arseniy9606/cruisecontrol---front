import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { FuelConsumption } from "../modules/fuel_consumptions";
import { formatFuel } from "../modules/fuel_consumptions";
import { fuelFeedPath } from "../Routes";
import FuelImage from "./FuelImage";
import CarIcon from "./CarIcon";
import DeleteFuelConsumptionButton from "./DeleteFuelConsumptionButton";

interface Props {
  automobile: FuelConsumption;
  canDelete: boolean;
}

export default function FuelConsumptionCard({ automobile, canDelete }: Props) {
  return (
    <Card className="fuel-card">
      <Link to={fuelFeedPath(automobile.id)}>
        <div className="card-photo">
          <FuelImage key={automobile.image_url} source={automobile.image_url} name={automobile.name} />
          <span className="likes" aria-label={`${automobile.likes_count} отметок нравится`}>
            <CarIcon name="heart" />
            {automobile.likes_count}
          </span>
        </div>
        <Card.Body>
          <Card.Title as="h2">{automobile.name}</Card.Title>
          <p className="consumption">
            <CarIcon name="fuel" />
            <strong>{formatFuel(automobile.consumption_rate)}</strong>
            <span>л/100 км</span>
          </p>
        </Card.Body>
      </Link>
      {canDelete && (
        <div className="fuel-card-actions"><DeleteFuelConsumptionButton automobile={automobile} /></div>
      )}
    </Card>
  );
}
