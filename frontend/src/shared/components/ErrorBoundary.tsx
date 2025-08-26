import { Component, type ReactNode } from 'react';
import { notifications } from '../notify';
import { logger } from '../logger';

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { hasError: boolean };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    logger.error('UI ErrorBoundary', error);
    notifications.error('Une erreur inattendue est survenue.');
  }

  render() {
    if (this.state.hasError) return this.props.fallback ?? <div>Oups, une erreur est survenue.</div>;
    return this.props.children;
  }
}
