import { openRouter } from "../openrouter-client"

export type GenerateImageInput = {
  prompt: string
  model: string
}

export type GenerateImageOutput = {
  imageUrl: string
}

export const generateImageHandler = async (
  input: GenerateImageInput,
): Promise<GenerateImageOutput> => {
  if (!process.env.OPENROUTER_API_KEY) {
    throw new Error("Missing OPENROUTER_API_KEY")
  }

  const response = await openRouter.chat.send({
    model: input.model,
    messages: [
      {
        role: "user",
        content: `Generate an image and return only a direct URL to the final image.\n\nPrompt: ${input.prompt}`,
      },
    ],
    stream: false,
  })

  const choice = response.choices[0]
  const content = choice?.message.content

  if (!content || typeof content !== "string") {
    throw new Error("Model did not return an image URL")
  }

  return {
    imageUrl: content.trim(),
  }
}
