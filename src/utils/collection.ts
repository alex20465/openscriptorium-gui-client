/**
 * Collection pattern.
 */

export class Collection <K, V> {

    private _object: {} = {};

    public count(): Number {
        return Object.keys(this._object).length;
    }

    public exists(key: K): Boolean {
        return this._object.hasOwnProperty(this.normalizeKey(key));
    }

    public set(key: K, value: V) {
        this._object[this.normalizeKey(key)] = value;
    }

    public get(key: K): V {
        return this._object[this.normalizeKey(key)];
    }

    public remote(key: K): Boolean {
        if (this.exists(key)) {
            delete this._object[this.normalizeKey(key)];
            return true;
        } else {
            return false;
        }
    }

    private normalizeKey(key: K): string|number|any {
        if (key instanceof String || key instanceof Number) {
            return key;
        } else {
            return key.toString();
        }
    }
}
