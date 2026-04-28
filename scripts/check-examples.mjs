import { readdirSync } from "node:fs"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

const circuits = readdirSync("circuits")
  .filter((name) => name.endsWith(".circuit.tsx"))
  .sort()

for (const circuit of circuits) {
  const file = join("circuits", circuit)
  const result = spawnSync("bunx", ["tsci", "check", "placement", file], {
    encoding: "utf8",
  })
  if (result.stdout) process.stdout.write(result.stdout)
  if (result.stderr) process.stderr.write(result.stderr)
  if (result.status !== 0) process.exit(result.status ?? 1)

  const errorCounts = [...(result.stdout ?? "").matchAll(/placement drc:\s*[\s\S]*?Errors: (\d+)/g)]
    .map((match) => Number(match[1]))
  const drcErrorCount = errorCounts.reduce((sum, count) => sum + count, 0)
  if (drcErrorCount > 0) {
    console.error(`${file}: placement DRC reported ${drcErrorCount} error(s).`)
    process.exit(1)
  }
}
