"use client"

import { Box } from "@mui/material"
import { MONOKAI_COLORS } from "../../constants/themes.js"

export function SyntaxHighlighter({ code, language = "javascript" }) {
  const highlightCode = (code, lang) => {
    // Simple syntax highlighting patterns
    const patterns = {
      javascript: [
        {
          pattern: /\b(function|const|let|var|if|else|for|while|return|class|import|export|from|async|await)\b/g,
          style: { color: MONOKAI_COLORS.KEYWORD },
        },
        { pattern: /\b(true|false|null|undefined)\b/g, style: { color: MONOKAI_COLORS.NUMBER } },
        { pattern: /\b\d+(\.\d+)?\b/g, style: { color: MONOKAI_COLORS.NUMBER } },
        { pattern: /"[^"]*"|'[^']*'|`[^`]*`/g, style: { color: MONOKAI_COLORS.STRING } },
        { pattern: /\/\/.*$/gm, style: { color: MONOKAI_COLORS.COMMENT, fontStyle: "italic" } },
        { pattern: /\/\*[\s\S]*?\*\//g, style: { color: MONOKAI_COLORS.COMMENT, fontStyle: "italic" } },
        { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, style: { color: MONOKAI_COLORS.CLASS } },
        { pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\()/g, style: { color: MONOKAI_COLORS.FUNCTION } },
      ],
      jsx: [
        {
          pattern: /\b(function|const|let|var|if|else|for|while|return|class|import|export|from|async|await)\b/g,
          style: { color: MONOKAI_COLORS.KEYWORD },
        },
        { pattern: /\b(true|false|null|undefined)\b/g, style: { color: MONOKAI_COLORS.NUMBER } },
        { pattern: /\b\d+(\.\d+)?\b/g, style: { color: MONOKAI_COLORS.NUMBER } },
        { pattern: /"[^"]*"|'[^']*'|`[^`]*`/g, style: { color: MONOKAI_COLORS.STRING } },
        { pattern: /\/\/.*$/gm, style: { color: MONOKAI_COLORS.COMMENT, fontStyle: "italic" } },
        { pattern: /<\/?[a-zA-Z][^>]*>/g, style: { color: MONOKAI_COLORS.CLASS } },
        { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, style: { color: MONOKAI_COLORS.CLASS } },
        { pattern: /\b[a-zA-Z_$][a-zA-Z0-9_$]*(?=\()/g, style: { color: MONOKAI_COLORS.FUNCTION } },
      ],
      python: [
        {
          pattern: /\b(def|class|if|elif|else|for|while|return|import|from|try|except|with|as|pass|break|continue)\b/g,
          style: { color: MONOKAI_COLORS.KEYWORD },
        },
        { pattern: /\b(True|False|None)\b/g, style: { color: MONOKAI_COLORS.NUMBER } },
        { pattern: /\b\d+(\.\d+)?\b/g, style: { color: MONOKAI_COLORS.NUMBER } },
        { pattern: /"[^"]*"|'[^']*'|"""[\s\S]*?"""|'''[\s\S]*?'''/g, style: { color: MONOKAI_COLORS.STRING } },
        { pattern: /#.*$/gm, style: { color: MONOKAI_COLORS.COMMENT, fontStyle: "italic" } },
        { pattern: /\b[A-Z][a-zA-Z0-9]*\b/g, style: { color: MONOKAI_COLORS.CLASS } },
        { pattern: /\bdef\s+([a-zA-Z_][a-zA-Z0-9_]*)/g, style: { color: MONOKAI_COLORS.FUNCTION } },
      ],
    }

    const langPatterns = patterns[lang] || patterns.javascript
    let highlightedCode = code

    // Apply syntax highlighting
    langPatterns.forEach(({ pattern, style }) => {
      highlightedCode = highlightedCode.replace(pattern, (match) => {
        const styleStr = Object.entries(style)
          .map(([key, value]) => `${key.replace(/([A-Z])/g, "-$1").toLowerCase()}: ${value}`)
          .join("; ")
        return `<span style="${styleStr}">${match}</span>`
      })
    })

    return highlightedCode
  }

  return (
    <Box
      component="pre"
      sx={{
        bgcolor: MONOKAI_COLORS.BG,
        border: `1px solid rgba(148, 163, 184, 0.2)`,
        borderRadius: 1,
        p: 2,
        overflow: "auto",
        fontFamily: "'Fira Code', 'Monaco', 'Menlo', 'Ubuntu Mono', monospace",
        fontSize: "13px",
        lineHeight: 1.5,
        my: 2,
        boxShadow: "inset 0 2px 10px rgba(0, 0, 0, 0.4)",
        color: MONOKAI_COLORS.OPERATOR,
        "& .line-number": {
          color: MONOKAI_COLORS.COMMENT,
          marginRight: "1em",
          userSelect: "none",
        },
      }}
    >
      <Box
        component="code"
        dangerouslySetInnerHTML={{
          __html: highlightCode(code, language),
        }}
      />
    </Box>
  )
}
