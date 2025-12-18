import { getPaged, scrapFinancial } from "@/services/scraping/title.ts";

let running = false;

export async function GET() {
  if (running) {
    return new Response('data: {"error":"running"}\n\n', {
      headers: sseHeaders,
    });
  }

  running = true;

  let processed = 0;
  let success = 0;
  let failed = 0;

  const encoder = new TextEncoder();
  const limit = 50;
  let offset = 0;

  const stream = new ReadableStream({
    start(controller) {
      const send = () => {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({ processed, success, failed })}\n\n`,
          ),
        );
      };

      (async () => {
        const BATCH_SIZE = 100; // parallel workers — adjust for speed vs stability

        while (true) {
          const ids = await getPaged(offset, limit);
          if (ids.length === 0) break;

          offset += limit;

          for (let i = 0; i < ids.length; i += BATCH_SIZE) {
            const chunk = ids.slice(i, i + BATCH_SIZE);

            // Run batch in parallel
            const results = await Promise.all(
              chunk.map(async (id) => {
                try {
                  const ok = await scrapFinancial(id);
                  return ok ? "success" : "failed";
                } catch {
                  return "failed";
                }
              }),
            );

            // Track results
            for (const r of results) {
              processed++;
              r === "success" ? success++ : failed++;
              send();
            }

            await new Promise((r) => setTimeout(r, 20)); // reduce DB spikes
          }
        }
      })();
    },
    cancel() {
      running = false;
    },
  });

  return new Response(stream, { headers: sseHeaders });
}

const sseHeaders = {
  "Content-Type": "text/event-stream",
  "Cache-Control": "no-cache, no-transform",
  Connection: "keep-alive",
};
