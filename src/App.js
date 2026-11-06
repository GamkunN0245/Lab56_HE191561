import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './page/Login';
import SubjectList from './page/SubjectList';
// import QuestionPage từ trang quản lý câu hỏi của bạn (nếu có)

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        {/* Trang danh sách môn học hỗ trợ cả /subject và /subjects */}
        <Route path="/subject" element={<SubjectList />} />
        <Route path="/subjects" element={<SubjectList />} />

        {/* Route truy cập bộ câu hỏi theo id */}
        {/* <Route path="/questions/:id" element={<QuestionPage />} /> */}

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </Router>
  );
}

export default App;