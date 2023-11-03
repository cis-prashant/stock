interface CustomMapEntry<TKey, TValue> {
    key: TKey;
    value: TValue;
}

export class CustomMap<TKey, TValue> {
    private entries: CustomMapEntry<TKey, TValue>[] = [];

    set(key: TKey, value: TValue) {
        const index = this.entries.findIndex(entry => entry.key === key);
        if (index !== -1) {
            this.entries[index].value = value;
        } else {
            this.entries.push({ key, value });
        }
    }

    get(key: TKey): TValue | undefined {
        const entry = this.entries.find(entry => entry.key === key);
        return entry ? entry.value : undefined;
    }

    delete(key: TKey) {
        const index = this.entries.findIndex(entry => entry.key === key);
        if (index !== -1) {
            this.entries.splice(index, 1);
        }
    }

    getEntries(): CustomMapEntry<TKey, TValue>[] {
        return this.entries;
    }

    clear() {
        this.entries = [];
    }
}