import { Card } from "react-bootstrap";
import { Link } from "react-router-dom";
import type { FuelConsumption } from "../modules/fuel_consumptions";
import { formatFuel } from "../modules/fuel_consumptions";
import { fuelFeedPath } from "../Routes";
import FuelImage from "./FuelImage";
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
          ♡ {automobile.likes_count}
        </span>
      </div>
      <Card.Body>
        <Card.Title as="h2">{automobile.name}</Card.Title>
        <p className="consumption">
          {formatFuel(automobile.consumption_rate)} <span>л/100 км</span>
        </p>
        <p className="tank">
          Бак · {formatFuel(automobile.fuel_tank_volume)} л
        </p>
      </Card.Body>
    </Card>
  );
}
