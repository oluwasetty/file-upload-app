import Header from './components/layouts/header';
import Footer from './components/layouts/footer';
import Home from './pages/Home';
import ErrorBoundary from './components/utils/error-boundary';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// App component
function App(props) {
  return (
    <div className="App">
      {/* Error boundary component */}
      <ErrorBoundary>
        {/* Header component */}
        <Header />
        {/* Home component */}
        <Home />
        {/* Footer component */}
        <Footer />
        <ToastContainer />
      </ErrorBoundary>
    </div>
  );
}

export default App;
