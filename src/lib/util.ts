import { faker } from '@faker-js/faker';

export const generateUsername = () => {
    const animal = faker.animal.type();
    const animalName = animal[0].toUpperCase() + animal.slice(1);
    return faker.commerce.productAdjective() + animalName;
};
