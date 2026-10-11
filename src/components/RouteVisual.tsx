import type { Route } from "@/lib/types";
import Illustration, { isIllustration } from "./Illustration";

// Zdjęcie trasy, a jeśli go nie ma – wybrana ilustracja wektorowa.
export default function RouteVisual({ route, className }: { route: Route; className: string }) {
  if (route.image_url) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={route.image_url} alt="" className={`${className} object-cover`} />;
  }
  if (isIllustration(route.illustration)) {
    return <Illustration name={route.illustration} className={className} />;
  }
  return null;
}
