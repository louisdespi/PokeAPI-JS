class Utils {
    static chunkify(collection, chunk_length) {
        let chunks = [];
        let index = 0;
        while (index < collection.length) {
            chunks.push(collection.slice(index, index + chunk_length));
            index += chunk_length;
        }
        return chunks
    }
    static get_range(from, to) {
        return Array.from({ length: to - from + 1 }, (_, index) => index + from);
    }
}