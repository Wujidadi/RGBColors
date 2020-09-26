/**
 * 自行封裝的 IndexedDB 類別
 *
 * @param {string} dbName 資料庫名稱
 * @param {string} storeName 資料表（物件存檔）名稱
 * @param {{}[]} indexArray 索引物件陣列
 */
class IndexedDBClass
{
    constructor(dbName = null, storeName = null, indexArray = [])
    {
        this.dbName = dbName;
        this.dbInitVersion = 1;
        this.storeName = storeName;
        this.indexArray = indexArray;

        if ((this.dbName !== null && this.dbName !== '') && (this.storeName !== null && this.storeName !== ''))
        {
            // 開啟資料庫
            this.request = window.indexedDB.open(dbName, this.dbInitVersion);
            this.request.onsuccess = event => {
                this.db = event.currentTarget.result;
            };
            this.request.onerror = event => {
                alert('IndexedDB 存取失敗！');
            };
            this.request.onupgradeneeded = event =>
            {
                this.db = event.currentTarget.result;
                if (!this.db.objectStoreNames.contains(this.storeName))
                {
                    // 建立資料表（物件存檔）
                    let ObjectStore = event.currentTarget.result.createObjectStore(
                        this.storeName,
                        // 建立主鍵
                        {
                            keyPath: 'key',
                            autoIncrement: false
                        });

                    // 建立索引
                    if (this.indexArray.length > 0) {
                        this.indexArray.forEach(index => {
                            ObjectStore.createIndex(index.indexName, index.keyPath, index.objectParameters);
                        });
                    }
                }
            };
        }
    }


    /*
     *==============================
     * indexes：列出索引
     *==============================
     */

    /**
     * 列出資料表（物件存檔）內的索引
     * @return {string[]} 索引名稱陣列
     */
    indexes()
    {
        let IndexArray = [];

        if ((this.dbName !== null && this.dbName !== '') && (this.storeName !== null && this.storeName !== ''))
        {
            let Transaction = this.db.transaction([this.storeName], 'readwrite'),
                ObjectStore = Transaction.objectStore(this.storeName),
                IndexNames = ObjectStore.indexNames;

            for (let i = 0; i < IndexNames.length; i++) {
                IndexArray.push(IndexNames[i]);
            }
        }

        return IndexArray;
    }


    /*
     *==============================
     * add：新增資料
     *==============================
     */

    /**
     * 新增資料
     * @param {{}[]} data 待新增資料陣列
     */
    add(data = [])
    {
        if ((this.dbName !== null && this.dbName !== '') && (this.storeName !== null && this.storeName !== '') &&
            typeof data === 'object' && data.length > 0)
        {
            let Transaction = this.db.transaction([this.storeName], 'readwrite'),
                ObjectStore = Transaction.objectStore(this.storeName),
                Request;

            data.forEach(datum => {
                Request = ObjectStore.add(datum);
                Request.onsuccess = event => {
                    console.log('新增 IndexedDB 資料成功！');
                };
                Request.onerror = event => {
                    console.log('新增 IndexedDB 資料失敗！');
                };
            });
        } else {
            console.log('未新增 IndexedDB 資料！');
        }
    }


    /*
     *==============================
     * get：依主鍵的值查詢資料
     *==============================
     */

    /**
     * 依主鍵的值查詢資料；調用非同步方法 getByValueOfPrimaryKey，使用時須以 await 關鍵字呼叫
     * @param {string} value 主鍵欄位的值
     */
    get(value)
    {
        let Data = this.getByValueOfPrimaryKey(value);
        return Data;
    }

    /**
     * 由主鍵的值取得資料；非同步方法
     * @param {string} value 主鍵欄位的值
     */
    getByValueOfPrimaryKey(value)
    {
        let Data = new Promise((resolve, reject) =>
        {
            if ((this.dbName !== null && this.dbName !== '') && (this.storeName !== null && this.storeName !== ''))
            {
                let Transaction = this.db.transaction([this.storeName], 'readwrite'),
                    ObjectStore = Transaction.objectStore(this.storeName),
                    Request = ObjectStore.get(value);

                Request.onsuccess = event => {
                    if (typeof Request.result === 'object') {
                        resolve(Request.result);
                    } else {
                        reject('指定查詢的 IndexedDB 資料不存在！');
                    }
                };
                Request.onerror = event => {
                    reject('查詢 IndexedDB 資料失敗！');
                };
            }
        }).then(result => result, reason => {
            console.log(reason);
            return {};
        });

        return Data;
    }


    /*
     *==================================================
     * getAll：取得資料表（物件存檔）內的全部資料
     *==================================================
     */

    /**
     * 取得資料表（物件存檔）內的全部資料；調用非同步方法 getAllData，使用時須以 await 關鍵字呼叫
     */
    getAll()
    {
        let Data = this.getAllData();
        return Data;
    }

    /**
     * 取得資料表（物件存檔）內的全部資料；非同步方法
     */
    getAllData()
    {
        let Data = new Promise((resolve, reject) =>
        {
            if ((this.dbName !== null && this.dbName !== '') && (this.storeName !== null && this.storeName !== ''))
            {
                let Transaction = this.db.transaction([this.storeName], 'readwrite'),
                    ObjectStore = Transaction.objectStore(this.storeName),
                    Request = ObjectStore.getAll();

                Request.onsuccess = event => {
                    resolve(Request.result);
                };
                Request.onerror = event => {
                    reject('取得 IndexedDB ' + this.dbName + '.' + this.storeName + ' 資料表（物件存檔）全部資料時失敗！');
                };
            }
        }).then(result => result, reason => {
            console.log(reason);
            return [];
        });

        return Data;
    }


    /*
     *==============================
     * getKey：查詢主鍵
     *==============================
     */

    /**
     * 查詢主鍵；調用非同步方法 getPrimaryKey，使用時須以 await 關鍵字呼叫
     * @param {string} value 主鍵值
     */
    getKey(value)
    {
        let Data = this.getPrimaryKey(value);
        return Data;
    }

    /**
     * 查詢主鍵；非同步方法
     * @param {string} value 主鍵值
     */
    getPrimaryKey(value)
    {
        let Data = new Promise((resolve, reject) =>
        {
            if ((this.dbName !== null && this.dbName !== '') && (this.storeName !== null && this.storeName !== ''))
            {
                let Transaction = this.db.transaction([this.storeName], 'readwrite'),
                    ObjectStore = Transaction.objectStore(this.storeName),
                    Request = ObjectStore.getKey(value);

                Request.onsuccess = event => {
                    if (typeof Request.result === 'string') {
                        resolve(Request.result);
                    } else {
                        reject('指定查詢的 IndexedDB 主鍵不存在！');
                    }
                };
                Request.onerror = event => {
                    reject('查詢 IndexedDB 主鍵失敗！');
                };
            }
        }).then(result => result, reason => {
            console.log(reason);
            return null;
        });

        return Data;
    }


    /*
     *========================================
     * read：依已建立索引的欄位之值查詢資料
     *========================================
     */

    /**
     * 依已建立索引的欄位之值查詢資料；調用非同步方法 readByValueOfIndexedKey，使用時須以 await 關鍵字呼叫
     * @param {string} index 索引名稱
     * @param {string} value index 對應的欄位之值
     */
    read(index, value)
    {
        let Data = this.readByValueOfIndexedKey(index, value);
        return Data;
    }

    /**
     * 依已建立索引的欄位之值查詢資料；非同步方法
     * @param {string} index 索引名稱
     * @param {string} value index 對應欄位的值
     */
    readByValueOfIndexedKey(index, value)
    {
        let Data = new Promise((resolve, reject) =>
        {
            if ((this.dbName !== null && this.dbName !== '') && (this.storeName !== null && this.storeName !== '') &&
                this.indexes().indexOf(index) > -1)
            {
                let Transaction = this.db.transaction([this.storeName], 'readwrite'),
                    ObjectStore = Transaction.objectStore(this.storeName),
                    Index = ObjectStore.index(index),
                    Request = Index.getAll(value);

                Request.onsuccess = event => {
                    resolve(Request.result);
                };
                Request.onerror = event => {
                    reject('依索引查詢 IndexedDB 資料失敗！');
                };
            }
            else
            {
                if (this.indexes().indexOf(index) <= -1) {
                    reject('索引名稱（' + index + '）不正確！');
                } else {
                    reject('資料庫（' + this.dbName + '）或資料表（物件存檔）（' + this.storeName + '）名稱不正確！');
                }
            }
        }).then(result => result, reason => {
            console.log(reason);
            return [];
        });

        return Data;
    }


    /*
     *========================================
     * count：依主鍵的值計算資料筆數
     *========================================
     */

    /**
     * 依主鍵的值計算資料筆數，未指定值時計算整張資料表（物件存檔）的資料筆數；調用非同步方法 countByValueOfPrimaryKey，使用時須以 await 關鍵字呼叫
     * @param {string} value 主鍵欄位之值，未指定時預設為 null，即計算整表資料筆數
     */
    count(value = null)
    {
        let Data = this.countByValueOfPrimaryKey(value);
        return Data;
    }

    /**
     * 依主鍵的值計算資料筆數，未指定值時計算整張資料表（物件存檔）的資料筆數；非同步方法
     * @param {string} value 主鍵欄位之值，未指定時預設為 null，即計算整表資料筆數
     */
    countByValueOfPrimaryKey(value = null)
    {
        let Count = new Promise((resolve, reject) =>
        {
            if ((this.dbName !== null && this.dbName !== '') && (this.storeName !== null && this.storeName !== ''))
            {
                let Transaction = this.db.transaction([this.storeName], 'readwrite'),
                    ObjectStore = Transaction.objectStore(this.storeName),
                    Request = ObjectStore.count(value);

                Request.onsuccess = event => {
                    resolve(Request.result);
                };
                Request.onerror = event => {
                    reject('新增 IndexedDB 資料失敗！');
                };
            }
        }).then(result => result, reason => {
            console.log(reason);
            return 0;
        });

        return Count;
    }


    /*
     *==============================
     * update：更新資料
     *==============================
     */

    /**
     * 更新資料
     * @param {{}[]} data 待更新資料陣列，每一筆須為 {item: ..., key: ...} 的形式（主鍵為 in-line key 時不可帶 key 參數）
     */
    update(data)
    {
        if ((this.dbName !== null && this.dbName !== '') && (this.storeName !== null && this.storeName !== ''))
        {
            let Transaction = this.db.transaction([this.storeName], 'readwrite'),
                ObjectStore = Transaction.objectStore(this.storeName),
                Request;

            data.forEach(datum => {
                Request = ObjectStore.put(datum.item, datum.key);
                Request.onsuccess = event => {
                    console.log('更新 IndexedDB 資料成功！');
                };
                Request.onerror = event => {
                    console.log('更新 IndexedDB 資料失敗！');
                };
            });
        } else {
            console.log('未更新 IndexedDB 資料！');
        }
    }


    /*
     *==============================
     * delete：刪除資料
     *==============================
     */

    /**
     * 依據資料主鍵值刪除資料
     * @param {string|number} value 待刪除資料主鍵值
     */
    delete(value)
    {
        if ((this.dbName !== null && this.dbName !== '') && (this.storeName !== null && this.storeName !== ''))
        {
            let Transaction = this.db.transaction([this.storeName], 'readwrite'),
                ObjectStore = Transaction.objectStore(this.storeName),
                Request = ObjectStore.delete(value);

            Request.onsuccess = event => {
                console.log('刪除 IndexedDB 資料成功！');
            };
            Request.onerror = event => {
                console.log('刪除 IndexedDB 資料失敗！');
            };
        } else {
            console.log('未刪除 IndexedDB 資料！');
        }
    }


    /*
     *==============================
     * clear：清空資料
     *==============================
     */

    /**
     * 清空資料資料表（物件存檔）
     */
    clear()
    {
        if ((this.dbName !== null && this.dbName !== '') && (this.storeName !== null && this.storeName !== ''))
        {
            let Transaction = this.db.transaction([this.storeName], 'readwrite'),
                ObjectStore = Transaction.objectStore(this.storeName),
                Request = ObjectStore.clear();

            Request.onsuccess = event => {
                console.log('清空 IndexedDB ' + this.dbName + '.' + this.storeName + ' 資料表（物件存檔）資料成功！');
            };
            Request.onerror = event => {
                console.log('清空 IndexedDB ' + this.dbName + '.' + this.storeName + ' 資料表（物件存檔）資料失敗！');
            };
        } else {
            console.log('未清空 IndexedDB ' + this.dbName + '.' + this.storeName + ' 資料表（物件存檔）資料！');
        }
    }
}