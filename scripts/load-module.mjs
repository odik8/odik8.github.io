import { Buffer } from "node:buffer";
import { build } from "esbuild";

/**
 * Импорт TypeScript-модуля из обычного скрипта Node.
 *
 * Словари текстов лежат в .ts, а node их не исполняет. esbuild собирает модуль
 * вместе с зависимостями в память, и результат импортируется data-адресом —
 * так у генератора картинок и у сайта один источник текстов.
 */
export async function loadModule(entry) {
  const result = await build({
    entryPoints: [entry],
    bundle: true,
    format: "esm",
    platform: "neutral",
    write: false,
  });

  const [output] = result.outputFiles;
  if (!output) throw new Error(`Не удалось собрать ${entry}`);

  const encoded = Buffer.from(output.text).toString("base64");
  return import(`data:text/javascript;base64,${encoded}`);
}
