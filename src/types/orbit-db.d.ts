declare module "orbit-db-address" {
    export = OrbitDBAddress;
    class OrbitDBAddress {
        static isValid(address: any): boolean;
        static parse(address: any): OrbitDBAddress;
        static join(...paths: any[]): any;
        constructor(root: any, path: any);
        root: any;
        path: any;
        toString(): any;
    }
}
declare module "db-manifest" {
    export = createDBManifest;
    function createDBManifest(ipfs: any, name: any, type: any, accessControllerAddress: any, options: any): Promise<any>;
}
declare module "exchange-heads" {
    export = exchangeHeads;
    function exchangeHeads(ipfs: any, address: any, peer: any, getStore: any, getDirectConnection: any, onMessage: any, onChannelCreated: any): Promise<any>;
}
declare module "utils/is-defined" {
    export = isDefined;
    function isDefined(arg: any): boolean;
}
declare module "utils/index" {
    export const isDefined: (arg: any) => boolean;
    export const io: any;
}
declare module "fs-shim" {
    export = fs;
    const fs: any;
}
declare module "migrations/0.21-0.22" {
    export = migrate;
    function migrate(OrbitDB: any, options: any, dbAddress: any): Promise<void>;
}
declare module "migrations/index" {
    export function run(OrbitDB: any, options: any, dbAddress: any): Promise<void>;
}
declare module "orbit-db" {
    export = OrbitDB;
    class OrbitDB {
        static get Pubsub(): any;
        static get Cache(): any;
        static get Keystore(): any;
        static get Identities(): any;
        static get AccessControllers(): any;
        static get Storage(): any;
        static get OrbitDBAddress(): typeof import("orbit-db-address");
        static get Store(): any;
        static get EventStore(): any;
        static get FeedStore(): any;
        static get KeyValueStore(): any;
        static get CounterStore(): any;
        static get DocumentStore(): any;
        static createInstance(ipfs: any, options?: {}): Promise<OrbitDB>;
        /**
         * Returns supported database types as an Array of strings
         * Eg. [ 'counter', 'eventlog', 'feed', 'docstore', 'keyvalue']
         * @return {[Array]} [Supported database types]
         */
        static get databaseTypes(): [any[]];
        static isValidType(type: any): any;
        static addDatabaseType(type: any, store: any): void;
        static getDatabaseTypes(): {
            counter: any;
            eventlog: any;
            feed: any;
            docstore: any;
            keyvalue: any;
        };
        static isValidAddress(address: any): boolean;
        static parseAddress(address: any): import("orbit-db-address");
        constructor(ipfs: any, identity: any, options?: {});
        _ipfs: any;
        identity: any;
        id: any;
        _pubsub: any;
        directory: any;
        storage: any;
        _directConnections: {};
        caches: {};
        keystore: any;
        stores: {};
        get cache(): any;
        feed(address: any, options?: {}): Promise<any>;
        log(address: any, options?: {}): Promise<any>;
        eventlog(address: any, options?: {}): Promise<any>;
        keyvalue(address: any, options?: {}): Promise<any>;
        kvstore(address: any, options?: {}): Promise<any>;
        counter(address: any, options?: {}): Promise<any>;
        docs(address: any, options?: {}): Promise<any>;
        docstore(address: any, options?: {}): Promise<any>;
        disconnect(): Promise<void>;
        stop(): Promise<void>;
        _createCache(path: any): Promise<any>;
        _createStore(type: any, address: any, options: any): Promise<any>;
        _onWrite(address: any, entry: any, heads: any): void;
        _onMessage(address: any, heads: any, peer: any): Promise<void>;
        _onPeerConnected(address: any, peer: any): Promise<void>;
        _onClose(db: any): Promise<void>;
        _onDrop(db: any): Promise<void>;
        _onLoad(db: any): Promise<void>;
        _determineAddress(name: any, type: any, options?: {}): Promise<import("orbit-db-address")>;
        create(name: any, type: any, options?: {}): any;
        determineAddress(name: any, type: any, options?: {}): Promise<import("orbit-db-address")>;
        _requestCache(address: any, directory: any, existingCache: any): Promise<any>;
        open(address: any, options?: {}): any;
        _addManifestToCache(cache: any, dbAddress: any): Promise<void>;
        /**
         * Check if we have the database, or part of it, saved locally
         * @param  {[Cache]} cache [The OrbitDBCache instance containing the local data]
         * @param  {[OrbitDBAddress]} dbAddress [Address of the database to check]
         * @return {[Boolean]} [Returns true if we have cached the db locally, false if not]
         */
        _haveLocalData(cache: [Cache], dbAddress: [import("orbit-db-address")]): [boolean];
        /**
         * Runs all migrations inside the src/migration folder
         * @param Object options  Options to pass into the migration
         * @param OrbitDBAddress dbAddress Address of database in OrbitDBAddress format
         */
        _migrate(options: any, dbAddress: any): Promise<void>;
        AccessControllers: any;
        Identities: any;
        Keystore: any;
    }
    const Cache: any;
}
