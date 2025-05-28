// const person = {
//   firstName: "alessandro",
//   surname: "foresta",
//   age: 27,
//   gender: "male",
// };

// const trap = {
//   set: function (target, prop, value) {
//     if (!(prop in target)) throw new Error("this propriety is not settable");
//     if (typeof target[prop] !== typeof value)
//       throw new TypeError("bad value type");
//     target[prop] = value;
//     return true;
//   },
// };

// const personWithValidation = new Proxy(person, trap);

// personWithValidation.lol = 40;
// console.log(personWithValidation.lol);
// const Tree = () => new Proxy({}, trap);

// const trap = {
//   get: function (target, prop, receiver) {
//     if (!(prop in target)) {
//       target[prop] = Tree();
//     }
//     return Reflect.get(target, prop, receiver);
//   },
// };
// const tree = Tree();
// tree.branch.lol.all = "ahahaah";
// console.log(tree);

const readOnly = (obj) => {
  const trap = {
    set: function () {
      throw new Error("can't modify the props of this object");
    },
  };
  return new Proxy(obj, trap);
};

const person = {
  firstName: "alessandro",
  surname: "foresta",
  age: 27,
  gender: "male",
};

const readOnlyPerson = readOnly(person);

console.log(readOnlyPerson.age);
readOnlyPerson.age = 30;
