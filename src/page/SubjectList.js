import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function SubjectList() {
  const [subjects, setSubjects] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      navigate('/login');
    }

    fetchData();
  }, [navigate]);

  const fetchData = async () => {
    try {
      // Lấy song song danh sách môn học và danh sách câu hỏi từ db.json
      const [subjRes, quesRes] = await Promise.all([
        axios.get('http://localhost:9000/subjects'),
        axios.get('http://localhost:9000/questions')
      ]);
      setSubjects(subjRes.data);
      setQuestions(quesRes.data);
    } catch (error) {
      console.error('Lỗi khi tải dữ liệu:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Lọc môn học theo Mã môn (id) hoặc Tên môn học (name)
  const filteredSubjects = subjects.filter((subj) => {
    const term = searchTerm.toLowerCase();
    return (
      subj.id.toLowerCase().includes(term) ||
      subj.name.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      
      {/* HEADER & USER INFORMATION */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '15px 20px',
        backgroundColor: '#f8f9fa',
        borderRadius: '8px',
        marginBottom: '25px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
      }}>
        {/* Banner theo cú pháp yêu cầu: Hello [Email] ([Role]) */}
        <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>
          Hello {currentUser?.email} ({currentUser?.role})
        </h3>

        {/* Nút Logout màu đỏ ở góc trên bên phải */}
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Logout
        </button>
      </div>

      <h2 style={{ marginBottom: '20px' }}>Danh sách môn học</h2>

      {/* SEARCH & FILTER */}
      <div style={{ marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Tìm kiếm theo mã môn hoặc tên môn học..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            padding: '10px 15px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '14px',
            boxSizing: 'border-box'
          }}
        />
      </div>

      {/* SUBJECT TABLE */}
      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: 'white',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        borderRadius: '8px',
        overflow: 'hidden'
      }}>
        <thead>
          <tr style={{ backgroundColor: '#007bff', color: 'white', textAlign: 'left' }}>
            <th style={{ padding: '12px 15px' }}>Mã Môn</th>
            <th style={{ padding: '12px 15px' }}>Tên Môn Học</th>
            <th style={{ padding: '12px 15px', textAlign: 'center' }}>Số lượng câu hỏi</th>
            <th style={{ padding: '12px 15px', textAlign: 'center' }}>Tools</th>
          </tr>
        </thead>
        <tbody>
          {filteredSubjects.length > 0 ? (
            filteredSubjects.map((subject) => {
              // Tự động tính số lượng câu hỏi dựa trên số lượng item trong mảng questions có subjectId khớp với subject.id
              const questionCount = questions.filter(q => q.subjectId === subject.id).length;
              
              return (
                <tr key={subject.id} style={{ borderBottom: '1px solid #dee2e6' }}>
                  <td style={{ padding: '12px 15px', fontWeight: 'bold' }}>{subject.id}</td>
                  <td style={{ padding: '12px 15px' }}>{subject.name}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>{questionCount}</td>
                  <td style={{ padding: '12px 15px', textAlign: 'center' }}>
                    {/* Nút truy cập bộ câu hỏi (màu xanh) */}
                    <button
                      onClick={() => navigate(`/questions/${subject.id}`)}
                      style={{
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginRight: '6px',
                        fontSize: '13px'
                      }}
                    >
                      Truy cập bộ câu hỏi
                    </button>

                    {/* Nút thông tin (màu xám) */}
                    <button
                      onClick={() => alert(`Thông tin môn học: ${subject.name} (Mã: ${subject.id})`)}
                      style={{
                        backgroundColor: '#6c757d',
                        color: 'white',
                        border: 'none',
                        padding: '6px 12px',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        fontSize: '13px'
                      }}
                    >
                      Thông tin
                    </button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="4" style={{ textAlign: 'center', padding: '20px', color: '#777' }}>
                Không tìm thấy môn học nào phù hợp.
              </td>
            </tr>
          )}
        </tbody>
      </table>

    </div>
  );
}