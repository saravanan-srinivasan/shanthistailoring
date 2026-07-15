import 'dotenv/config';
import { POST } from './src/app/api/chat/route.ts';

async function run() {
  const req = new Request('http://localhost:3000/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      messages: [{ role: 'user', content: 'hello' }]
    })
  });
  
  try {
    const res = await POST(req);
    console.log("Status:", res.status);
    console.log("Response:", await res.json());
  } catch(e) {
    console.error("Error executing POST:", e);
  }
}

run();
