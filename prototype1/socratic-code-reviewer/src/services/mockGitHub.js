// Mock data representing a GitHub repository tree and file contents

export const mockRepoTree = [
  {
    name: 'src',
    type: 'folder',
    children: [
      { name: 'App.jsx', type: 'file', path: 'src/App.jsx' },
      { name: 'index.css', type: 'file', path: 'src/index.css' },
      { name: 'utils.js', type: 'file', path: 'src/utils.js' },
      {
        name: 'components',
        type: 'folder',
        children: [
          { name: 'Button.jsx', type: 'file', path: 'src/components/Button.jsx' }
        ]
      }
    ]
  },
  { name: 'package.json', type: 'file', path: 'package.json' },
  { name: 'README.md', type: 'file', path: 'README.md' }
];

export const mockFileContents = {
  'src/App.jsx': `import React, { useState } from 'react';
import Button from './components/Button';

function App() {
  const [count, setCount] = useState(0);

  // BUG: Memory leak potential or bad pattern here for students to catch
  React.useEffect(() => {
    setInterval(() => {
      console.log("Running interval...");
    }, 1000);
  }, []);

  return (
    <div className="app">
      <h1>Hello World</h1>
      <Button onClick={() => setCount(count + 1)}>
        Count is {count}
      </Button>
    </div>
  );
}

export default App;`,
  'src/utils.js': `export function calculateTotal(items) {
  // BUG: Not handling edge case where items is undefined
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`,
  'package.json': `{
  "name": "sample-project",
  "version": "1.0.0",
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  }
}`,
  'src/components/Button.jsx': `export default function Button({ children, onClick }) {
  // BUG: No proptypes or typescript, inline styles instead of tailwind
  return (
    <button style={{ backgroundColor: 'blue', color: 'white' }} onClick={onClick}>
      {children}
    </button>
  );
}`
};

export const fetchMockFile = async (path) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockFileContents[path] || "// File not found");
    }, 300);
  });
};

export const fetchMockTree = async () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(mockRepoTree);
    }, 500);
  });
};
