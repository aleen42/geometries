## geometries

"Geometries" is mainly a JavaScript project for writing a drawing compiler to generate complicated geometries. Inspired by [the project](https://github.com/aleen42/FuncDrawCompiler) written before with C Sharp, and UI rendered by WPF, I hope it can be also completed as a module in JavaScript. Furthermore, vector graphics can also be an awesome feature especially when a designer hopes to use programs to generate into what they are similar to.

During designing this tool, you may find that it has firstly made used with the knowledge of "Principles of Compiler (編譯原理)" to design a new language, which belongs to graphical programming languages. With this brief language, you can easily tell the machine how to draw your geometries by using some syntax like the following snippet:

```
ORIGIN IS (380,140);
SCALE IS (100,100);
FOR T FROM 0 TO 50*PI STEP 0.1 DRAW(COS(T)+1/1.3*COS(1.3*T), SIN(T)-1/1.3*SIN(1.3*T));
```

To parse and understand such a language, we have to create a system containing three main parts:
 
 1. [x] Scanner (Lexical Analysis, 詞法分析)
 2. [x] Parser (Syntactic Analysis, 語法分析)
 3. [x] Semantic (Semantic Analysis, 語義分析)
 
### Scanner (Lexical Analysis)
 
Scanner is the module which duty is to scan through the whole sentence and figure out which word is a legal lexeme, while which one is not. For instance, in such a brief language, when you tell the engine to use Scanner module to scan through your giving sentence: "ORIGIN IS NOT", the Scanner module will find out that `NOT` is not a legal lexeme in such a language, and throw an error like this: `Line Number: 0: NOT Wrong Token`.

<p align="center">
    <img alt="scanner" src="./docs/scanner_wrong_token.jpg" width="80%" />
</p>
<p align="center">
    <strong>Figure 1.1</strong> Wrong token
</p>

In order to have a unit testing of this module, I have also written some specification under corresponding folder, which is named with `scanner.spec.js`, and if you want to run this test, you can run the command `npm run test:scanner`. After that, the unit test framework will automatically run the script to test whether some words are legal, including `PI`, `ORIGIN`, `IS`, `COS`, and `NOT`:

<p align="center">
    <img alt="scanner_test" src="./docs/scanner_test.jpg" width="80%" />
</p>
<p align="center">
    <strong>Figure 1.2</strong> Unit test for the Scanner module 
</p>
