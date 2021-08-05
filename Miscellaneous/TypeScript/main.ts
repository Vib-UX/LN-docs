// TypeScript Rev  

export {}
let message = "Welcome Back!";
console.log(message);


// Static Type Checking  & Accurate intellisense 
let isBeginner: boolean = true;
let total: number =0;
let name: string =  'Vibhav';
let sentence: string = `My name is ${name}
I am a beginner in Typescript`;

console.log(sentence);

// Array Declaration 2 Types :
let list1 : number[] = [1,2,3];
let list2 : Array<number> = [1,2,3];        // Array of same data types 

// To store multiple datatypes in array we have Tuple 
let person1: [string,number] = ['Chris',22];                // The size of the tuple must be fixed


// ANy type in typescript
let randomValue : any =10;
randomValue = "Vibhav";
randomValue = true;

// any type doesn't restrict the usage of the defined variable

// Thus in order to work with that typescript proposed `unknow` type Eg. :
let myvariable : unknown = 10;

// console.log(myvariable.name)        // This will show error but not with `any` type
(myvariable as string).toUpperCase; // Typecasting 

// We can assign multiple types to the given variable
let multitype : number | boolean;
multitype = 20;
multitype = true;


// Lets see types using functions 
function add(num1 : number , num2 : number) : number /*(Return Type) */ { 
    return num1 + num2;
}

add(5,10);

// Optional and Default Parameters
function add_1(num1 : number , num2 ? /* Optional Parameter */ : number){
    return num1 +num2;
}

add_1(5);


// Interfaces
interface Person {
    firstName : string,
    lastName : string
}

function fullName(person : Person){
    console.log(`${person.firstName} ${person.lastName}`);
}

let p  = {
    firstName: 'Bruce',
    lastName: 'Wayne'
}

fullName(p);

// Classes

class Employee{
    name: string;
    constructor(name : string){
        this.name = name;
    }
    greet(){
        console.log(`Welcome ${name}`);
    }
}

let s1 : Employee = new Employee('Vibhav');
s1.greet();

class Manager extends Employee{
    constructor(manager_name : string){
        super(manager_name);
    }

    delegate_work(){
        console.log(`Manager delegating tasks`);
    }
}

let m1 : Manager = new Manager('Vikram');
m1.delegate_work();
m1.greet();

