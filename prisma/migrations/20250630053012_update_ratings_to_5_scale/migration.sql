-- This is an empty migration.

-- Update existing recipe ratings from 1-10 scale to 1-5 scale
-- Divide by 2 and round to nearest integer, ensuring minimum of 1 and maximum of 5
UPDATE "Recipe" 
SET "rating" = CASE 
  WHEN "rating" <= 2 THEN 1
  WHEN "rating" <= 4 THEN 2
  WHEN "rating" <= 6 THEN 3
  WHEN "rating" <= 8 THEN 4
  ELSE 5
END
WHERE "rating" > 5;