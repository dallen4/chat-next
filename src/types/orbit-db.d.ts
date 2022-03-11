declare module 'orbit-db-address' {
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

declare module 'orbit-db-store' {
    export default Store;
    export { _DefaultOptions as DefaultOptions };

    class Index {
        constructor(id: any);
        id: any;
        _index: any[];
        get(): any[];
        updateIndex(oplog: any, entries: any): Promise<void>;
    }

    class Replicator {
        constructor(store: any, concurrency: any);
        _store: any;
        _concurrency: any;
        _q: import('p-queue').default<
            import('p-queue/dist/priority-queue').default,
            import('p-queue').DefaultAddOptions
        >;
        _logs: any[];
        _fetching: {};
        _fetched: {};
        /**
         * Returns the number of replication tasks running currently
         * @return {[Integer]} [Number of replication tasks running]
         */
        get tasksRunning(): [any];
        /**
         * Returns the number of replication tasks currently queued
         * @return {[Integer]} [Number of replication tasks queued]
         */
        get tasksQueued(): [any];
        /**
         * Returns the hashes currently queued or being processed
         * @return {[Array]} [Strings of hashes of entries currently queued or being processed]
         */
        get unfinished(): [any[]];
        load(entries: any): Promise<void>;
        _addToQueue(entries: any): Promise<void>;
        stop(): Promise<void>;
        _replicateLog(entry: any): Promise<any>;
    }

    class Store {
        constructor(ipfs: any, identity: any, address: any, options: any);
        options: {
            Index: any;
            maxHistory: number;
            fetchEntryTimeout: any;
            referenceCount: number;
            replicationConcurrency: number;
            syncLocal: boolean;
            sortFn: any;
        };
        _type: string;
        id: any;
        identity: any;
        address: any;
        dbname: any;
        events: EventEmitter;
        remoteHeadsPath: string;
        localHeadsPath: string;
        snapshotPath: string;
        queuePath: string;
        manifestPath: string;
        _ipfs: any;
        _cache: any;
        access: any;
        _oplog: any;
        _queue: PQueue<
            import('p-queue/dist/priority-queue').default,
            import('p-queue').DefaultAddOptions
        >;
        _index: any;
        _replicationStatus: any;
        _stats: {
            snapshot: {
                bytesLoaded: number;
            };
            syncRequestsReceieved: number;
        };
        _replicator: Replicator;
        _loader: any;
        get all(): any;
        get index(): any;
        get type(): string;
        get key(): any;
        /**
         * Returns the database's current replication status information
         * @return {[Object]} [description]
         */
        get replicationStatus(): [any];
        setIdentity(identity: any): void;
        close(): Promise<void>;
        /**
         * Drops a database and removes local data
         * @return {[None]}
         */
        drop(): [any];
        load(amount?: any, opts?: {}): Promise<void>;
        sync(heads: any): Promise<any>;
        loadMoreFrom(amount: any, entries: any): void;
        saveSnapshot(): Promise<any[]>;
        loadFromSnapshot(onProgressCallback: any): Promise<Store>;
        _updateIndex(): Promise<void>;
        syncLocal(): Promise<void>;
        _addOperation(
            data: any,
            {
                onProgressCallback,
                pin,
            }?: {
                onProgressCallback: any;
                pin?: boolean;
            },
        ): Promise<any>;
        _addOperationBatch(
            data: any,
            batchOperation: any,
            lastOperation: any,
            onProgressCallback: any,
        ): void;
        _procEntry(entry: any): void;
        _recalculateReplicationProgress(): void;
        _recalculateReplicationMax(max: any): void;
        _recalculateReplicationStatus(maxTotal: any): void;
        _onLoadProgress(entry: any): void;
    }

    const _DefaultOptions: DefaultOptions;
    interface DefaultOptions {
        Index: Index;
        maxHistory: number;
        fetchEntryTimeout: any;
        referenceCount: number;
        replicationConcurrency: number;
        syncLocal: boolean;
        sortFn: any;
    }

    import { EventEmitter } from 'events';
    import { default as PQueue } from 'p-queue';
}

declare module 'orbit-db-kvstore' {
    export = KeyValueStore;

    import Store from 'orbit-db-store';

    class KeyValueStore extends Store {
        [x: string]: any;
        constructor(ipfs: any, id: any, dbname: any, options: any);
        _type: string;
        get all(): any;
        get(key: string): any;
        set(key: string, data: any, options?: {}): any;
        put(key: string, data: any, options?: {}): any;
        del(key: string, options?: {}): any;
    }
}

declare module 'orbit-db' {
    export = OrbitDB;

    class OrbitDB {
        static get Pubsub(): any;
        static get Cache(): any;
        static get Keystore(): any;
        static get Identities(): any;
        static get AccessControllers(): any;
        static get Storage(): any;
        static get OrbitDBAddress(): typeof import('orbit-db-address');
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
        static parseAddress(address: any): import('orbit-db-address');
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
        keyvalue(address: any, options?: {}): Promise<import('orbit-db-kvstore')>;
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
        _determineAddress(
            name: any,
            type: any,
            options?: {},
        ): Promise<import('orbit-db-address')>;
        create(name: any, type: any, options?: {}): any;
        determineAddress(
            name: any,
            type: any,
            options?: {},
        ): Promise<import('orbit-db-address')>;
        _requestCache(address: any, directory: any, existingCache: any): Promise<any>;
        open(address: any, options?: {}): any;
        _addManifestToCache(cache: any, dbAddress: any): Promise<void>;
        /**
         * Check if we have the database, or part of it, saved locally
         * @param  {[Cache]} cache [The OrbitDBCache instance containing the local data]
         * @param  {[OrbitDBAddress]} dbAddress [Address of the database to check]
         * @return {[Boolean]} [Returns true if we have cached the db locally, false if not]
         */
        _haveLocalData(
            cache: [Cache],
            dbAddress: [import('orbit-db-address')],
        ): [boolean];
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
