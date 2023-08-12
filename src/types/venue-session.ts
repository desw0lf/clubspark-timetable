import { HexColour, IntTime } from "./global";

interface Session {
  ID: string;
  Category: number;
  SubCategory: number;
  Name: string;
  Colour: HexColour;
  StartTime: IntTime;
  EndTime: IntTime;
  Interval: number;
  MaxSinglesSlots: number;
  MaxDoublesSlots: number;
  Capacity: number;
  Recurrence: boolean;
  CostFrom: number;
  CourtCost: number;
  LightingCost: number;
  MemberPrice: number;
  GuestPrice: number;
}

interface Day {
  Date: string; // 2023-08-12T00:00:00
  Sessions: Session[];
}

interface Resource {
  ID: string;
  Name: string;
  Number: number;
  Location: number;
  Lighting: number;
  Surface: number;
  Size: number;
  Category: number;
  Days: Day[];
}

export interface VenueSession {
  EarliestStartTime: IntTime; // 420
  LatestEndTime: IntTime; // 1320
  HideResourceProperties: boolean; // false
  MinimumInterval: number; // 60
  TimeZone: "Europe/London" | string;
  Resources: Resource[];
}