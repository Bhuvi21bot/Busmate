import { feature, product, priceItem, featureItem } from "atmn";

export const bookings = feature({
  id: "bookings",
  name: "Bus Bookings",
  type: "single_use",
});

export const priorityBooking = feature({
  id: "priority_booking",
  name: "Priority Booking",
  type: "boolean",
});

export const seatSelection = feature({
  id: "seat_selection",
  name: "Advanced Seat Selection",
  type: "boolean",
});

export const adFree = feature({
  id: "ad_free",
  name: "Ad-Free Experience",
  type: "boolean",
});

export const realTimeTracking = feature({
  id: "real_time_tracking",
  name: "Real-Time Bus Tracking",
  type: "boolean",
});

export const bookingHistory = feature({
  id: "booking_history",
  name: "Booking History & Receipts",
  type: "boolean",
});

export const liveChat = feature({
  id: "live_chat",
  name: "Live Chat Support",
  type: "boolean",
});

export const earlyRouteAccess = feature({
  id: "early_route_access",
  name: "Early Access to New Routes",
  type: "boolean",
});

export const conciergeService = feature({
  id: "concierge_service",
  name: "Concierge Booking Service",
  type: "boolean",
});

export const multiPassenger = feature({
  id: "multi_passenger",
  name: "Multi-Passenger Bookings",
  type: "continuous_use",
});

export const loyaltyRewards = feature({
  id: "loyalty_rewards",
  name: "Loyalty Rewards & Points",
  type: "boolean",
});

export const flexibleCancellation = feature({
  id: "flexible_cancellation",
  name: "Flexible Cancellation with Full Refund",
  type: "boolean",
});

export const priorityPhone = feature({
  id: "priority_phone",
  name: "Priority Phone Support",
  type: "boolean",
});

export const travelInsurance = feature({
  id: "travel_insurance",
  name: "Travel Insurance",
  type: "boolean",
});

export const thirdBookingDiscount = feature({
  id: "third_booking_discount",
  name: "10% Discount on Every 3rd Booking",
  type: "boolean",
});

export const expressCheckin = feature({
  id: "express_checkin",
  name: "Express Check-in",
  type: "boolean",
});

export const free = product({
  id: "free",
  name: "Free",
  is_default: true,
  items: [
    featureItem({
      feature_id: bookings.id,
      included_usage: 10,
      interval: "month",
    }),
  ],
});

export const premium = product({
  id: "premium",
  name: "Premium",
  items: [
    priceItem({
      price: 14.99,
      interval: "month",
    }),
    featureItem({
      feature_id: bookings.id,
      included_usage: 25,
      interval: "month",
    }),
    featureItem({
      feature_id: seatSelection.id,
    }),
    featureItem({
      feature_id: thirdBookingDiscount.id,
    }),
    featureItem({
      feature_id: adFree.id,
    }),
    featureItem({
      feature_id: priorityBooking.id,
    }),
    featureItem({
      feature_id: realTimeTracking.id,
    }),
    featureItem({
      feature_id: bookingHistory.id,
    }),
    featureItem({
      feature_id: liveChat.id,
    }),
  ],
});

export const superPremium = product({
  id: "super_premium",
  name: "Super Premium",
  items: [
    priceItem({
      price: 29.99,
      interval: "month",
    }),
    featureItem({
      feature_id: bookings.id,
      included_usage: 999999,
      interval: "month",
    }),
    featureItem({
      feature_id: multiPassenger.id,
      included_usage: 10,
    }),
    featureItem({
      feature_id: adFree.id,
    }),
    featureItem({
      feature_id: priorityBooking.id,
    }),
    featureItem({
      feature_id: seatSelection.id,
    }),
    featureItem({
      feature_id: realTimeTracking.id,
    }),
    featureItem({
      feature_id: bookingHistory.id,
    }),
    featureItem({
      feature_id: liveChat.id,
    }),
    featureItem({
      feature_id: thirdBookingDiscount.id,
    }),
    featureItem({
      feature_id: earlyRouteAccess.id,
    }),
    featureItem({
      feature_id: conciergeService.id,
    }),
    featureItem({
      feature_id: loyaltyRewards.id,
    }),
    featureItem({
      feature_id: flexibleCancellation.id,
    }),
    featureItem({
      feature_id: priorityPhone.id,
    }),
    featureItem({
      feature_id: travelInsurance.id,
    }),
    featureItem({
      feature_id: expressCheckin.id,
    }),
  ],
});