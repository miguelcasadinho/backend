import OpenAI from 'openai'; // Importa a biblioteca OpenAI
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

config({ path: resolve(dirname(fileURLToPath(import.meta.url)), '../.env') });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});

/**
 * Função assíncrona para obter uma resposta do ChatGPT.
 * @param {string} prompt - O texto de entrada que você quer enviar ao ChatGPT.
 * @returns {Promise<string>} - A resposta gerada pelo ChatGPT.
 */
async function getChatGPTResponse(prompt) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo", // ou "gpt-4" se você tiver acesso
      messages: [{ role: "user", content: prompt }],
    });
    
    console.log(response.choices[0].message.content); // Para depuração
    return response.choices[0].message.content; // Retorna a resposta do modelo
  } catch (error) {
    console.error("Erro ao obter resposta do ChatGPT:", error);
    throw error; // Lança o erro para que possa ser tratado em outro lugar, se necessário
  }
}

// Exemplo de uso da função
getChatGPTResponse("Como posso implementar uma função para inverter uma string?")
  .then(response => console.log("Resposta do ChatGPT:", response))
  .catch(error => console.error("Erro:", error));