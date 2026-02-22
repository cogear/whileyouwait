const VERCEL_API = "https://api.vercel.com"

function headers(): HeadersInit {
  return {
    Authorization: `Bearer ${process.env.VERCEL_TOKEN!}`,
    "Content-Type": "application/json",
  }
}

function teamParam(): string {
  const teamId = process.env.VERCEL_TEAM_ID
  return teamId ? `?teamId=${teamId}` : ""
}

export async function ensureVercelProject(
  projectName: string,
  githubRepoFullName: string
): Promise<{ projectId: string; url: string }> {
  const getRes = await fetch(
    `${VERCEL_API}/v9/projects/${projectName}${teamParam()}`,
    { headers: headers() }
  )

  if (getRes.ok) {
    const existing = await getRes.json()
    return {
      projectId: existing.id,
      url: `https://${projectName}.vercel.app`,
    }
  }

  if (getRes.status !== 404) {
    const errBody = await getRes.text()
    throw new Error(`Vercel API error: ${getRes.status} ${errBody}`)
  }

  const [owner, repo] = githubRepoFullName.split("/")
  const createRes = await fetch(
    `${VERCEL_API}/v10/projects${teamParam()}`,
    {
      method: "POST",
      headers: headers(),
      body: JSON.stringify({
        name: projectName,
        framework: null,
        gitRepository: {
          type: "github",
          repo: `${owner}/${repo}`,
        },
        buildCommand: "",
        outputDirectory: ".",
        installCommand: "",
      }),
    }
  )

  if (!createRes.ok) {
    const errBody = await createRes.text()
    throw new Error(`Vercel project creation failed: ${createRes.status} ${errBody}`)
  }

  const project = await createRes.json()
  return {
    projectId: project.id,
    url: `https://${projectName}.vercel.app`,
  }
}
