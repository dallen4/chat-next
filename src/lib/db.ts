import { create } from 'ipfs';
import OrbitDB from 'orbit-db';
import Identities from 'orbit-db-identity-provider';

export const initOrbit = async () => {
    const ipfsOptions = { repo: './ipfs' };
    const ipfs = await create(ipfsOptions);

    const orbit = await OrbitDB.createInstance(ipfs);

    return orbit;
};

export const initIdentity = async (id: string) => {
    const identity = await Identities.createIdentity({ id });

    return identity;
};
