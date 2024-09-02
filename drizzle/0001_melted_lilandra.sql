CREATE TABLE IF NOT EXISTS "meal_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"meal_id" uuid NOT NULL,
	"food_name" text NOT NULL,
	"quantity" text NOT NULL,
	"unit" text NOT NULL,
	"calories" text,
	"protein" text,
	"carbs" text,
	"fat" text
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "meals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"meal_type" text NOT NULL,
	"meal_datetime" timestamp NOT NULL,
	"notes" text
);

--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);

--> statement-breakpoint
DROP TABLE "books";

--> statement-breakpoint
DO $ $ BEGIN
ALTER TABLE
	"meal_items"
ADD
	CONSTRAINT "meal_items_meal_id_meals_id_fk" FOREIGN KEY ("meal_id") REFERENCES "public"."meals"("id") ON DELETE no action ON UPDATE no action;

EXCEPTION
WHEN duplicate_object THEN null;

END $ $;

--> statement-breakpoint
DO $ $ BEGIN
ALTER TABLE
	"meals"
ADD
	CONSTRAINT "meals_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;

EXCEPTION
WHEN duplicate_object THEN null;

END $ $;