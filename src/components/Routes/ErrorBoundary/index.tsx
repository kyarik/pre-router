import React, { Component, ErrorInfo, ReactNode } from 'react';
import { ErrorFallbackWrapper } from '../ErrorFallbackWrapper';

interface Props {
  children: ReactNode;
  onError: (error: Error, errorInfo: ErrorInfo) => void;
}

interface State {
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.state = {
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.props.onError(error, errorInfo);
  }

  resetError = () => {
    this.setState({ error: null });
  };

  render() {
    const { children } = this.props;
    const { error } = this.state;

    if (error) {
      return <ErrorFallbackWrapper error={error} resetError={this.resetError} />;
    }

    return children;
  }
}
