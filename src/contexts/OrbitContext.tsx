import { createContext, useContext, useEffect, useState } from 'react';
import { initOrbit } from 'lib/orbit';
import OrbitDB from 'orbit-db';
import KeyValueStore from 'orbit-db-kvstore';

type OrbitInfo = {
    orbit: OrbitDB;
    mainDB: KeyValueStore;
    initDB: (name: string) => Promise<any>;
};

const OrbitContext = createContext<OrbitInfo>(null);

export const useOrbit = () => useContext(OrbitContext);

export const OrbitProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [orbit, setOrbit] = useState<OrbitDB>(null);
    const [mainDB, setMainDB] = useState<KeyValueStore>(null);

    useEffect(() => {
        init();
    }, []);

    const init = async () => {
        console.log('init orbit');
        const orbit = await initOrbit();

        // const db = await orbit.keyvalue(name, {
        //     accessController: {
        //         write: ['*'],
        //     },
        // });

        // await db.load();

        // const testVal = await db.get('u-chat-test');

        // console.log('FETCHED TEST VAL', testVal);

        // if (!testVal) {
        //     await db.set('u-chat-test', {
        //         test: 'test',
        //     });
        //     db.get('u-chat-test').then(console.log);
        // }

        // setMainDB(db);
        // setOrbit(orbit);
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
