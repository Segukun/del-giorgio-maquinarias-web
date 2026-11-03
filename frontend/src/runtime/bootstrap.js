import { reportRuntimeError } from "./errors.js";

export async function bootstrap({ loadApp, render, showError }) {
  let stage = "bootstrap.import-app";
  try {
    const { default: App } = await loadApp();
    stage = "bootstrap.render-react";
    render(App);
    return true;
  } catch (error) {
    reportRuntimeError(stage, error);
    showError();
    return false;
  }
}
