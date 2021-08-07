# HEX
Hexadecimal -- also known as hex or base 16 -- is a system we can use to write and share numerical values. In that way it's no different than the most famous of numeral systems (the one we use every day): decimal. Decimal is a base 10 number system (perfect for beings with 10 fingers), and it uses a collection of 10 unique digits, which can be combined to positionally represent numbers.

Hex, like decimal, combines a set of digits to create large numbers. It just so happens that hex uses a set of 16 unique digits. Hex uses the standard 0-9, but it also incorporates six digits you wouldn't usually expect to see creating numbers: A, B, C, D, E, and F.

There are many (infinite!) other numeral systems out there. Binary (base 2) is also popular in the engineering world, because it's the language of computers. The base 2, binary, system uses just two digit values (0 and 1) to represent numbers.

Hex, along with decimal and binary, is one of the most commonly encountered numeral systems in the world of electronics and programming. It's important to understand how hex works, because, in many cases, it makes more sense to represent a number in base 16 than with binary or decimal.

## How to Convert Hex to Text ?

Convert hex ASCII code to text:

* Get hex byte
* Convert hex byte to decimal
* Get character of ASCII code from ![ASCII table](https://upload.wikimedia.org/wikipedia/commons/1/1b/ASCII-Table-wide.svg)
* Continue with next byte<br>

Example :
  Convert "50 6C 61 6E 74 20 74 72 65 65 73" hex ASCII code to text:

  Use ASCII table to get character from ASCII code.

  5016 = 5×161+0×160 = 80+0 = 80 => "P"

  6C16 = 6×161+12×160 = 96+12 = 108 => "l"

  6116 = 6×161+1×160 = 96+1 = 97 => "a"

  ⁝

  For all the hex bytes you should get the text:

  *"Plant trees"*<br><br>
  
  ----------------------------------------
  
  **NOTE** : - Characters (often) represented in ASCII 
  * 1 byte/char = 2 hex digits/char
  ----------------------------------------
  
  ## Identifiers

* '0x'	0x47DE	This prefix shows up a lot in UNIX and C-based programming languages (like Arduino!).<br>
* '#'	#FF7734	Color references in HTML and image editting programs.<br>
* '%'	%20	Often used in URLs to express characters like "Space" (%20).
* '\x'	\x0A	Often used to express character control codes like "Backspace" (\x08), "Escape" (\x1B), and "Line Feed" (\x0A).
* '&#x'	&#x3A9	Used in HTML, XML, and XHTML to express unicode characters (e.g. &#x3A9; prints an Ω).
* '0h'	0h5E	A prefix used by many programmable graphic calculators (e.g. TI-89).

## References :

* [Crypto Essentials: What is a bit, a byte, and a hex string?](https://www.youtube.com/watch?v=QYWtwZyAnC8&t=1s)
* [Hex and ASCII](https://www.youtube.com/watch?v=WW2SaCMnHdU&t=235s)
* [Hexadecimal to Binary Encoder](https://www.youtube.com/watch?v=6R-ZC8rLqm8)
* [Dec ----> Hex](https://www.youtube.com/watch?v=QJW6qnfhC70&t=944s)

