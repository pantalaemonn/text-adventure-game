// =============================================
// Object-Oriented Programming in JavaScript
// =============================================

// 1. Class Declaration
// Classes are templates for creating objects. They encapsulate data and behavior.
class Animal {
  // Declare private fields in the class body
  #name;
  #age;

  // Constructor - special method for creating and initializing objects
  constructor(name, age) {
    // Initialize private properties
    this.#name = name;
    this.#age = age;
  }

  // Getter - allows access to private properties
  get name() {
    return this.#name;
  }

  // Getter for age
  get age() {
    return this.#age;
  }

  // Setter - allows modification of private properties
  set name(newName) {
    if (typeof newName === "string") {
      this.#name = newName;
    } else {
      throw new Error("Name must be a string");
    }
  }

  // Instance method
  makeSound() {
    return "Some generic sound";
  }

  // Static method - belongs to the class itself, not instances
  static createBaby(name) {
    return new Animal(name, 0);
  }
}

// 2. Inheritance and Method Overriding
class Dog extends Animal {
  constructor(name, age, breed) {
    // Call parent constructor using super()
    super(name, age);
    this.breed = breed;
  }

  // Method overriding - replaces parent's makeSound method
  makeSound() {
    return "Woof!";
  }

  // New method specific to Dog class
  fetch() {
    return `${this.name} is fetching the ball!`;
  }
}

// 3. Abstract Class (using a base class with abstract methods)
class Shape {
  constructor() {
    if (this.constructor === Shape) {
      throw new Error("Abstract class cannot be instantiated");
    }
    this.color = "black";
  }

  // Abstract method (to be implemented by subclasses)
  calculateArea() {
    throw new Error("Method calculateArea() must be implemented");
  }
}

// 4. Interface-like behavior using mixins
const Swimmable = {
  swim() {
    return `${this.name} is swimming!`;
  },
};

// 5. Composition - using mixins
class Duck extends Animal {
  constructor(name, age) {
    super(name, age);
    // Mix in the Swimmable behavior
    Object.assign(this, Swimmable);
  }

  makeSound() {
    return "Quack!";
  }
}

// 6. Encapsulation using closures
function createCounter() {
  let count = 0;
  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    },
  };
}

// Example usage and demonstration
function demonstrateOOP() {
  // Creating instances
  const dog = new Dog("Rex", 3, "German Shepherd");
  const duck = new Duck("Donald", 2);
  const counter = createCounter();

  // Demonstrating inheritance and method overriding
  console.log(dog.makeSound()); // Output: Woof!
  console.log(dog.fetch()); // Output: Rex is fetching the ball!

  // Demonstrating mixins
  console.log(duck.swim()); // Output: Donald is swimming!

  // Demonstrating encapsulation
  console.log(counter.increment()); // Output: 1
  console.log(counter.increment()); // Output: 2
  console.log(counter.getCount()); // Output: 2

  // Demonstrating getters and setters
  dog.name = "Max";
  console.log(dog.name); // Output: Max

  // Demonstrating static methods
  const babyDog = Dog.createBaby("Puppy");
  console.log(babyDog.age); // Output: 0
}

// Run the demonstration
demonstrateOOP();

// Demonstrate private field access attempts
function demonstratePrivateFieldAccess() {
  const animal = new Animal("Rex", 5);

  // This will work - using the getter
  console.log("Accessing through getter:", animal.name);

  // These will fail - trying to access private fields directly
  try {
    console.log("Direct access attempt 1:", animal.#name); // Syntax Error
  } catch (error) {
    console.log("Error 1:", error.message);
  }

  try {
    console.log("Direct access attempt 2:", animal["#name"]); // Syntax Error
  } catch (error) {
    console.log("Error 2:", error.message);
  }

  // This will also fail - trying to modify private field directly
  try {
    // this will crash intentionally to show the error
    animal.#age = 10; // Syntax Error
  } catch (error) {
    console.log("Error 3:", error.message);
  }
}

// Run the private field access demonstration
demonstratePrivateFieldAccess();

// =============================================
// OOP Pillars and Their Implementation
// =============================================

/*
1. ENCAPSULATION
   - Bundling data (properties) and methods that operate on that data within a single unit (class)
   - Implementation examples:
     a. Private fields (#name, #age) in Animal class
     b. Getters and setters for controlled access to private properties
     c. Closure-based encapsulation in createCounter function
     d. Private state management through methods
*/

/*
2. INHERITANCE
   - Mechanism that allows a class to inherit properties and methods from another class
   - Implementation examples:
     a. Dog and Duck classes extending Animal class
     b. Use of super() to call parent constructor
     c. Inheritance of properties (name, age) and methods (makeSound)
     d. Ability to override inherited methods (makeSound in Dog and Duck)
*/

/*
3. POLYMORPHISM
   - Ability of objects to take multiple forms
   - Implementation examples:
     a. Method overriding: makeSound() behaves differently in Animal, Dog, and Duck
     b. Same method name (makeSound) but different implementations
     c. Objects of different classes (Dog, Duck) can be treated as their parent type (Animal)
     d. Dynamic method resolution based on object type
*/

/*
4. ABSTRACTION
   - Hiding complex implementation details and showing only necessary features
   - Implementation examples:
     a. Abstract Shape class that cannot be instantiated
     b. Private fields hiding internal state
     c. Public interface through getters/setters
     d. Mixin pattern (Swimmable) abstracting behavior
*/

/*
5. COMPOSITION
   - Building complex objects by combining simpler ones
   - Implementation examples:
     a. Duck class combining Animal inheritance with Swimmable mixin
     b. Object.assign for mixing behaviors
     c. createCounter function composing methods and state
     d. Combining multiple behaviors in a single class
*/

/*
Additional OOP Concepts we have gone over in the example code above:
1. Static Methods
   - Methods that belong to the class itself, not instances
   - Example: createBaby static method in Animal class

2. Mixins
   - Way to reuse code in multiple classes
   - Example: Swimmable mixin used in Duck class

3. Method Overriding
   - Subclass providing specific implementation of parent method
   - Example: makeSound method in Dog and Duck classes

4. Private Fields
   - Properties that can only be accessed within the class
   - Example: #name and #age in Animal class

5. Getters and Setters
   - Controlled access to private properties
   - Example: name getter/setter in Animal class
*/
