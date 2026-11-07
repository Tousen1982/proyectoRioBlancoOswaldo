import path from "node:path";
import express from "express";
import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

function requireEnvironmentVariable(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta configurar la variable de entorno ${name}.`);
  }
  return value;
}

const projectEndpoint = requireEnvironmentVariable("FOUNDRY_PROJECT_ENDPOINT");
const agentName = requireEnvironmentVariable("FOUNDRY_AGENT_NAME");
const projectClient = new AIProjectClient(projectEndpoint, new DefaultAzureCredential());
const openai = projectClient.getOpenAIClient();
const agentRef = {
  body: {
    agent_reference: {
      name: agentName,
      type: "agent_reference",
    },
  },
};

const app = express();
const publicDirectory = path.join(import.meta.dirname, "public");
const port = Number(process.env.PORT || 3000);

if (!Number.isInteger(port) || port < 0 || port > 65535) {
  throw new Error("La variable PORT debe ser un puerto válido.");
}

app.use(express.json({ limit: "16kb" }));
app.use(express.static(publicDirectory));

app.get("/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.post("/api/chat", async (request, response) => {
  const { message, conversation_id: conversationId } = request.body ?? {};

  if (
    typeof message !== "string" ||
    message.trim().length === 0 ||
    message.length > 2000
  ) {
    return response.status(422).json({
      error: "El mensaje debe tener entre 1 y 2000 caracteres.",
    });
  }

  if (
    conversationId !== undefined &&
    conversationId !== null &&
    conversationId !== "" &&
    (typeof conversationId !== "string" || conversationId.length > 255)
  ) {
    return response.status(422).json({ error: "La conversación no es válida." });
  }

  try {
    const conversation =
      typeof conversationId === "string" && conversationId.length > 0
        ? { id: conversationId }
        : await openai.conversations.create();

    const result = await openai.responses.create(
      {
        conversation: conversation.id,
        input: message.trim(),
      },
      agentRef,
    );

    if (typeof result.output_text !== "string" || result.output_text.length === 0) {
      throw new Error("Foundry devolvió una respuesta vacía.");
    }

    return response.json({
      message: result.output_text,
      conversation_id: conversation.id,
    });
  } catch {
    console.error("La solicitud a Microsoft Foundry no pudo completarse.");
    return response.status(502).json({
      error: "No fue posible obtener una respuesta en este momento.",
    });
  }
});

app.use((error, _request, response, next) => {
  if (error?.type === "entity.parse.failed") {
    return response.status(400).json({ error: "El cuerpo de la solicitud no es válido." });
  }
  if (error?.type === "entity.too.large") {
    return response.status(413).json({ error: "La solicitud es demasiado grande." });
  }
  return next(error);
});

app.listen(port, () => {
  console.log(`Servidor iniciado en el puerto ${port}.`);
});
