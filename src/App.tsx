import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './layout/Layout';
import AppRoutes from './router/AppRoutes';
import { AuthProvider } from './comp/AuthProvider';




const App: React.FC = () => {
  

  return (
    <Router>
    <AuthProvider>
        <Layout>
          <AppRoutes />
        </Layout>
    </AuthProvider>
    </Router>
  );
};

export default App;