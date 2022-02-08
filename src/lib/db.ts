import { create } from 'ipfs';
import OrbitDB from 'orbit-db';

export const initOrbit = async () => {
    const ipfsOptions = { repo: './ipfs' };
    const ipfs = await create(ipfsOptions);

    const orbit = await OrbitDB.createInstance(ipfs);
console.log(orbit.identity);
    return orbit;
};
