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
class ErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean; error: any }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, errorInfo: any) {
    // You can log error to an error reporting service here
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-red-50 text-red-700">
          <h1 className="text-3xl font-bold mb-4">Something went wrong.</h1>
          <pre className="bg-white p-4 rounded shadow text-left max-w-xl overflow-x-auto">{String(this.state.error)}</pre>
          <button className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded" onClick={() => window.location.reload()}>Reload</button>
        </div>
      );
    }
    return this.props.children;
  }
}

function App() {
  return (
    <BrowserRouter>
      <ErrorBoundary>
        <Provider store={store}>
          <Toaster position="top-right" />

          <AppContent />

        </Provider>
      </ErrorBoundary>
    </BrowserRouter>
  );
}

function AppContent() {
  const element = useRoutes(routes);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    const token = localStorage.getItem('token');
    console.log('App: Initializing, token present:', !!token);
    if (token) {
      console.log('App: Dispatching getCurrentUserAsync');
      dispatch(getCurrentUserAsync())
        .unwrap()
        .then(user => console.log('App: User loaded:', user))
        .catch(err => console.error('App: Failed to load user:', err));
    }
  }, [dispatch]);

  return element;
}

export default App;
