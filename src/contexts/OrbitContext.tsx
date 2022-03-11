import { createContext, useContext, useEffect, useState } from 'react';
import { initOrbit } from 'lib/db';
import OrbitDB from 'orbit-db';
import KeyValueStore from 'orbit-db-kvstore';

type OrbitInfo = {
    orbit: OrbitDB;
    mainDB: KeyValueStore;
    initDB: (name: string) => Promise<any>;
};

const OrbitContext = createContext<OrbitInfo>(null);

export const useOrbit = useContext(OrbitContext);

export const OrbitProvider: React.FC = ({ children }) => {
    const [orbit, setOrbit] = useState<OrbitDB>(null);
    const [mainDB, setMainDB] = useState<KeyValueStore>(null);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        const orbit = await initOrbit();
        const db = await initDB('u-chat');
        setMainDB(db);
        setOrbit(orbit);
    };

    const initDB = async (name: string) => {
        const db = await orbit.keyvalue(name, {
            accessController: {
                write: ['*'],
            },
        });

        await db.load();
        return db;
    };

    return (
        <OrbitContext.Provider value={{ orbit, mainDB, initDB }}>
            {children}
        </OrbitContext.Provider>
    );
};
