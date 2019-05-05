
// https://webbjocke.com/javascript-check-data-types/
export function isObject(value: any) {
  return value && typeof value === 'object' && value.constructor === Object;
}

export function isArray(value: any) {
  return value && typeof value === 'object' && value.constructor === Array;
  // ES5 actually has a method for this (ie9+)
  // Array.isArray(value);
}


export function forEach<V>(obj: {[key: string]: V}, f: (k: string, v: V) => void) {
  for (let key in obj) {
    let value = obj[key];
    f(key, value);
  }
}

/*
export function mapEntries<A, B>(obj: {[key: string]: A}, f: (k: string, v: A) => [string, B]): {[key: string]: B} {
  let result: {[key: string]: B} = {}
  for (let key in obj) {
    let value = obj[key];
    let keyValue = f(key, value);
    result[keyValue[0]] = keyValue[1];
  }
  return result;
}
*/

export function mapEntries<A, B>(obj: {[key: string]: A}, f: (k: string, v: A) => B): Array<B> {
  let result = Array<B>();
  for (let key in obj) {
    let value = obj[key];
    result.push(f(key, value))
  }
  return result;
}


/*
export function forEach<V>(arr: Array<V>, f: (v: V) => void) {
  for (let value of arr) {
    f(value);
  }
}
*/
