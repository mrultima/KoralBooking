export function distinctValues<T>(data: T[], key: keyof T): Array<any> {
    return Array.from(new Set(data.map(item => item[key])));
}

export function distinctArrayValues<T>(data: T[], key: keyof T): Array<any> {
    return  Array.from(new Set(flatten (data.map(item => item[key]))));
}

export function flatten(arr) {
    return arr.reduce(function (flat, toFlatten) {
      return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
    }, []);
  }