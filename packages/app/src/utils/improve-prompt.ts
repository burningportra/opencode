import type { useSDK } from "@/context/sdk"
import type { useSync } from "@/context/sync"
import { Identifier } from "@/utils/id"

const META_PROMPT = `You are a prompt engineering expert following Andrej Karpathy's philosophy for effective prompts.

Improve the following prompt to be more effective by:
1. Making it specific and detailed
2. Adding structure and clear steps
3. Specifying expected output format
4. Including constraints and edge cases
5. Removing ambiguity
6. Adding verification criteria

Return ONLY the improved prompt text, no explanations or commentary.

Original prompt:
`

type Model = { providerID: string; modelID: string }

export async function improvePrompt(
  sdk: ReturnType<typeof useSDK>,
  sync: ReturnType<typeof useSync>,
  original: string,
  model: Model,
  agent: string,
): Promise<string> {
  const session = await sdk.client.session
    .create()
    .then((x) => x.data)
    .catch(() => undefined)

  if (!session) return original

  const messageID = Identifier.ascending("message")
  const content = META_PROMPT + original

  await sdk.client.session
    .prompt({
      sessionID: session.id,
      agent,
      model,
      messageID,
      parts: [
        {
          id: Identifier.ascending("part"),
          type: "text",
          text: content,
        },
      ],
    })
    .catch(() => undefined)

  const response = await waitForResponse(sync, session.id, 30000).catch(() => undefined)

  return response ?? original
}

async function waitForResponse(sync: ReturnType<typeof useSync>, sessionID: string, timeout: number): Promise<string> {
  const start = Date.now()

  const poll = (): Promise<string> => {
    const messages = sync.data.message[sessionID] ?? []
    const assistant = messages.find((m) => m.role === "assistant")

    if (assistant) {
      const parts = sync.data.part[assistant.id] ?? []
      const text = parts
        .filter((p) => p.type === "text")
        .map((p) => ("text" in p ? p.text : ""))
        .join("")

      if (text) return Promise.resolve(text)
    }

    if (Date.now() - start > timeout) {
      return Promise.reject(new Error("timeout"))
    }

    return new Promise((resolve) => setTimeout(resolve, 500)).then(poll)
  }

  return poll()
}
