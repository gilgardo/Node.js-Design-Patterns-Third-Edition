// const A_CHAR_CODE = 65;
// const Z_CHAR_CODE = 90;

// function createAlphabetIterator() {
//   let currCode = A_CHAR_CODE;

//   return {
//     next() {
//       const currChar = String.fromCodePoint(currCode);
//       if (currCode > Z_CHAR_CODE) {
//         return { done: true };
//       }

//       currCode++;
//       return { value: currChar, done: false };
//     },
//   };
// }

class Myiterator {
  #current = null;
  constructor(start = 65, end = 90) {
    this.start = start;
    this.end = end;
  }
  next() {
    if (!this.#current) this.#current = this.start;
    const currChar = String.fromCodePoint(this.#current);
    if (this.#current > this.end) {
      return { done: true };
    }

    this.#current++;
    return { value: currChar, done: false };
  }
  [Symbol.iterator]() {
    return this;
  }
}
const iterator = new Myiterator();
for (const result of iterator) {
  console.log(result);
}

// let iterationResult = iterator.next()
// while (!iterationResult.done) {
//   console.log(iterationResult.value)
//   iterationResult = iterator.next()
// }
