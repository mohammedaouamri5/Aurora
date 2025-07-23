"use client"

export const sampleMessages = {
  1: [
    {
      id: "msg1",
      type: "user",
      content: "How do I create a React component with hooks?",
      timestamp: "2 hours ago",
    },
    {
      id: "msg2",
      type: "assistant",
      content:
        "To create a React component with hooks, you can use functional components along with built-in hooks like useState and useEffect. Here's a simple example:\n\n```jsx\nimport React, { useState, useEffect } from 'react';\n\nfunction MyComponent() {\n  const [count, setCount] = useState(0);\n\n  useEffect(() => {\n    document.title = `Count: ${count}`;\n  }, [count]);\n\n  return (\n    <div>\n      <p>You clicked {count} times</p>\n      <button onClick={() => setCount(count + 1)}>\n        Click me\n      </button>\n    </div>\n  );\n}\n\nexport default MyComponent;\n```\n\nThis component uses useState to manage state and useEffect to perform side effects.",
      timestamp: "2 hours ago",
    },
    {
      id: "msg3",
      type: "user",
      content: "Can you explain useEffect in more detail?",
      timestamp: "2 hours ago",
    },
    {
      id: "msg4",
      type: "assistant",
      content:
        "useEffect is a React Hook that lets you perform side effects in functional components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount combined in React class components.\n\nHere are the main patterns:\n\n1. **Effect without cleanup:**\n```jsx\nuseEffect(() => {\n  document.title = `You clicked ${count} times`;\n});\n```\n\n2. **Effect with cleanup:**\n```jsx\nuseEffect(() => {\n  const subscription = subscribeToSomething();\n  return () => {\n    subscription.unsubscribe();\n  };\n}, []);\n```\n\n3. **Effect with dependencies:**\n```jsx\nuseEffect(() => {\n  fetchUserData(userId);\n}, [userId]); // Only re-run when userId changes\n```\n\nThe dependency array is crucial for performance optimization!",
      timestamp: "2 hours ago",
    },
  ],
  2: [
    {
      id: "msg5",
      type: "user",
      content: "I need help with Material-UI sidebar design. How can I make it collapsible?",
      timestamp: "4 hours ago",
    },
    {
      id: "msg6",
      type: "assistant",
      content:
        "To create a collapsible Material-UI sidebar, you can use the Drawer component with proper state management. Here's how:\n\n```jsx\nimport { Drawer, IconButton, Box } from '@mui/material';\nimport { Menu as MenuIcon } from '@mui/icons-material';\n\nfunction CollapsibleSidebar() {\n  const [open, setOpen] = useState(false);\n\n  const toggleDrawer = () => {\n    setOpen(!open);\n  };\n\n  return (\n    <Box sx={{ display: 'flex' }}>\n      <IconButton onClick={toggleDrawer}>\n        <MenuIcon />\n      </IconButton>\n      \n      <Drawer\n        variant=\"persistent\"\n        anchor=\"left\"\n        open={open}\n        sx={{\n          width: 240,\n          '& .MuiDrawer-paper': {\n            width: 240,\n            boxSizing: 'border-box',\n          },\n        }}\n      >\n        {/* Sidebar content */}\n      </Drawer>\n    </Box>\n  );\n}\n```\n\nKey points:\n- Use `variant=\"persistent\"` for a sidebar that pushes content\n- Use `variant=\"temporary\"` for an overlay sidebar\n- Control visibility with the `open` prop",
      timestamp: "4 hours ago",
    },
  ],
  3: [
    {
      id: "msg7",
      type: "user",
      content: "What are TypeScript best practices for React development?",
      timestamp: "6 hours ago",
    },
    {
      id: "msg8",
      type: "assistant",
      content:
        "Here are key TypeScript best practices for React development:\n\n## 1. Component Props Typing\n```tsx\ninterface ButtonProps {\n  children: React.ReactNode;\n  onClick: () => void;\n  variant?: 'primary' | 'secondary';\n  disabled?: boolean;\n}\n\nconst Button: React.FC<ButtonProps> = ({ children, onClick, variant = 'primary', disabled = false }) => {\n  return (\n    <button onClick={onClick} disabled={disabled} className={variant}>\n      {children}\n    </button>\n  );\n};\n```\n\n## 2. State Typing\n```tsx\nconst [user, setUser] = useState<User | null>(null);\nconst [loading, setLoading] = useState<boolean>(false);\n```\n\n## 3. Event Handlers\n```tsx\nconst handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {\n  e.preventDefault();\n  // handle form submission\n};\n```\n\n## 4. Ref Typing\n```tsx\nconst inputRef = useRef<HTMLInputElement>(null);\n```\n\nThese practices help catch errors early and improve code maintainability!",
      timestamp: "6 hours ago",
    },
  ],
}

