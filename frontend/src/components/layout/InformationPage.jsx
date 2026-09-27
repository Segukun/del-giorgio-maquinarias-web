import { useEffect } from "react";
import "../../styles/pages/information.css";

export default function InformationPage({ title, introduction, updated = false, children }) {
  useEffect(() => {
    const previousTitle = document.title;
    document.title = `${title} | Del Giorgio Maquinarias`;
    return () => { document.title = previousTitle; };
  }, [title]);

  return (
    <div className="dg-information">
      <header className="dg-information__heading">
        <h1>{title}</h1>
        <p className="dg-information__intro">{introduction}</p>
        {updated && <p className="dg-information__updated">Última actualización: septiembre de 2026</p>}
      </header>
      <div className="dg-information__body">{children}</div>
    </div>
  );
}
