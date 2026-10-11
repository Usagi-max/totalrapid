import { Component } from 'react';

// A rendering error in one part of the page must not blank the whole page; show what happened instead.
export default class RenderErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  componentDidCatch(error, info) { console.error(`${this.props.label || 'Render'} error`, error, info?.componentStack); }
  componentDidUpdate(previous) { if (previous.resetKey !== this.props.resetKey && this.state.error) this.setState({ error: null }); }
  render() {
    if (!this.state.error) return this.props.children;
    return <section className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-5 text-xs text-rose-200">
      <p className="font-bold">{this.props.label || 'この部分'}を表示できませんでした。ページを再読み込みしてください。</p>
      <p className="mt-1 break-all">{String(this.state.error?.message || this.state.error)}</p>
      <pre className="mt-2 max-h-40 overflow-auto whitespace-pre-wrap text-[10px] text-rose-300/80">{String(this.state.error?.stack || '').split('\n').slice(0, 6).join('\n')}</pre>
    </section>;
  }
}
