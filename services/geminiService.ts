
import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getGitExplanation(command: string) {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `请用中文通俗易懂地解释 Git 命令 "${command}"。重点描述数据是如何在“工作区”、“暂存区”、“本地仓库”和“远程仓库”之间流动的。字数控制在100字以内，语气要专业且亲切。`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "暂时无法获取 AI 详细解说，请先参考下方的基础说明。";
  }
}
