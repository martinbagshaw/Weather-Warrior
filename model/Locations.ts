/**
 * Locations
 *
 * Classes, interfaces, and enums relating to locations. These will include:
 *
 * - Crags
 * - Directions and drive time
 * - Walk in time and type
 *
 */

export enum Aspect {
  North,
  South,
  East,
  West,
  NorthEast,
  NorthWest,
  SouthEast,
  SouthWest,
  All,
}

export enum Discipline {
  Trad,
  Sport,
  Bouldering,
  Winter,
}

export interface Crag {
  name: string;
  id: string;
  altitude: number;
  aspect: Aspect[];
  discipline: Discipline[];
}

export class Location {
  public name = "";
  public id = "";
  public coordinates = "";
  public crags: Crag[] = [];
}
