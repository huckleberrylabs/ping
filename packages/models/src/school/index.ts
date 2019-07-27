export type School = {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  rating: number;
  address: string;
  status: string;
  province: string;
  type: string;
};

export function isSchool(object: any): object is School {
  return (
    (object as School).name !== undefined &&
    (object as School).address !== undefined &&
    (object as School).latitude !== undefined &&
    (object as School).longitude !== undefined
  );
}
