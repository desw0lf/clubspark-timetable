interface Role {
  Name: string | "Guest";
  AdvancedBookingPeriod: number | 7 | 14;
  MaximumBookingIntervals: number;
  MinimumBookingIntervals: number;
  CanBook: boolean;
}

export interface Settings {
  VenueID: string;
  ServerDateTime: string;
  IsAuthenticated: boolean;
  IsAdministrator: boolean;
  IsCoachAdministrator: boolean;
  IsMember: boolean;
  MustAuthenticate: boolean;
  AdminOnlyBookings: boolean;
  OnBehalfOfBooking: boolean;
  PaymentEnabled: boolean;
  GroupBookingEnabled: boolean;
  MembershipRequired: boolean;
  MembershipCost: number;
  DefaultInterval: 60 | number;
  NewDayBookingAvailabilityTime: number;
  Roles: [Role];
}