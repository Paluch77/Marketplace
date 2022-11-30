import Home from './Home'
import SignUp from './SignUp'
import NewProduct from './New Product/NewProduct';
import { BrowserRouter, Route, Routes } from "react-router-dom";


function App() {
  return (
    <BrowserRouter>
    <div className="font-redHat font-normal not-italic">
    <Routes>
      <Route path="/home" element={<Home/>}/>
      <Route path="/signup" element={<SignUp/>}/>
      <Route path="/new_product" element={<NewProduct/>}/>
    </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
