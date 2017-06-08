## geometries

"Geometries" is mainly a JavaScript project for writing a drawing compiler to generate complicated geometries. Inspired by [the project](https://github.com/aleen42/FuncDrawCompiler) written before with C Sharp, and UI rendered by WPF, I hope it can be also completed as a module in JavaScript. Furthermore, vector graphics can also be an awesome feature especially when a designer hopes to use programs to generate into what they are similar to.

During designing this tool, you may find that it has firstly made used with the knowledge of "Principles of Compiler (編譯原理)" to design a new language, which belongs to graphical programming languages. With this brief language, you can easily tell the machine how to draw your geometries by using some syntax like the following snippet:

```
ORIGIN IS (380,140);
SCALE IS (100,100);
FOR T FROM 0 TO 50*PI STEP 0.1 DRAW(COS(T)+1/1.3*COS(1.3*T), SIN(T)-1/1.3*SIN(1.3*T));
```

To parse and understand such a language, we have to create a system containing three main parts:
 
 - [x] Scanner (lexical analysis, 詞法分析)
 - [x] Parser (syntactic analysis, 語法分析)
 - [ ] Semantic (semantic analysis, 語義分析)
