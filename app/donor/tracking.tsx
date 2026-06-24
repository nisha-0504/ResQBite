import { useLocalSearchParams } from "expo-router";
import TrackingMap from "../../components/TrackingMap";

export default function DonorTracking() {
  const { id } = useLocalSearchParams();
  return <TrackingMap donationId={id as string} />;
}