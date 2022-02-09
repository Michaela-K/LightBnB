INSERT INTO users (id, name, email, password)
VALUES (1, 'Bobby Fisher', 'bobby@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
(2, 'Millicent Dollar', 'amilli@gmail.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u'),
(3, 'Mary Brown', 'maryhadalittlelamb@yahoo.com', '$2a$10$FB/BOAVhpuLvpOREQVmvmezD4ED/.JBIDRh70tGevYzYzQgFId2u');


INSERT INTO properties (id, owner_id, title, description, thumbnail_photo_url, cover_photo_url, cost_per_night, parking_spaces, number_of_bathrooms, number_of_bedrooms, country, street, city, province, post_code, active)
VALUES (5, 1, 'Fort', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 50, 1, 1, 1, 'Canada', 'man', 'Edmonton', 'Alberta', 'T5A 0A1', true),
(8, 2, 'Port', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 80, 1, 2, 2, 'Canada', 'official', 'Edmonton', 'Alberta', 'T5A 0A1', true),
(6, 3, 'Court', 'description', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg?auto=compress&cs=tinysrgb&h=350', 'https://images.pexels.com/photos/2086676/pexels-photo-2086676.jpeg', 200, 5, 4, 4, 'Canada', 'king', 'Edmonton', 'Alberta', 'T5A 0A1', true);


INSERT INTO reservations (id, guest_id, property_id, start_date, end_date)
VALUES (1, 1, 5, '2022-07-13', '2022-07-29'),
(2, 2, 8, '2022-08-04', '2022-08-07'),
(3, 3, 6, '2022-12-14', '2022-12-28');


INSERT INTO property_reviews (guest_id, property_id, reservation_id, rating, message)
VALUES (1, 5, 1, '3', 'messages'),
(2, 8, 2, '4', 'messages'),
(3, 6, 3, '5', 'messages');
