import { School, Coordinates } from "@huckleberry/schools";

export function sortByDistance(
  location: Coordinates,
  schools: School[]
): School[] {
  return schools
    .concat()
    .sort(
      (a, b) =>
        distanceCalculator(location, a) - distanceCalculator(location, b)
    );
}

export function sortByRating(schools: School[]): School[] {
  return schools.concat().sort((a, b) => a.rating - b.rating);
}

export function getWithinRadius(
  radius: number,
  center: Coordinates,
  locations: Coordinates[]
) {
  return locations.filter(
    location => distanceCalculator(center, location) <= radius
  );
}

export function distanceCalculator(
  coordinates1: Coordinates,
  coordinates2: Coordinates
): number {
  var R = 6371; // km (change this constant to get miles)
  var dLat = ((coordinates2.latitude - coordinates1.latitude) * Math.PI) / 180;
  var dLon =
    ((coordinates2.longitude - coordinates1.longitude) * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((coordinates1.latitude * Math.PI) / 180) *
      Math.cos((coordinates2.latitude * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c * 1000; // converting to meters

  return d;
}
