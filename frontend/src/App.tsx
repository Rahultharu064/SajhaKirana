import { Component, useEffect } from 'react';
import type { ReactNode } from 'react';
import { BrowserRouter, useRoutes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import routes from "./routes";

import { Provider, useDispatch } from 'react-redux';
import { store } from './Redux/store';
import type { AppDispatch } from './Redux/store';
import { getCurrentUserAsync } from './Redux/slices/authSlice';

// ErrorBoundary component
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: unknown }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: unknown) {
    return { hasError: true, error };
  }
  componentDidCatch(error: unknown, errorInfo: unknown) {
    // You can log error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-rose-50 text-rose-700 px-4">
          <h1 className="text-3xl font-black mb-4">Something went wrong.</h1>
          <pre className="bg-white p-4 rounded-xl shadow text-left max-w-xl overflow-x-auto text-sm">{String(this.state.error)}</pre>
          <button
            className="mt-6 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold transition-colors"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

import { ChatbotProvider } from './context/ChatbotContext';

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Provider store={store}>
          <ChatbotProvider>
            <Toaster
              position="top-right"
              toastOptions={{
                style: {
                  borderRadius: '16px',
                  background: '#0f172a',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '14px',
                },
                success: { iconTheme: { primary: '#10b981', secondary: '#fff' } },
                error: { iconTheme: { primary: '#f43f5e', secondary: '#fff' } },
              }}
            />

            <AppContent />
          </ChatbotProvider>
        </Provider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

import ChatFloatingButton from "./components/chatbot/ChatFloatingButton.tsx";

function AppContent() {
  const element = useRoutes(routes);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(getCurrentUserAsync())
        .unwrap()
        .catch(err => {
          // If token is invalid (401), clear it silently
          if (err?.response?.status === 401 || err?.message?.includes('401')) {
            localStorage.removeItem('token');
          }
          // Don't log errors for unauthenticated users
        });
    }
  }, [dispatch]);

  return (
    <>
      {element}
      <ChatFloatingButton />
    </>
  );
}

export default App;
