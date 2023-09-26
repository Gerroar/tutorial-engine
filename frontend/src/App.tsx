import './index.css';
import { arrDirectories } from './output/directoriesList';
import { MenuButton } from './components/MenuButton/MenuButton';
import { lazy, Suspense, useState } from 'react';

const Chapter1index = lazy(() => import("./output/chapter1/index"));
const Chrfile = lazy(() => import("./output/chapter1/section 1/chr/file"));
const LayerTestlayertest = lazy(() => import("./output/chapter1/section 1/chr/Layer Test/layertest"));
const Section2file2 = lazy(() => import("./output/chapter1/section 2/file2"));
const Section1file = lazy(() => import("./output/chapter2/section 1/file"));
const Index = lazy(() => import("./output/index"));
const pages = [
    { component: Chapter1index },
    { component: Chrfile },
    { component: LayerTestlayertest },
    { component: Section2file2 },
    { component: Section1file },
    { component: Index },
];
export default function App() {

    //new
    const [currentPageIndex, setCurrentPageIndex] = useState(pages.length - 1);

    const renderPage = () => {

        const Page = pages[currentPageIndex].component;
        return <Page />
    }


    //new
    return (
        <>
            <MenuButton />
            <div id="page-wrap" className='pl-80 pr-20'>
                <Suspense fallback={<div>Loading...</div>}>
                    {renderPage()}
                </Suspense>
            </div>
        </>
    )
}