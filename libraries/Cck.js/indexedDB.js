(async function() {
    window.indexedDB.listDatabases = await indexedDB.databases().then(dbs =>
    {
        let dbList = [];
        dbs.forEach(db =>
        {
            dbList.push({
                name: db.name,
                version: db.version
            });
        });
        return {
            count: dbs.length,
            list: dbList
        };
    });
})();