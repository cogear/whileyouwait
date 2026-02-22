import { Octokit } from "octokit"

let _octokit: Octokit

function getOctokit(): Octokit {
  if (!_octokit) {
    _octokit = new Octokit({ auth: process.env.GITHUB_TOKEN! })
  }
  return _octokit
}

const ORG = "cogear"
const REPO_PREFIX = "wuw-"

export function repoName(slug: string): string {
  return `${REPO_PREFIX}${slug}`
}

export function repoFullName(slug: string): string {
  return `${ORG}/${repoName(slug)}`
}

export async function ensureRepo(
  slug: string,
  description: string
): Promise<{ created: boolean }> {
  const octokit = getOctokit()
  const name = repoName(slug)

  try {
    await octokit.rest.repos.get({ owner: ORG, repo: name })
    return { created: false }
  } catch (e: unknown) {
    if ((e as { status?: number }).status !== 404) throw e
  }

  await octokit.rest.repos.createInOrg({
    org: ORG,
    name,
    description,
    private: false,
    auto_init: true,
  })

  return { created: true }
}

export async function pushFile(
  slug: string,
  path: string,
  content: string,
  commitMessage: string
): Promise<void> {
  const octokit = getOctokit()
  const owner = ORG
  const repo = repoName(slug)

  let sha: string | undefined
  try {
    const { data } = await octokit.rest.repos.getContent({ owner, repo, path })
    if (!Array.isArray(data) && data.type === "file") {
      sha = data.sha
    }
  } catch (e: unknown) {
    if ((e as { status?: number }).status !== 404) throw e
  }

  await octokit.rest.repos.createOrUpdateFileContents({
    owner,
    repo,
    path,
    message: commitMessage,
    content: Buffer.from(content, "utf-8").toString("base64"),
    sha,
  })
}
