import React from 'react';

/**
 * ErrorBoundary Component
 * Catches JavaScript errors anywhere in child component tree,
 * logs the error details, and renders a fallback UI instead of crashing to a blank screen.
 */
export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("React Component Crash Caught by ErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
    if (this.props.onReset) {
      this.props.onReset();
    }
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="bg-rose-50 border border-rose-200 text-rose-900 p-8 rounded-lg shadow-blueprint space-y-4 max-w-2xl mx-auto my-8">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-rose-500 text-white flex items-center justify-center font-bold">
              <span className="material-symbols-outlined text-xl">warning</span>
            </div>
            <div>
              <h3 className="font-heading font-extrabold text-lg text-rose-900">
                {this.props.title || "Component Rendering Error"}
              </h3>
              <p className="text-xs text-rose-700 font-mono">
                A JavaScript runtime exception occurred while rendering this module.
              </p>
            </div>
          </div>

          <div className="p-4 bg-white rounded border border-rose-200 text-xs font-mono overflow-x-auto space-y-2">
            <div className="font-bold text-rose-800">
              {this.state.error?.toString() || "Unknown Error"}
            </div>
            {this.state.errorInfo?.componentStack && (
              <pre className="text-[10px] text-navy-600 leading-tight">
                {this.state.errorInfo.componentStack}
              </pre>
            )}
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              onClick={this.handleReset}
              className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-mono text-xs font-bold rounded shadow transition"
            >
              Reset Component State
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
