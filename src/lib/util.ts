import { adjectives, animals, NumberDictionary, uniqueNamesGenerator } from 'unique-names-generator';
import { nanoid } from 'nanoid';
import randomColor from 'randomcolor';

export const generateUsername = (prevSeed?: string) => {
    const seed = prevSeed || nanoid();

    const [variant] = NumberDictionary.generate({ min: 1000, max: 9999 });

    const username = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
        separator: '',
        style: 'capital',
        seed,
    });

    return username;
};

export const generateAvatarColor = () => {
    return randomColor({ luminosity: 'bright' });
};

// ref: https://github.com/davidmerfield/randomColor#options
const hues = ['red', 'orange', 'yellow', 'green', 'blue', 'purple', 'pink', 'monochrome'];

export const generateColorSet = (amount: number = 2) => {
    const colors = new Array<string>(amount);

    for (let cIndex = 0; cIndex < amount; cIndex++) {
        const hue = hues[Math.floor(Math.random() * hues.length)];

        colors[cIndex] = randomColor({ hue, luminosity: 'bright' });
    }

    return colors;
};
