"use client"

import { Box, Typography } from "@mui/material"
import { SyntaxHighlighter } from "../code/syntax-highlighter.jsx"
import { useTheme } from "../../hooks/use-theme"

export function MessageFormatter({ content }) {
  const { theme } = useTheme()

  const formatMessageContent = (content) => {
    // Split content by code blocks and inline code
    const parts = content.split(/(```[\s\S]*?```|`[^`]+`|\*\*[^*]+\*\*)/g)

    return parts.map((part, index) => {
      // Code blocks
      if (part.startsWith("```") && part.endsWith("```")) {
        const codeContent = part.slice(3, -3).trim()
        const lines = codeContent.split("\n")
        const language = lines[0].toLowerCase()
        const code = lines.slice(1).join("\n") || codeContent

        // Check if first line is a language identifier
        const knownLanguages = ["javascript", "jsx", "python", "java", "cpp", "html", "css", "sql", "bash"]
        const detectedLang = knownLanguages.includes(language) ? language : "javascript"
        const actualCode = knownLanguages.includes(language) ? code : codeContent

        return <SyntaxHighlighter key={index} code={actualCode} language={detectedLang} />
      }

      // Inline code
      else if (part.startsWith("`") && part.endsWith("`")) {
        const code = part.slice(1, -1)
        return (
          <Box
            key={index}
            component="code"
            sx={{
              bgcolor: "rgba(39, 40, 34, 0.9)",
              border: `1px solid ${theme.BORDER_COLOR}`,
              borderRadius: "4px",
              px: 1,
              py: 0.5,
              fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
              fontSize: "13px",
              boxShadow: "inset 0 1px 3px rgba(0, 0, 0, 0.3)",
              color: "#e6db74",
            }}
          >
            {code}
          </Box>
        )
      }

      // Bold text
      else if (part.startsWith("**") && part.endsWith("**")) {
        const boldText = part.slice(2, -2)
        return (
          <Box
            key={index}
            component="strong"
            sx={{
              fontWeight: 700,
              color: theme.AURORA_PRIMARY,
              textShadow: `0 0 10px ${theme.AURORA_PRIMARY}50`,
            }}
          >
            {boldText}
          </Box>
        )
      }

      // Regular text - split by paragraphs
      else {
        return part.split("\n\n").map(
          (paragraph, pIndex) =>
            paragraph.trim() && (
              <Typography
                key={`${index}-${pIndex}`}
                component="p"
                sx={{
                  margin: 0,
                  mb: 2,
                  "&:last-child": {
                    mb: 0,
                  },
                }}
              >
                {paragraph.trim()}
              </Typography>
            ),
        )
      }
    })
  }

  return (
    <Box
      sx={{
        color: theme.TEXT_PRIMARY,
        lineHeight: 1.7,
        fontSize: "15px",
      }}
    >
      {formatMessageContent(content)}
    </Box>
  )
}
