import { Component } from "react";
import { reportRuntimeError } from "../runtime/errors.js";

export default class RuntimeErrorBoundary extends Component {
  state = { failed: false };

  static getDerivedStateFromError() { return { failed: true }; }

  componentDidCatch(error) { reportRuntimeError(this.props.stage, error); }

  render() {
    if (this.state.failed) {
      return (
        <main style={{ maxWidth: 640, margin: "10vh auto", padding: "2rem", fontFamily: "sans-serif" }}>
          <h1>{this.props.title || "No pudimos cargar esta página"}</h1>
          <p>Intentá recargar la página. Si el problema continúa, volvé a intentarlo más tarde.</p>
          <a href="/">Ir al inicio</a>
        </main>
      );
    }
    return this.props.children;
  }
}
