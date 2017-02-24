function save(key, obj) {
    localStorage[key] = JSON.stringify(obj);
}

function acquire(key, defaultObj) {
    var v = localStorage[key];

    if (!defaultObj) {
        defaultObj = {};
    }

    if (v == undefined) {

        save(key, defaultObj);
        return defaultObj;

    }

    return JSON.parse(v);
}

module.exports = {
    save: save,
    acquire: acquire 
};