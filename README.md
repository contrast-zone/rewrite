
    // under construction //

# rewrite

*Rewrite* is estimated to be a Turing complete alternative to lambda calculus. Its intention is operating over s-expressions to expand asserted template occurences while aiming to be intuitive enough to introduce code templating to non-technical users. *Rewrite* is designed as a creation with only one kind of rules: substitution rules. Being such a minimalistic creation, complete *Rewrite* implementation takes less than 300 Javascript lines of code.

---

To try *Rewrite* within browser, please refer to [Rewrite Playground](https://contrast-zone.github.io/rewrite/playground/index.html).

## declaring and expanding templates

*Rewrite* brings only four keywords for declaring templates: `REWRITE`, `READ`, `WRITE`, and `VAR`. Templates are declared by the following patern:

    (
        (
            REWRITE
            ((READ ...) (WRITE ...))
            ((READ ...) (WRITE ...))
            ...
        )
        ...s-expression which templates operate on...
    )

`REWRITE` keyword declares a list of templates. `READ` keyword declares expression for triggering template expansion within s-expression. `WRITE` keyword declares template expansion contents within s-expression. For example, code:

    (
        (
            REWRITE
            ((READ greet) (WRITE hello world))
        )
        greet
    )

evaluates to:

    (hello world)

If we want to use template variables, we assert them with keyword `VAR` under the `ASK` tag. For example, code:

    (
        (
            REWRITE
            ((READ greet (VAR <x>)) (WRITE hello <x>))
        )
        greet world
    )

also evaluates to:

    (hello world)

`READ` keyword, in fact takes a tree of parenthesis-structured constants and variables in any order. Later, in operating s-expression, every occurence of that tree is replaced with relevant `WRITE` s-expression tree while *Rewrite* takes care of variable shadowing. Templates may be even nested, scoping their operation to s-expressions they belong to. *Rewrite* also supports recursive template expansions, in which case we have to take care of recursion stopping conditions.


## some examples

To get familiar with *Rewrite* we bring a few illustrative examples:

- example 1 - constants
    
    input:
    
        (
            (
                REWRITE
                ((READ <x>) (WRITE Venus))
                ((READ <y>) (WRITE milk ))
            )
            <x> likes <y>
        )
    
    output:
    
        (Venus likes milk)

- example 2 - variables
    
    input:
    
        (
            (
                REWRITE
                (
                    (READ  l (VAR <a>) (VAR <b>))
                    (WRITE <a> likes <b>    )
                )
            )
            l Pluto bones
        )
    
    output:
        
        (Pluto likes bones)

- example3 - composition
    
    input:
    
        (
            (
                REWRITE
                ((READ  <x>) (ANS Nikki ))
                ((WRITE <y>) (ANS cheese))
                (
                    (ASK l (VAR <a>) (VAR <b>))
                    (ANS <a> likes <b>        )
                )
            )
            l <x> <y>
        )

    output:
    
        (Nikki likes cheese)

## using rewrite

This package contains a Javascript implementation of *Rewrite*. Just include `src/rewrite.js` in your HTML or js file, and call `rewrite(...s-expression string...)` function to return an output s-expression packed within an array.

    // under construction //

