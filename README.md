<!-- prettier-ignore -->
| In MarkDown      | HTML Translation          | Result                   | Comments |
| ------           | ------                    | --------                 | -------- |
|  **_2^3^_**      |    `2<sup>3</sup>`        |     2<sup>3</sup>  |   -      |
|   **_\todo One_** | `<input type="checkbox" id="todo-component-1.1" name="todo-component-1.1" value="One"><label for="One">One</label><br>`    | Generate a checkbox with label | If its a new  todo list a div for store all the checkboxes and labels will be generated
**_-- Text_** | `&mdash; Text` | &mdash; Text | Em dash
|**_CALLOUTS_**||| For making a jumpline use !<good\|bad\|warning> without any space after, they work pretty the same as quotes, it's not posible to put a callout of different type inside of one in process||
|**_!good\|!bad\|!warning_** |||If it's a new or first one callout it will generate the callout div , if not and its just the continuation of the callout it will be consider as a jumpline,**if it's empty**, dont use space after if no words are used after, **IF THE CALLOUT IT'S GOOD THE COLOR OF THE CALLOUT WILL BE GREEN, IF THE CALLOUT IT'S BAD IT WILL BE RED, IF THE CALLOUT IT'S WARNING IT WILL BE YELLOW**|
|**_!goodTitle\|!badTitle\|!warningTitle(space)\<Text\>_** |||This is used to put an h3 inside of the callout and use it as a title once or more than once, it will work also if its anew callout as a creator of a callout and also adding the title inside already|
|**_!\<type\>(space)\<Text\>_** |||This will be consider as text and also if this is the first one of a new callout it will create also the callout|
|**_!goodHr\|!badHr\|!warningHr_** |`</hr> (with respective color)`||For using divisions inside the callout, this one dont create the callout for the logical reason of not starting a callout with a division|
|**_SPOILERS_**||| In the case of spoilers it will be easier because there will be only needed the $ symbol, in order to create a spoiler section it will work similar to the quotes and callouts the only difference it's that to start the creation it must **ALWAYS** start with $title(space)\<Text\>||
|**_$title\<Text\>_** |`<details"><summary>(Text)</summary>"`||This will create two things, the div that contains the whole spoiler and the "title" or what it's always visible for the user|
|**_$_** |||Jumpline|
|**_$\<Text\>_** |`(if it's first one after $title)<div class="spoiler-body"><p>(Text)</p>(if it's not)<p>(Text)</p>`||Adds text to the spoiler, if one of this type it's the first to appear after $title \<Text\> it creates the spoiler body and also adds the text|
|**_BLOCKS OF CODE_**|\`\`\`javascript<br />document.getElementById("demo").innerHTML = "Hello JavaScript";<br/>\`\`\`<br/>(without space)<br />\`\`\`java<br />System.out.println("Hello Java");<br/>\`\`\` ||The only requirement for using blocks of code it's that if you want to have a block with tabs with different languages dont put spaces between the blocks, that will make the engine create that multi tab block, if they have spaces between it will be considered as a single block, to better understand it take a look to the example to the left of this text|

## NOTES

While writting the documentation the index.md in the "root" of the folder to process in the engine will be always the default page , it can be used for example as a landing page or as a list will all the content listed and with the respective links to the file like in the Rust Tutorial, but it will always search for the title "index" or "Index" in the root to treat it as a default page
