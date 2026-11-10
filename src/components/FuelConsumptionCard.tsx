import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { FuelConsumption } from "../modules/fuel_consumptions";
import { formatFuel } from "../modules/fuel_consumptions";
import { fuelFeedPath } from "../Routes";
import FuelImage from "./FuelImage";
import CarIcon from "./CarIcon";
interface Props {
  automobile: FuelConsumption;
}
export default function FuelConsumptionCard({ automobile }: Props) {
  return (
    <Card as={Link} to={fuelFeedPath(automobile.id)} className="fuel-card">
      <div className="card-photo">
        <FuelImage source={automobile.image_url} name={automobile.name} />
        <span
          className="likes"
          aria-label={`${automobile.likes_count} отметок нравится`}
        >
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
    </Card>
  );
}
