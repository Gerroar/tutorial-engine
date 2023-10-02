import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
  import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
  import { faAngleRight } from "@fortawesome/free-solid-svg-icons";
  import { pages } from "../App";
  export default function index({setCurrentPageIndex}:{setCurrentPageIndex: any}){
    
    let pageIndex: number = 0;
    let backComponentName: string = "";
    let nextComponentName: string = "Chapter1index";
    const handleLinkClick = (option: string) => {

      for (let i = 0; i < pages.length; i++) {
        const element = pages[i];
        switch (option) {
          case "back":
            
            if (element.name === backComponentName) {
              pageIndex = i;
            }
            break;
          case "next":
            
            if (element.name === nextComponentName) {

              pageIndex = i;
            }
            break;
        }
      }
      setCurrentPageIndex(pageIndex);
    }
  return(<><div id="page-content" className="pl-40 pr-40">
<h1>Tutorial Engine</h1><hr/>

Something a little like <a href="https://doc.rust-lang.org/book/" target="_blank">https://doc.rust-lang.org/book/</a>

<h2>Light and Dark theme?</h2><hr/>

<h2>Syntax Highlight</h2><hr/>


<h2>Auto Output</h2><hr/>

<pre>
mist whoami
</pre>
<pre>["gr@mist-cloud.eu"]
</pre>


<h3>Besides that</h3>

<h2>Tabs Have Memory</h2><hr/>

<a href="file2.ts" target="_blank">file2.ts</a>
<pre>
Other ts
</pre>
<a href="file2.java" target="_blank">file2.java</a>
<pre>
Other java
</pre>

<h2>Various</h2><hr/>

<div className="warning"><h3>Callout</h3>

<p>fdsfdsfdsfdsfgdsgfdsgfdsgfsgfsgfsgrftrrvfsgrwgfdsgfwrwgfdgrwgrwegrwgrwgrwegrwegrwwwerrgewwwwwwwrgergwerr</p>

<hr/>
<p>text</p>
</div>

<blockquote><p> Quotes</p>

<p> de</p>

<p> &mdash; Hello</p>

<p> &mdash; <i>Socrates</i></p>

<p> <b>testing gr</b></p>

<p>Isosceles</p>
</blockquote>


<p>Em &mdash; dash</p>

<p>Line <i>Hello</i> of <i>Goodbye</i></p>

2<sup>3</sup><br/>

<p>Text formatting <i>italics</i> and <b>bold gfdfd dsad s</b>.</p>

<p>Spoiler</p>
<details><summary>Spoiler Title One</summary>

<p className="mt-2 mb-2">Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Et malesuada fames ac turpis egestas maecenas pharetra convallis posuere. Nunc pulvinar sapien et ligula. Id cursus metus aliquam eleifend mi in nulla posuere. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Ultricies mi quis hendrerit dolor magna eget. Mauris ultrices eros in cursus turpis massa. Dui accumsan sit amet nulla. Nunc eget lorem dolor sed viverra ipsum nunc aliquet. Duis tristique sollicitudin nibh sit amet commodo nulla. Eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque. Magna ac placerat vestibulum lectus. Curabitur vitae nunc sed velit dignissim sodales ut eu sem. Enim eu turpis egestas pretium aenean pharetra. Interdum velit euismod in pellentesque massa placerat duis ultricies. Sodales ut eu sem integer vitae justo eget. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Mauris in aliquam sem fringilla ut. Diam vel quam elementum pulvinar etiam non quam lacus.</p>

<p className="mt-2 mb-2">fdsfdsfdsfdsfgdsgfdsgfdsgfsgfsgfsgrftrrvfsgrwgfdsgfwrwgfdgrwgrwegrwgrwgrwegrwegrwwwerrgewwwwwwwrgergwerr</p>

<p className="mt-2 mb-2">Duis tristique sollicitudin nibh sit amet commodo nulla. Eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum. Nulla posuere sollicitudin aliquam ultrices sagittis orci a scelerisque. Magna ac placerat vestibulum lectus. Curabitur vitae nunc sed velit dignissim sodales ut eu sem. Enim eu turpis egestas pretium aenean pharetra. Interdum velit euismod in pellentesque massa placerat duis ultricies. Sodales ut eu sem integer vitae justo eget. Libero nunc consequat interdum varius sit amet mattis vulputate enim. Mauris in aliquam sem fringilla ut. Diam vel quam elementum pulvinar etiam non quam lacus.</p>
</details><details><summary>Spoiler Title Two</summary>

</details>

<ol id="ol-0" className="list-decimal list-inside"><li>Hello</li>
<ol className="list-decimal list-inside"><li>Bye</li>
<li>dfs</li>
</ol><li>there,</li>
<li>Sailor</li>
</ol><br/>
<p>Unordered list</p>
<ul id="ul-0" className="list-disc list-inside"><li>What is up</li>
  <ul className="list-disc list-inside"><li>Nested</li>
    <ul className="list-disc list-inside"><li>Deeply</li>
      <ul className="list-disc list-inside"><li>In your hearth</li>
        <ul className="list-disc list-inside"><li>Hello</li>
</ul></ul></ul></ul></ul><br/>
<p>Test with starting tab</p>
<ul id="ul-1" className="list-disc list-inside"><li>Test</li>
</ul><br/>
<p>More tests</p>
<ul id="ul-2" className="list-disc list-inside"><li>a</li>
<li>b</li>
<li>c</li>
</ul><br/>
<p>Test of going back in nested lists</p>
<ul id="ul-3" className="list-disc list-inside"><li>a</li>
<li>b</li>
  <ul className="list-disc list-inside"><li>c</li>
    <ul className="list-disc list-inside"><li>d</li>
  </ul><li>e</li>
</ul></ul><br/>
<p>List with tab</p>
<ul id="ul-4" className="list-disc list-inside"><li>Hi</li>
</ul><br/><h1>Good news everyone</h1><hr/>

<p>More tests</p>
<ul id="ul-5" className="list-disc list-inside"><li>This</li>
  <ul className="list-disc list-inside"><li>Is</li>
</ul><li>A</li>
  <ul className="list-disc list-inside"><li>Nested</li>
    <ul className="list-disc list-inside"><li>List</li>
      <ul className="list-disc list-inside"><li>okay</li>
</ul></ul></ul></ul><br/>
<p>Todo list</p>
<div id="todo-1"><div className="flex items-center mt-2 mb-2"><input type="checkbox" id="todo-component-1.1" name="todo-component-1.1" value="One" className="mr-2" /><label htmlFor="todo-component-1.1">One</label><br/></div>
<div className="flex items-center mt-2 mb-2"><input type="checkbox" id="todo-component-1.2" name="todo-component-1.2" value="Two" className="mr-2" /><label htmlFor="todo-component-1.2">Two</label><br/></div>
<div className="flex items-center mt-2 mb-2"><input type="checkbox" id="todo-component-1.3" name="todo-component-1.3" value="Three" className="mr-2" /><label htmlFor="todo-component-1.3">Three</label><br/></div>
</div><br/>
<p>Spoiler, collapsable section</p>

Links <a href="https://doc.rust-lang.org/book/#the-rust-programming-language">to other places</a>

<h2>Menu and Navigation</h2><hr/>
<p>Menu on the side</p>
<p>Menu is hidable</p>
<p>Next button</p>
<p>Prev button</p>


</div><div className="nav-wrapper flex" aria-label="Page Navigation"><div ></div><div className="flex-initial w-1/2"></div><div className="nav-back flex-none" rel="next" title="Next Chapter" aria-label="Next Chapter" aria-keyshortcuts="Right" onClick={() => handleLinkClick("next")}><FontAwesomeIcon icon={faAngleRight} size="2x" color="gray"/></div></div>



</>)}