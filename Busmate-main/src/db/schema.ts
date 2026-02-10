import {
  mysqlTable,
  varchar,
  int,
  boolean,
  double,
  datetime,
  text,
  index,
} from "drizzle-orm/mysql-core";

import { sql } from "drizzle-orm";

/* ----------------------------------------------------------
   USER TABLE
---------------------------------------------------------- */
export const user = mysqlTable("user", {
  id: varchar("id", { length: 191 }).primaryKey(),
  name: varchar("name", { length: 191 }).notNull(),
  email: varchar("email", { length: 191 }).notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),

  createdAt: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

/* ----------------------------------------------------------
   SESSION TABLE
---------------------------------------------------------- */
export const session = mysqlTable("session", {
  id: varchar("id", { length: 191 }).primaryKey(),
  expiresAt: datetime("expires_at").notNull(),

  token: varchar("token", { length: 255 }).notNull().unique(),

  createdAt: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),

  ipAddress: varchar("ip_address", { length: 255 }),
  userAgent: varchar("user_agent", { length: 255 }),

  userId: varchar("user_id", { length: 191 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

/* ----------------------------------------------------------
   ACCOUNT TABLE
---------------------------------------------------------- */
export const account = mysqlTable("account", {
  id: varchar("id", { length: 191 }).primaryKey(),

  accountId: varchar("account_id", { length: 255 }).notNull(),
  providerId: varchar("provider_id", { length: 255 }).notNull(),

  userId: varchar("user_id", { length: 191 })
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),

  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),

  accessTokenExpiresAt: datetime("access_token_expires_at"),
  refreshTokenExpiresAt: datetime("refresh_token_expires_at"),

  scope: text("scope"),
  password: text("password"),

  createdAt: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

/* ----------------------------------------------------------
   VERIFICATION TABLE
---------------------------------------------------------- */
export const verification = mysqlTable("verification", {
  id: varchar("id", { length: 191 }).primaryKey(),

  identifier: varchar("identifier", { length: 255 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),

  expiresAt: datetime("expires_at").notNull(),

  createdAt: datetime("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),

  updatedAt: datetime("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
});

/* ----------------------------------------------------------
   DRIVERS TABLE
---------------------------------------------------------- */
export const drivers = mysqlTable(
  "drivers",
  {
    id: int("id").primaryKey().autoincrement(),

    userId: varchar("user_id", { length: 191 })
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),

    name: varchar("name", { length: 191 }).notNull(),
    email: varchar("email", { length: 191 }),
    phone: varchar("phone", { length: 191 }).notNull(),

    vehicleType: varchar("vehicle_type", { length: 191 }).notNull(),
    vehicleNumber: varchar("vehicle_number", { length: 191 })
      .notNull()
      .unique(),

    licenseNumber: varchar("license_number", { length: 191 })
      .notNull()
      .unique(),

    licenseImage: text("license_image"),
    vehicleImage: text("vehicle_image"),

    status: varchar("status", { length: 50 }).notNull().default("pending"),
    rating: double("rating").default(0),
    totalRides: int("total_rides").notNull().default(0),

    verificationStatus: varchar("verification_status", { length: 191 })
      .notNull()
      .default("pending"),

    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),

    updatedAt: datetime("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => ({
    driverUserIdIdx: index("driver_user_id_idx").on(table.userId),
    driverStatusIdx: index("driver_status_idx").on(table.status),
  })
);

/* ----------------------------------------------------------
   BOOKINGS TABLE
---------------------------------------------------------- */
export const bookings = mysqlTable(
  "bookings",
  {
    id: int("id").primaryKey().autoincrement(),

    userId: varchar("user_id", { length: 191 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    driverId: int("driver_id").references(() => drivers.id),

    pickupLocation: text("pickup_location").notNull(),
    dropLocation: text("drop_location").notNull(),

    pickupTime: datetime("pickup_time").notNull(),
    fare: double("fare").notNull(),

    status: varchar("status", { length: 50 }).notNull().default("pending"),

    seats: int("seats").notNull().default(1),

    paymentStatus: varchar("payment_status", { length: 191 })
      .notNull()
      .default("pending"),

    paymentId: varchar("payment_id", { length: 191 }),
    orderId: varchar("order_id", { length: 191 }),
    confirmationCode: varchar("confirmation_code", { length: 191 }),

    vehicleType: varchar("vehicle_type", { length: 191 }),

    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),

    updatedAt: datetime("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => ({
    bookingUserIdIdx: index("booking_user_id_idx").on(table.userId),
    bookingDriverIdIdx: index("booking_driver_id_idx").on(table.driverId),
    bookingStatusIdx: index("booking_status_idx").on(table.status),
  })
);

/* ----------------------------------------------------------
   VEHICLES TABLE
---------------------------------------------------------- */
export const vehicles = mysqlTable(
  "vehicles",
  {
    id: int("id").primaryKey().autoincrement(),

    driverId: int("driver_id")
      .notNull()
      .references(() => drivers.id, { onDelete: "cascade" }),

    type: varchar("type", { length: 191 }).notNull(),
    number: varchar("number", { length: 191 }).notNull().unique(),

    model: varchar("model", { length: 191 }).notNull(),
    capacity: int("capacity").notNull(),

    image: text("image"),
    status: varchar("status", { length: 191 }).notNull().default("available"),

    locationLat: double("location_lat"),
    locationLng: double("location_lng"),
    currentRoute: text("current_route"),

    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),

    updatedAt: datetime("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => ({
    vehicleDriverIdIdx: index("vehicle_driver_id_idx").on(table.driverId),
    vehicleStatusIdx: index("vehicle_status_idx").on(table.status),
  })
);

/* ----------------------------------------------------------
   WALLETS TABLE
---------------------------------------------------------- */
export const wallets = mysqlTable(
  "wallets",
  {
    id: int("id").primaryKey().autoincrement(),

    userId: varchar("user_id", { length: 191 })
      .notNull()
      .unique()
      .references(() => user.id, { onDelete: "cascade" }),

    balance: double("balance").notNull().default(0),
    currency: varchar("currency", { length: 50 }).notNull().default("INR"),

    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),

    updatedAt: datetime("updated_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP`),
  },
  (table) => ({
    walletUserIdIdx: index("wallet_user_id_idx").on(table.userId),
  })
);

/* ----------------------------------------------------------
   WALLET TRANSACTIONS TABLE
---------------------------------------------------------- */
export const walletTransactions = mysqlTable(
  "wallet_transactions",
  {
    id: int("id").primaryKey().autoincrement(),

    walletId: int("wallet_id")
      .notNull()
      .references(() => wallets.id, { onDelete: "cascade" }),

    userId: varchar("user_id", { length: 191 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    type: varchar("type", { length: 191 }).notNull(),

    amount: double("amount").notNull(),
    balanceAfter: double("balance_after").notNull(),

    description: text("description").notNull(),

    referenceId: varchar("reference_id", { length: 191 }),

    status: varchar("status", { length: 191 }).notNull().default("completed"),

    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    wtWalletIdIdx: index("wt_wallet_id_idx").on(table.walletId),
    wtUserIdIdx: index("wt_user_id_idx").on(table.userId),
  })
);

/* ----------------------------------------------------------
   REVIEWS TABLE
---------------------------------------------------------- */
export const reviews = mysqlTable(
  "reviews",
  {
    id: int("id").primaryKey().autoincrement(),

    bookingId: int("booking_id")
      .notNull()
      .references(() => bookings.id, { onDelete: "cascade" }),

    userId: varchar("user_id", { length: 191 })
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),

    driverId: int("driver_id").references(() => drivers.id),

    rating: int("rating").notNull(),
    comment: text("comment"),

    createdAt: datetime("created_at")
      .notNull()
      .default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => ({
    reviewBookingIdIdx: index("review_booking_id_idx").on(table.bookingId),
    reviewDriverIdIdx: index("review_driver_id_idx").on(table.driverId),
  })
);
