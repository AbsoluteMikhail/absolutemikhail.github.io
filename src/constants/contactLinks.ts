export const encodedContactLinks = {
  telegram: "aHR0cHM6Ly90Lm1lL0Fic29sdXRlTWlraGFpbA==",
  max: "aHR0cHM6Ly9tYXgucnUvdS9mOUxIb2REMGNPSVUweExZVjdTbjdXSmN0TDBHMWY0TEdnLVFDV29RTWE0SGhTbVFUV28zdmw3UWQxaw==",
  discordProfile:
    "aHR0cHM6Ly9kaXNjb3JkLmNvbS91c2Vycy8yMzkzMzkwNjk2NjkxMTM4NTc=",
  email: "bWFpbHRvOnJ1YWdlQHZrLmNvbQ==",
} as const;

export const encodedDiscordUsername = "YWJzb2x1dGVtaWtoYWls";

export const decodeContactLink = (encodedLink: string) =>
  window.atob(encodedLink);
