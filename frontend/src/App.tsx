import './index.css';
import { MenuButton } from './components/MenuButton/MenuButton';
import { lazy, Suspense, useState } from 'react';

const Chapter1index = lazy(() => import("./output/chapter1/index"));
const Chrfile = lazy(() => import("./output/chapter1/section 1/chr/file"));
const LayerTestlayertest = lazy(() => import("./output/chapter1/section 1/chr/Layer Test/layertest"));
const Section2file2 = lazy(() => import("./output/chapter1/section 2/file2"));
const Section1file = lazy(() => import("./output/chapter2/section 1/file"));
const Index = lazy(() => import("./output/index"));
const Other = lazy(() => import("./output/other"));
export const pages = [ 
	{ component: Chapter1index, name: "Chapter1index"},
	{ component: Chrfile, name: "Chrfile"},
	{ component: LayerTestlayertest, name: "LayerTestlayertest"},
	{ component: Section2file2, name: "Section2file2"},
	{ component: Section1file, name: "Section1file"},
	{ component: Index, name: "Index"},
	{ component: Other, name: "Other"},
];
export default function App() {

    let defaultIndex: number = 0;
    for (let i = 0; i < pages.length; i++) {
      const element = pages[i];
      if (element.name === "Index") {
        defaultIndex = i;
      }
    }

    const [currentPageIndex, setCurrentPageIndex] = useState(defaultIndex);
    const renderPage = () => {

        const Page = pages[currentPageIndex].component;
        return <Page setCurrentPageIndex={setCurrentPageIndex} />
    }

    return (
        <>
            <MenuButton currentPageIndex={currentPageIndex} setCurrentPageIndex={setCurrentPageIndex} defaultIndex={defaultIndex} />
            <div id="page-wrap" className='pl-80 pr-20'>
                <Suspense fallback={<div>Loading...</div>}>
                    {renderPage()}
                </Suspense>
            </div>
        </>
    )
}