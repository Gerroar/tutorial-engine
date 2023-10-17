import './index.css';
import { MenuButton } from './components/MenuButton/MenuButton';
import { Routes, Route, } from "react-router-dom";
import ErrorPage from "./ErrorPage";
import { useState } from "react";
import Chapter1index from "./output/chapter1/index";
import Chrfile from "./output/chapter1/section 1/chr/file";
import LayerTestlayertest from "./output/chapter1/section 1/chr/Layer Test/layertest";
import Section2file2 from "./output/chapter1/section 2/file2";
import Section1file from "./output/chapter2/section 1/file";
import Index from "./output/index";
import Other from "./output/other";
export default function App() {
    const [selectedTab, setSelectedTab] = useState("Java")
    return (
      <>
        <MenuButton />
        <div id="page-wrap" className="ml-64 2xl:ml-0 pr-20 max-w-[1280px]">
          <Routes>
            <Route path="/" element={<Index selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>} />  
       <Route path="/chapter1/index" element={<Chapter1index selectedTab={selectedTab} setSelectedTab={setSelectedTab} />} />
<Route path="/chapter1/section1/chr/file" element={<Chrfile selectedTab={selectedTab} setSelectedTab={setSelectedTab} />} />
<Route path="/chapter1/section1/chr/LayerTest/layertest" element={<LayerTestlayertest selectedTab={selectedTab} setSelectedTab={setSelectedTab} />} />
<Route path="/chapter1/section2/file2" element={<Section2file2 selectedTab={selectedTab} setSelectedTab={setSelectedTab} />} />
<Route path="/chapter2/section1/file" element={<Section1file selectedTab={selectedTab} setSelectedTab={setSelectedTab} />} />
<Route path="/other" element={<Other selectedTab={selectedTab} setSelectedTab={setSelectedTab}/>} />
</Routes></div></>)};
