--sql command "insert" allows us to add new rows into the pet table
INSERT INTO "Pet" ("apiPetId", "imageUrl", "name", "requiredStars")
--then we use another sql command that basically tells the system that the actual values that we will be implementing is below
VALUES
('dog_1', '/images/pets/dog.png', 'Nitro', 0),
('cat_1', '/images/pets/cat.png', 'Milo', 5),
('Hamster_1', '/images/pets/hamster.png', 'Chubby', 10),
('panda_1', '/images/pets/panda.png', 'kongfu', 15),
('lizard_1', '/images/pets/lizard.png', 'sneaky', 20),
('fox_1', '/images/pets/fox.png', 'model', 25),
('cub_1', '/images/pets/cub.png', 'baby', 30),
('wolf_1', '/images/pets/wolf.png', 'brave', 35),
('rabbit_1', '/images/pets/rabbit.png', 'snow', 40),
('koala_1', '/images/pets/koala.png', 'cool', 45),
('turtle_1', '/images/pets/turtle.png', 'old', 50),
('lion_1', '/images/pets/lion.png', 'king', 55),
('penguin_1', '/images/pets/penguin.png', 'goal', 60),
('blackPanther', '/images/pets/blackPanther.png', 'Goat', 65),
('dragon_1', '/images/pets/dragon.png', 'flyHigh', 60)