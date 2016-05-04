export function flatten(parent, tree) {
    return tree.reduce(function(acc, val) {
        if (val === Object(val)) {
            for (let k in val) {
                let r = flatten(parent.concat(k), val[k]);
                acc = acc.concat(r);
            }
            return acc;
        }
        return acc.concat([parent.concat(val)]);
    }, []);
}
