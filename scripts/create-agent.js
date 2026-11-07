import { AIProjectClient } from "@azure/ai-projects";
import { DefaultAzureCredential } from "@azure/identity";

const agentInstructions =
  "Eres el asistente corporativo de Distribuidora Río Claro. Responde en español, de forma clara y profesional, sobre políticas, facturación, productos y procedimientos internos. No inventes datos; si no cuentas con información suficiente, dilo y pide contexto.";

function requireEnvironmentVariable(name) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta configurar la variable de entorno ${name}.`);
  }
  return value;
}

async function createAgent() {
  const projectEndpoint = requireEnvironmentVariable("FOUNDRY_PROJECT_ENDPOINT");
  const agentName = requireEnvironmentVariable("FOUNDRY_AGENT_NAME");
  const modelDeploymentName = requireEnvironmentVariable(
    "FOUNDRY_MODEL_DEPLOYMENT_NAME",
  );
  const project = new AIProjectClient(projectEndpoint, new DefaultAzureCredential());
  const agent = await project.agents.createVersion(agentName, {
    kind: "prompt",
    model: modelDeploymentName,
    instructions: agentInstructions,
  });

  console.log(`Agente "${agent.name}" creado; versión ${agent.version}.`);
}

createAgent().catch((error) => {
  const isMissingConfiguration =
    error instanceof Error &&
    error.message.startsWith("Falta configurar la variable de entorno ");
  if (isMissingConfiguration) {
    console.error(error.message);
  } else {
    console.error(
      "No se pudo crear el agente. Verifica el endpoint, los permisos y el despliegue de modelo configurado.",
    );
  }
  if (error instanceof Error && !isMissingConfiguration) {
    console.error(`Tipo de error: ${error.name}.`);
  }
  process.exitCode = 1;
});
