"use strict";
// TypeScript Rev
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var message = "Welcome Back!";
console.log(message);
// Static Type Checking  & Accurate intellisense
var isBeginner = true;
var total = 0;
var name = "Vibhav";
var sentence = "My name is " + name + "\nI am a beginner in Typescript";
console.log(sentence);
// Array Declaration 2 Types :
var list1 = [1, 2, 3];
var list2 = [1, 2, 3]; // Array of same data types
// To store multiple datatypes in array we have Tuple
var person1 = ["Chris", 22]; // The size of the tuple must be fixed
// ANy type in typescript
var randomValue = 10;
randomValue = "Vibhav";
randomValue = true;
// any type doesn't restrict the usage of the defined variable
// Thus in order to work with that typescript proposed `unknow` type Eg. :
var myvariable = 10;
// console.log(myvariable.name)        // This will show error but not with `any` type
myvariable.toUpperCase; // Typecasting
// We can assign multiple types to the given variable
var multitype;
multitype = 20;
multitype = true;
// Lets see types using functions
function add(num1, num2) {
    return num1 + num2;
}
add(5, 10);
// Optional and Default Parameters
function add_1(num1, num2) {
    return num1 + num2;
}
add_1(5);
var logDetails = function (uid, item) {
    console.log(item + " +  " + uid);
};
// Function Signature :
var greet;
greet = function (name, greeting) {
    console.log(name + " + " + greeting);
};
function fullName(person) {
    console.log(person.firstName + " " + person.lastName);
}
var p = {
    firstName: "Bruce",
    lastName: "Wayne"
};
fullName(p);
// Classes
var Invoice = /** @class */ (function () {
    function Invoice(
    // We can declare and initialise the variables inside the constructor using access modifiers
    client, details, amnt) {
        this.client = client;
        this.details = details;
        this.amnt = amnt;
    }
    Invoice.prototype.format = function () {
        return this.client + " + " + this.details + " + " + this.amnt;
    };
    return Invoice;
}());
var fst_inv = new Invoice("Bruce", "You have to pay hard", 1000);
var scnd_inv = new Invoice("Tony", "You have to pay", 2000);
var Employee = /** @class */ (function () {
    function Employee(name) {
        this.name = name;
    }
    Employee.prototype.greet = function () {
        console.log("Welcome " + name);
    };
    return Employee;
}());
var s1 = new Employee("Vibhav");
s1.greet();
var Manager = /** @class */ (function (_super) {
    __extends(Manager, _super);
    function Manager(manager_name) {
        return _super.call(this, manager_name) || this;
    }
    Manager.prototype.delegate_work = function () {
        console.log("Manager delegating tasks");
    };
    return Manager;
}(Employee));
var m1 = new Manager("Vikram");
m1.delegate_work();
m1.greet();
