import './index.css';
import { MenuButton } from './components/MenuButton/MenuButton';
import StartingPage from "./output/index";

export default function App() {

  return (
    <>
      <MenuButton />
      <div id="page-wrap" className='pl-80 pr-20'>
        <StartingPage />
      </div>
    </>
  )
}