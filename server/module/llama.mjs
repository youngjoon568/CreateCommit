import { LLM } from "llama-node";
import { LLamaCpp } from "llama-node/dist/llm/llama-cpp.js";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const llama = new LLM(LLamaCpp);

const Demo = async (msg) => {
    await llama.load({
        modelPath: path.join(__dirname, "models", "airoboros-7b-gpt4.ggmlv3.q4_1.bin"),
        embedding: false,
        nCtx: 1024,
        seed: 0,
        f16Kv: false,
        logitsAll: false,
        vocabOnly: false,
        useMlock: false,
        useMmap: true,
        nGpuLayers: 0,
        enableLogging: false,
    });

    const resultMessage = await new Promise<string>((resolve) => {
        llama.createCompletion({
            prompt: msg,
            nThreads: 4,
            nTokPredict: 2048,
            topK: 40,
            topP: 0.1,
            temp: 0.3,
            repeatPenalty: 1,
        }, (res) => {
            resolve(res.token);
        });
    });

    return resultMessage;
};

export default Demo;
