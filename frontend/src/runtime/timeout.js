export async function withTimeout(task, milliseconds = 12000) {
  let timer;
  try {
    return await Promise.race([
      Promise.resolve().then(task),
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error("Se agotó el tiempo de espera del servicio.")), milliseconds);
      }),
    ]);
  } finally { clearTimeout(timer); }
}
