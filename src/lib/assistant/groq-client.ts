/**
 * London's Imports - Groq Multi-Model Fallback Client
 */

export async function fetchGroqChat(
    groqApiKey: string,
    params: {
        messages: any[];
        tools?: any[];
        tool_choice?: string;
        temperature?: number;
        max_tokens?: number;
    },
    timeoutMs = 8000
) {
    const candidateModels = ['openai/gpt-oss-120b', 'openai/gpt-oss-20b', 'qwen/qwen3.8-27b'];
    for (const model of candidateModels) {
        try {
            const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${groqApiKey}`,
                    'Content-Type': 'application/json',
                    'User-Agent': 'Mozilla/5.0'
                },
                signal: AbortSignal.timeout(timeoutMs),
                body: JSON.stringify({
                    model,
                    ...params
                }),
            });
            if (res.ok) {
                return await res.json();
            }
            console.warn(`[Groq] Model ${model} returned status ${res.status}`);
        } catch (err) {
            console.warn(`[Groq] Model ${model} failed:`, err);
        }
    }
    return null;
}
