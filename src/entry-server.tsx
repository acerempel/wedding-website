import { renderToStringAsync } from "solid-js/web";
import { StartServer } from "solid-start/components";
import {Request, Response, Headers} from "undici";

export default async function({
  request,
  manifest,
  headers = new Headers(),
  context = {}
}: {
  request: Request;
  headers: Headers;
  manifest: Record<string, any>;
  context?: Record<string, any>;
}) {
  let markup = await renderToStringAsync(() => (
    <StartServer context={context} url={request.url} manifest={manifest} />
  ));

  headers.set("Content-Type", "text/html");

  return new Response(markup, {
    status: 200,
    headers,
  });
}
