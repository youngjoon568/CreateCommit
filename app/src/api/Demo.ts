"use server";

import { LLM } from "llama-node";
import { LLamaCpp } from './../../node_modules/llama-node/src/llm/llama-cpp';

const llama = new LLM(LLamaCpp);

const Demo = async (msg: string): Promise<string> => {
    await llama.load({
        modelPath: "/app/model/airoboros-13b-gpt4.ggmlv3.q4_0.bin",
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
