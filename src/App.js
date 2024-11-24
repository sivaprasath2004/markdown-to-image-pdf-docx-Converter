import React, { useState } from 'react';
import MarkdownIt from 'markdown-it';
import html2pdf from 'html2pdf.js';
import html2canvas from 'html2canvas';
import PizZip from 'pizzip';
import Docxtemplater from 'docxtemplater';
import "./App.css" 
import { Button,notification,Flex, Splitter, Switch, Typography } from "antd";
function App() {
  const [markdown, setMarkdown] = useState('');
  const [htmlContent, setHtmlContent] = useState('');
  const [api, contextHolder] = notification.useNotification();
  const [sizes, setSizes] = React.useState(['50%', '50%']);
  const [enabled, setEnabled] = React.useState(true);
  const openNotificationWithIcon = (type) => {
    api[type]({
      message: 'File Successfully Saved',
      description:
        'Thank you using our application.',
    });
  };
  const mdParser = new MarkdownIt();
 
  const handleMarkdownChange = (e) => {
    setMarkdown(e.target.value);
    setHtmlContent(mdParser.render(e.target.value));
  };
 
  const convertToPDF = () => {
    const element = document.getElementById('content');
    const options = {
      filename: 'md-to-pdf-converter.pdf',
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
      oncomplete: function () {  
          openNotificationWithIcon('success'); 
      },
    };
    html2pdf().from(element).set(options).save();
  };
 
  const convertToDOCX = () => {
    const zip = new PizZip();
    const doc = new Docxtemplater();
     
    const template = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
    <w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
      <w:body>
        <w:p>
          <w:r>
            <w:t>${htmlContent}</w:t>
          </w:r>
        </w:p>
      </w:body>
    </w:document>`;
    
    zip.file('word/document.xml', template);
    const docx = zip.generate({ type: 'blob' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(docx);
    link.download = 'output.docx';
    link.click();
  };
 
  const convertToImage = () => {
    const element = document.getElementById('content');
    html2canvas(element).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = imgData;
      link.download = 'output.png';
      link.click();
    });
  };

  return (
    <div className="App">
      {contextHolder}
      <nav>
      <h4>Markdown to PDF, DOCX, and Image Converter</h4>
      <div style={{ marginTop: '20px' }}> 
        <Button type="primary" size="large" icon={<img src='https://cdn-icons-png.flaticon.com/128/8304/8304545.png' style={{height:18,width:18,filter:"invert(1)"}} />} onClick={convertToPDF}>PDF</Button>
        <Button type="primary" size="large" icon={<img src='https://cdn-icons-png.flaticon.com/128/5768/5768720.png'  style={{height:18,width:18,filter:"invert(1)"}} />} onClick={convertToDOCX}>DOCX</Button>
        <Button type="primary" size="large" icon={<img src='https://cdn-icons-png.flaticon.com/128/8287/8287193.png'  style={{height:18,width:18,filter:"invert(1)"}} />} onClick={convertToImage}>Image</Button>
        <GithubButton  />
      </div>
      </nav>
 <div className='editing-container'> 
      <Splitter
        onResize={setSizes} 
        style={{
          width: '100%',  
          height: '100%',  
          boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        }}
      > 
          <Splitter.Panel size={sizes[0]} resizable={enabled} style={{padding:"0.4rem 0.6rem 0.6rem 0.3rem"}}>
          {/* <Desc text="First" /> */}
          <textarea
        value={markdown}
        onChange={handleMarkdownChange}
        placeholder="Enter Markdown content"
        rows="10" 
        style={{
          width: '100%', 
          height: '100%',  
          overflow: 'auto', 
          border:"none"
        }}
      /> 
        </Splitter.Panel>
        <Splitter.Panel size={sizes[1]} style={{padding:"0.4rem 0.3rem 0.6rem 0.3rem"}}>
          {/* <Desc text="Second" /> */}
          <div
        id="content"
        style={{width:'100%',height:"100%",overflow:"auto" }}
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      ></div>
        </Splitter.Panel>
      </Splitter> 
      
      
</div> 
    </div>
  );
}

export default App;


// import React from 'react';
// import styled from 'styled-components';

export const GithubButton = () => {
  return ( 
      <button className="Btn">
        <span className="svgContainer">
          <svg fill="white" viewBox="0 0 496 512" height="1.6em"><path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z" /></svg>
        </span>
        <span className="BG" />
      </button> 
  );
}
