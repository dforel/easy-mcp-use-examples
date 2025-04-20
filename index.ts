import { MCPClient } from 'easy-mcp-use';
import { MCPAgent, MCPAgentOptions } from 'easy-mcp-use';
import { ChatOpenAI } from '@langchain/openai';
import dotenv from 'dotenv';
dotenv.config();
 

const openAIApiKey = process.env.openRouteApiKey; 

if (!openAIApiKey) {
  throw new Error("openAIApiKey environment variable is not set");
}
console.log(`openAIApiKey: ${openAIApiKey}`);

async function main() {
    

  let config = {"mcpServers": {"http": {"url": "http://localhost:3001/sse"}}}
  // 从配置文件创建客户端
  const client = MCPClient.fromConfig( config );

  try { 
    const chat = new ChatOpenAI(
      {
        modelName: 'google/gemini-2.0-flash-exp:free', 
        // modelName: 'google/gemini-2.5-pro-exp-03-25:free', 
        streaming: true,
        openAIApiKey: openAIApiKey,
        configuration: {
          baseURL: 'https://openrouter.ai/api/v1',  
        }
      }
    );
    let options = {
      client: client,
      // verbose: true,
      maxSteps: 30, 
      llm:  chat,
    }
    let agent = new MCPAgent(options)

    let result = agent.run(
      `
       当前100人民币可以兑换多少美元？
      ` 
    );

     console.log( JSON.stringify(result) );
  } finally {
    // console.info('finally');
  }
}

main().catch(console.error);