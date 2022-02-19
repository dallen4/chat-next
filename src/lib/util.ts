import { faker } from '@faker-js/faker';
import randomColor from 'randomcolor';

export const generateUsername = () => {
    const animal = faker.animal.type();
    const animalName = animal[0].toUpperCase() + animal.slice(1);
    return faker.commerce.productAdjective() + animalName;
};

export const generateAvatarColor = () => {
    return randomColor({ luminosity: 'bright' });
};

const hues = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

export const generateColorSet = () => {
    const hue1 = hues[Math.floor(Math.random() * hues.length)];
    const hue2 = hues[Math.floor(Math.random() * hues.length)];
    const hue3 = hues[Math.floor(Math.random() * hues.length)];

    const color1 = randomColor({ hue: hue1, luminosity: 'bright' });
    const color2 = randomColor({ hue: hue2, luminosity: 'bright' });
    const color3 = randomColor({ hue: hue3, luminosity: 'bright' });
    return [color1, color2, color3];
};
