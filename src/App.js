
import './App.css';
import React from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import Home from './Pages/Home';
import TopicWiseCSE from "./Pages/TopicWiseCSE";
import SubjectWiseCSE from "./Pages/SubjectWiseCSE";
import YearWiseCSE from "./Pages/YearWiseCSE";
import TopicWiseETC from "./Pages/TopicWiseETC";
import SubjectWiseETC from "./Pages/SubjectWiseETC";
import YearWiseETC from "./Pages/YearWiseETC";
import QuestionsPage from './Pages/QuestionsPage';
import Navbar from './Components/Navbar';
import QuestionUpload from './Pages/QuestionUpload';
import StudentRegister from './Pages/StudentRegister';
import ProfileCompletion from './Pages/ProfileCompletion';
import StudentLogin from './Pages/StudentLogin';
import Bookmark from './Pages/Bookmark';
import RandomQuestion from './Pages/RandomQuestion';
import UserProfile from './Pages/UserProfile';
import ManualTestSetup from './Pages/ManualTestSetup';
import ManualTestOptions from './Pages/ManualTestOptions';
import StartTest from './Pages/StartTest';
import EditQuestion from './Pages/EditQuestion';
import Admin from './Pages/Admin';


function App() {
  const location = useLocation();
  // Define routes where Navbar should be hidden
  const hideNavbarRoutes = ["/StudentRegister", "/studentlogin"];
  return (
    <>
      {/* Render Navbar only if the current route is NOT in the hideNavbarRoutes list */}
      {!hideNavbarRoutes.includes(location.pathname) && <Navbar />}
      
      <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/questions" element={<QuestionsPage />} />
      <Route path='/bookmark' element={<Bookmark />} />
      <Route path='/UserProfile' element={<UserProfile />} />
      <Route path='/ManualTestSetup' element={<ManualTestSetup />} />
      <Route path='/EditQuestion' element={<EditQuestion />} />

      <Route path='/ManualTestOptions' element={<ManualTestOptions />} />
      <Route path='/StartTest' element={<StartTest />} />

      <Route path="/random-question" element={<RandomQuestion />} />

        {/* GATE CSE Pages */}
        <Route path="/gate-cse/topic-wise" element={<TopicWiseCSE />} />
        <Route path="/gate-cse/subject-wise" element={<SubjectWiseCSE />} />
        <Route path="/gate-cse/year-wise" element={<YearWiseCSE />} />
        <Route path="/yearwise" element={<YearWiseCSE />} />

        {/* GATE ETC Pages */}
        <Route path="/gate-etc/topic-wise" element={<TopicWiseETC />} />
        <Route path="/gate-etc/subject-wise" element={<SubjectWiseETC />} />
        <Route path="/gate-etc/year-wise" element={<YearWiseETC />} />

        <Route path="/upload-question" element={<QuestionUpload />} />
        
        {/* <Route path="/StudentRegister" element={<StudentRegister />} /> */}
        <Route path="/register" element={<StudentRegister />} />

        
        <Route path="/profile-completion" element={<ProfileCompletion />} />
        <Route path="/studentlogin" element={<StudentLogin />} />
        
        <Route path="/AdminAccess" element={<Admin />} />

      </Routes>
    </>
  );
}

export default App;