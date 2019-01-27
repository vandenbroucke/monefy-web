/**
 * ParserHelper provides methods for data manipulation.
 */
export default{   
    /**
     * Given an array of records and a identifier, group them as an Object, by the given identifier.
     * @param {Array} xs Array of records you want to group
     * @param {String} key Key identifier by which you want to group the input records.
     */
    group_array_by_key(xs, key) {
        //given an array of entities and a key, group the entities by that key.
        return xs.reduce(function(rv, x) {
            (rv[x[key]] = rv[x[key]] || []).push(x);
            return rv;
        }, {});
    },
   
}
