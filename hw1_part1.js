'use strict';

// 1.1
function concatenate(arr, separator) {
  return arr.join(separator);
}

// 1.5
function moveElement(arr, from, to) {
  const copy = [...arr];
  if (
    !Number.isInteger(from) ||
    !Number.isInteger(to) ||
    from < 0 ||
    to < 0 ||
    from >= copy.length ||
    to >= copy.length
  ) {
    return copy;
  }

  const [item] = copy.splice(from, 1);
  copy.splice(to, 0, item);
  return copy;
}

// 2.5
function findCouple(array, number) {
  const unique = new Set(array);
  const pairs = [];

  for (const x of unique) {
    const y = number - x;
    if (unique.has(y) && x <= y) {
      pairs.push(`${x}+${y}`);
    }
  }

  return pairs.join(', ');
}

// 3.1
function merge(...objects) {
  const result = {};

  for (const obj of objects) {
    for (const key of Object.keys(obj)) {
      if (!(key in result)) {
        result[key] = obj[key];
      }
    }
  }

  return result;
}

// 3.2
function inverse(arr, n = 0) {
  const copy = [...arr];

  if (!Number.isInteger(n) || n === 0) {
    return copy.reverse();
  }

  if (n > 0) {
    const left = copy.slice(0, n);
    const right = copy.slice(n).reverse();
    return left.concat(right);
  }

  const keepTail = Math.abs(n);
  const middle = copy.slice(0, copy.length - keepTail).reverse();
  const tail = copy.slice(copy.length - keepTail);
  return middle.concat(tail);
}

// 3.3
function flatten(input) {
  const result = [];

  function dfs(node) {
    for (const item of node) {
      if (Array.isArray(item)) {
        dfs(item);
      } else {
        result.push(item);
      }
    }
  }

  dfs(input);
  return result;
}

// 3.4
function sort(sentence) {
  const words = sentence
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => {
      const chars = word.toLowerCase().split('').sort();
      const normalized = chars.join('');
      return normalized.charAt(0).toUpperCase() + normalized.slice(1);
    })
    .sort((a, b) => a.localeCompare(b));

  return words.join(' ');
}

// 3.5
function anagram(words) {
  const map = new Map();

  for (const word of words) {
    const key = word.toLowerCase().split('').sort().join('');
    if (!map.has(key)) {
      map.set(key, []);
    }
    map.get(key).push(word);
  }

  return [...map.values()]
    .filter((group) => group.length >= 2)
    .map((group) => group.slice().sort((a, b) => a.localeCompare(b)))
    .sort((a, b) => a[0].localeCompare(b[0]));
}

// 3.6
function rle(str) {
  if (str.length === 0) {
    return '';
  }

  let result = '';
  let count = 1;

  for (let i = 1; i <= str.length; i += 1) {
    if (str[i] === str[i - 1]) {
      count += 1;
    } else {
      result += `${str[i - 1]}${count}`;
      count = 1;
    }
  }

  return result;
}

// Demo checks in console
console.log('1.1:', concatenate(['Я', 'Учусь', 'на', 'лучшей', 'кафедре'], ' '));
console.log('1.5:', moveElement([1, 2, 3, 4], 1, 3));
console.log('2.5:', findCouple([1, 6, 5, 2, 7, 5, 1, 4, 3, 9, 8, 11, 10, 18], 5));

console.log('3.1:', merge({ a: 1, b: 2 }, { b: 99, c: 3 }, { d: 4 }));
console.log('3.2a:', inverse([1, 2, 3, 4, 5]));
console.log('3.2b:', inverse([1, 2, 3, 4, 5], 2));
console.log('3.2c:', inverse([1, 2, 3, 4, 5], -2));
console.log('3.3:', flatten([1, 2, 3, [4, 5, 6, [10, 20, 30]]]));
console.log('3.4:', sort('hello world javascript')); 
console.log('3.5:', anagram(['пятак', 'пятка', 'тяпка', 'листок', 'слиток', 'столик', 'кот']));
console.log('3.6:', rle('AAABCCCCDD'));
