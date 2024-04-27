import React from 'react';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
      super(props);
      this.state = { hasError: false };
    }
  
    static getDerivedStateFromError(error) {
      // Update state so the next render will show the fallback UI.
      return { hasError: true };
    }
  
    componentDidCatch(error, errorInfo) {
      // You can also log the error to an error reporting service
    //   logErrorToMyService(error, errorInfo);
      console.log(error);
      console.log(errorInfo);
    }
  
    render() {
      if (this.state.hasError) {
        // You can render any custom fallback UI
        return <h1>Oops! Something went wrong. Please try again or go back.</h1>;
      }
  
      return this.props.children; 
    }
  }