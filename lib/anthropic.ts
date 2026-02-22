import Anthropic from "@anthropic-ai/sdk"

let _anthropic: Anthropic

export function getAnthropic(): Anthropic {
  if (!_anthropic) {
    _anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY!,
    })
  }
  return _anthropic
}
