# Tutorial Engine

Something a little like https://doc.rust-lang.org/book/

## Light and Dark theme?

## Syntax Highlight

## Auto Output

```sh
mist whoami
```

[output]

### Besides that

## Tabs Have Memory

file2.ts

```typescript
document.getElementById("demo").innerHTML = "Hello JavaScript";
```

file2.java

```java
class GFG {
      // main function
    public static void main(String[] args)
    {
        // Declare the variables
        int num;

        // Input the integer
        System.out.println("Enter the integer: ");

        // Create Scanner object
        Scanner s = new Scanner(System.in);

        // Read the next integer from the screen
        num = s.nextInt();

        // Display the integer
        System.out.println("Entered integer is: "
                           + num);
    }
}
```
```typescript
alert("whatever");
```
```javascript
alert("whatever");
```


```java
class GFG {
      // main function
    public static void main(String[] args)
    {
        System.out.println("Another thing");
    }
}
```
```typescript
alert("Another thing");
```
```rust
fn main() {
    // Statements here are executed when the compiled binary is called.

    // Print text to the console.
    println!("Hello World!");
}
```
```go
package funding

type Fund struct {
    // balance is unexported (private), because it's lowercase
    balance int
}

// A regular function returning a pointer to a fund
func NewFund(initialBalance int) *Fund {
    // We can return a pointer to a new struct without worrying about
    // whether it's on the stack or heap: Go figures that out for us.
    return &Fund{
        balance: initialBalance,
    }
}

// Methods start with a *receiver*, in this case a Fund pointer
func (f *Fund) Balance() int {
    return f.balance
}

func (f *Fund) Withdraw(amount int) {
    f.balance -= amount
}
```
```javascript
alert("Another thing");
```

## Various

!warningTitle Callout
!bad text
!warning fdsfdsfdsfdsfgdsgfdsgfdsgfsgfsgfsgrftrrvfsgrwgfdsgfwrwgfdgrwgrwegrwgrwgrwegrwegrwwwerrgewwwwwwwrgergwerr
!warning
!warningHr
!warning text

> Quotes
>
> de
>
> -- Hello
>
> -- _Socrates_
>
> **testing gr**
>
> Isosceles

Em -- dash

Line _Hello_ of _Goodbye_

2^3^

Text formatting _italics_ and **bold gfdfd dsad s**.

Spoiler
$title Spoiler Title One
$
$ Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et malesuada fames ac turpis egestas maecenas pharetra convallis posuere. Nunc pulvinar sapien et ligula. Id cursus metus aliquam eleifend mi in nulla posuere. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Ultricies mi quis hendrerit dolor magna eget. Mauris ultrices eros in cursus turpis massa. Dui accumsan sit amet nulla. Nunc eget lorem dolor sed viverra ipsum nunc aliquet. Duis tristique sollicitudin nibh sit amet commodo nulla. Eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque. Magna ac placerat vestibulum lectus. Curabitur vitae nunc sed velit dignissim sodales ut eu sem. Enim eu turpis egestas pretium aenean pharetra. Interdum velit euismod in pellentesque massa placerat duis ultricies. Sodales ut eu sem integer vitae justo eget. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Mauris in aliquam sem fringilla ut. Diam vel quam elementum pulvinar etiam non quam lacus.
$
$ fdsfdsfdsfdsfgdsgfdsgfdsgfsgfsgfsgrftrrvfsgrwgfdsgfwrwgfdgrwgrwegrwgrwgrwegrwegrwwwerrgewwwwwwwrgergwerr
$
$ Duis tristique sollicitudin nibh sit amet commodo nulla. Eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque. Magna ac placerat vestibulum lectus. Curabitur vitae nunc sed velit dignissim sodales ut eu sem. Enim eu turpis egestas pretium aenean pharetra. Interdum velit euismod in pellentesque massa placerat duis ultricies. Sodales ut eu sem integer vitae justo eget. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Mauris in aliquam sem fringilla ut. Diam vel quam elementum pulvinar etiam non quam lacus.
$title Spoiler Title Two
$

1. Hello
   1. Bye
   1. dfs
1. there,
1. Sailor

Unordered list

- What is up
  - Nested
    - Deeply
      - In your hearth
        - Hello

Test with starting tab

- Test

More tests

- a
- b
- c

Test of going back in nested lists

- a
- b
  - c
    - d
  - e

List with tab

- Hi

# Good news everyone

More tests

- This
  - Is
- A
  - Nested
    - List
      - okay

Todo list
\todo One
\todo Two
\todo Three

Spoiler, collapsable section

Links [to other places](https://doc.rust-lang.org/book/#the-rust-programming-language)

## Menu and Navigation

Menu on the side
Menu is hidable
Next button
Prev button

[next](chapter1/index.md)
