import React, { useState, useEffect, useRef } from "react";

const CodeEditor = () => {
  const [content, setContent] = useState("");
  const editorRef = useRef(null);
  const linesRef = useRef(null);

  // Function to handle changes to the text content
  const handleContentChange = (event) => {
    const newContent = event.target.value;
    setContent(newContent);
  };

  // Function to generate line numbers based on the content
  const generateLineNumbers = (text) => {
    const lineCount = text.split("\n").length; // count the number of lines
    const lineNumbers = [];
    for (let i = 1; i <= lineCount; i++) {
      lineNumbers.push(i);
    }
    return lineNumbers;
  };

  // Update the line numbers whenever content changes
  useEffect(() => {
    if (linesRef.current) {
      const lineNumbers = generateLineNumbers(content);
      linesRef.current.innerHTML = lineNumbers
        .map((number) => `<div class="line-number">${number}</div>`)
        .join("");
    }
  }, [content]);

  return (
    <div style={{ display: "flex" }}>
      {/* Left column for line numbers */}
      <div
        ref={linesRef}
        style={{
          width: "50px",
          backgroundColor: "#f4f4f4",
          padding: "10px",
          textAlign: "right",
          userSelect: "none",
          fontFamily: "monospace",
          fontSize: "14px",
          color: "#888",
        }}
      ></div>

      {/* Right column for editable content */}
      <textarea
        ref={editorRef}
        value={content}
        onChange={handleContentChange}
        onKeyDown={(e) => {
          if (e.key === "Enter" || (e.key === "Enter" && e.shiftKey)) {
            // Prevent the default action of adding a new line and allow custom line handling
            e.preventDefault();

            // Handle enter key behavior - create a new line number if content exceeds the line limit
            const cursorPos = editorRef.current.selectionStart;
            const before = content.slice(0, cursorPos);
            const after = content.slice(cursorPos);

            // Insert a line break with proper line number handling
            setContent(before + "\n" + after);
          }
        }}
        style={{
          flex: 1,
          padding: "10px",
          fontFamily: "monospace",
          fontSize: "14px",
          minHeight: "300px",
          resize: "none",
          border: "1px solid #ccc",
          whiteSpace: "pre-wrap",
          wordWrap: "break-word",
          overflowY: "auto",
        }}
      />
    </div>
  );
};

export default CodeEditor;
