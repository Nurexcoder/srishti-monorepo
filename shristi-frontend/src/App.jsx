import { BrowserRouter, Routes, Route } from "react-router-dom";

import { About, Contact, Experience, Feedbacks, Hero, Navbar, Tech, Works, StarsCanvas, Contact2, Navbar2, Events ,Footer} from "./components";



const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route index element={ <div className='relative z-0 '>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
          <Hero />
        </div>
        <About />

        <Experience />

        <Works />
        <Feedbacks />
        <Footer />
        <StarsCanvas />
        
      </div>} />


        <Route path="/login" element={<div className='relative z-0 '>
          <Navbar2 />
          <div className='relative z-0'>
            <Contact />
            <StarsCanvas />
          </div>
        </div>} />


        <Route path="/register" element={<div className='relative'>
          <Navbar2 />
          <div className='relative z-0'>
            <Contact2 />
            <StarsCanvas />
          </div>
        </div>} />

        <Route path="/events" element={<div className='relative z-0 '>
        <div className='bg-hero-pattern bg-cover bg-no-repeat bg-center'>
          <Navbar />
         
        </div>
           
            <StarsCanvas />
            <Events />
          
        </div>} />






      </Routes>
    </BrowserRouter>
  );
}

export default App;
