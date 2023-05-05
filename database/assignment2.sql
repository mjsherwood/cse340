--1. Insert Tony Stark.
INSERT INTO public.account (
    account_firstname,
    account_lastname,
    account_email,
    account_password
)
VALUES (
    'Tony',
    'Stark',
    'tony@starkent.com',
    'Iam1ronM@n'
);

--2. Modify Tony's account to make him admin
UPDATE public.account
SET account_type = 'Admin'
WHERE account_email = 'tony@starkent.com';

--3. Delete Tony's account from the database
DELETE FROM public.account
WHERE account_email = 'tony@starkent.com';

--4. Update GMC Hummer Record to read "a huge interior" rahter than "small interiors"
UPDATE public.inventory
SET inv_description = REPLACE(inv_description, 'small interiors', 'a huge interior')
WHERE inv_make = 'GM' AND inv_model = 'Hummer';

--5. User inner join to select the make and model fields
--  and the classification name field from the classification table
--  for items that belong to the "Sport" category.
SELECT i.inv_make, i.inv_model, c.classification_name
FROM public.inventory i
INNER JOIN public.classification c ON i.classification_id = c.classification_id
WHERE c.classification_name = 'Sport';

--6. Update path for images and thumbnails to add "/vehicles"
UPDATE public.inventory
SET inv_image = REPLACE(inv_image, '/images/', '/images/vehicles/'),
    inv_thumbnail = REPLACE(inv_thumbnail, '/images/', '/images/vehicles/');