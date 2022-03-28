// @refresh reload
import "./tailwind.css";
import { Links, Meta, Routes, Scripts } from "solid-start/components";

export default function Root() {
  return (
    <html lang="en_CA">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <title>The wedding of Jocelyn Veevers and Alan Rempel</title>
        <meta name="robots" content="noindex,noarchive" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,300;0,400;0,500;0,700;1,400&display=swap" rel="stylesheet" />
        <Meta />
        <Links />
      </head>
      <body class="px-4 sm:px-8 py-8 font-spectral">
        <Routes />
        <Scripts />
      </body>
    </html>
  );
}
