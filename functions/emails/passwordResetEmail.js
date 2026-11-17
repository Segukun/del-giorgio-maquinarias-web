
const LOGO_URL =
  "https://www.delgiorgiomaquinarias.com.ar/brand/dg-logo.png";

const escapeHtml = (value) =>
  String(value).replace(/[&<>"']/g, (character) => {
    const entities = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });

const passwordResetEmail = (resetUrl) => {
  const safeUrl = escapeHtml(resetUrl);

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Restablecer contraseña</title>
</head>

<body style="
  margin: 0;
  padding: 35px 12px;
  background-color: #f3f3f3;
  font-family: Arial, Helvetica, sans-serif;
  color: #292929;
">

  <table
    role="presentation"
    width="100%"
    cellspacing="0"
    cellpadding="0"
    border="0"
  >
    <tr>
      <td align="center">

        <table
          role="presentation"
          width="100%"
          cellspacing="0"
          cellpadding="0"
          border="0"
          style="
            max-width: 570px;
            background-color: #ffffff;
            border-radius: 12px;
            overflow: hidden;
          "
        >

          <!-- LOGO CON FONDO BORDÓ -->
          <tr>
            <td
              align="center"
              bgcolor="#731212"
              style="
                padding: 32px 24px;
                background-color: #731212;
              "
            >
              <img
                src="${LOGO_URL}"
                alt="Del Giorgio Maquinarias"
                width="145"
                style="
                  display: block;
                  width: 145px;
                  max-width: 100%;
                  height: auto;
                  border: 0;
                  margin: 0 auto;
                "
              />
            </td>
          </tr>

          <!-- CONTENIDO -->
          <tr>
            <td style="padding: 35px 32px 20px;">

              <h1 style="
                margin: 0 0 20px;
                color: #731212;
                font-size: 23px;
                line-height: 1.3;
                text-align: center;
                font-weight: 700;
              ">
                Restablecé tu contraseña
              </h1>

              <p style="
                margin: 0 0 16px;
                font-size: 15px;
                line-height: 1.7;
                color: #444444;
              ">
                Hola,
              </p>

              <p style="
                margin: 0 0 16px;
                font-size: 15px;
                line-height: 1.7;
                color: #444444;
              ">
                Recibimos una solicitud para restablecer la contraseña
                de tu cuenta.
              </p>

              <p style="
                margin: 0 0 26px;
                font-size: 15px;
                line-height: 1.7;
                color: #444444;
              ">
                Para establecer una nueva contraseña, utilizá el
                siguiente botón:
              </p>

              <!-- BOTÓN -->
              <table
                role="presentation"
                cellspacing="0"
                cellpadding="0"
                border="0"
                align="center"
                style="margin: 0 auto 28px;"
              >
                <tr>
                  <td
                    align="center"
                    bgcolor="#8d1717"
                    style="border-radius: 7px;"
                  >
                    <a
                      href="${safeUrl}"
                      target="_blank"
                      style="
                        display: inline-block;
                        padding: 15px 30px;
                        color: #ffffff;
                        font-size: 14px;
                        font-weight: 700;
                        text-decoration: none;
                        border-radius: 7px;
                      "
                    >
                      Restablecer contraseña
                    </a>
                  </td>
                </tr>
              </table>

              <p style="
                margin: 0 0 12px;
                font-size: 13px;
                line-height: 1.6;
                color: #777777;
              ">
                Si el botón no funciona, copiá y pegá este enlace
                en tu navegador:
              </p>

              <p style="
                margin: 0 0 24px;
                padding: 12px;
                background-color: #f6f6f6;
                border-radius: 6px;
                font-size: 12px;
                line-height: 1.6;
                word-break: break-all;
                color: #731212;
              ">
                <a
                  href="${safeUrl}"
                  style="color: #731212; text-decoration: underline;"
                >
                  ${safeUrl}
                </a>
              </p>

              <p style="
                margin: 0 0 15px;
                font-size: 13px;
                line-height: 1.6;
                color: #777777;
              ">
                Este enlace es personal y solamente puede utilizarse
                una vez.
              </p>

              <p style="
                margin: 0;
                font-size: 13px;
                line-height: 1.6;
                color: #777777;
              ">
                Si no solicitaste este cambio, podés ignorar este
                mensaje. Tu contraseña seguirá siendo la misma.
              </p>

            </td>
          </tr>

          <!-- SEPARADOR INFERIOR -->
          <tr>
            <td style="padding: 26px 32px 30px;">
              <div style="
                height: 3px;
                width: 48px;
                margin: 0 auto;
                background-color: #8d1717;
                border-radius: 5px;
              "></div>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>`;
};

module.exports = passwordResetEmail;
