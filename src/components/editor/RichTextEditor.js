import React, { useState, useEffect, useRef } from 'react';
import { useEditor, EditorContent, Extension } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Image as TiptapImage } from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import TextStyle from '@tiptap/extension-text-style';
import Color from '@tiptap/extension-color';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import Highlight from '@tiptap/extension-highlight';
import styled from 'styled-components';
import theme from '../../utils/theme';

const EditorContainer = styled.div`
  .ProseMirror {
    min-height: 300px;
    outline: none;
    padding: ${theme.spacing.md};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.md};
    background-color: white;
    
    &:focus {
      border-color: ${theme.colors.primary};
    }
    
    > * + * {
      margin-top: 0.75em;
    }
    
    h1 {
      font-size: 2em;
      font-weight: bold;
      margin-top: 1em;
    }
    
    h2 {
      font-size: 1.5em;
      font-weight: bold;
      margin-top: 1em;
    }
    
    h3 {
      font-size: 1.3em;
      font-weight: bold;
    }
    
    p {
      margin: 0.5em 0;
    }
    
    ul, ol {
      padding-left: 1.5em;
    }
    
    blockquote {
      border-left: 3px solid ${theme.colors.primary};
      padding-left: 1em;
      margin-left: 0;
      color: ${theme.colors.lightText};
    }
    
    code {
      background-color: ${theme.colors.lightBackground};
      padding: 0.2em 0.4em;
      border-radius: ${theme.borderRadius.sm};
      font-family: monospace;
    }
    
    pre {
      background-color: ${theme.colors.lightBackground};
      padding: 0.75em;
      border-radius: ${theme.borderRadius.md};
      overflow-x: auto;
      
      code {
        background: none;
        padding: 0;
      }
    }
    
    img {
      max-width: 100%;
      height: auto;
      margin: 1em 0;
      border-radius: ${theme.borderRadius.md};
    }
    
    a {
      color: ${theme.colors.primary};
      text-decoration: underline;
    }
    
    mark {
      background-color: rgba(255, 230, 0, 0.3);
      border-radius: 0.1em;
    }
  }
  
  .is-editor-empty:first-child::before {
    content: attr(data-placeholder);
    float: left;
    color: ${theme.colors.lightText};
    pointer-events: none;
    height: 0;
  }
`;

const MenuBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5em;
  margin-bottom: 1em;
  padding: 0.5em;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.borderRadius.md};
  background-color: ${theme.colors.lightBackground};
`;

const MenuButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.4em 0.6em;
  background-color: ${props => (props.isActive ? theme.colors.primary + '20' : 'transparent')};
  border: 1px solid ${props => (props.isActive ? theme.colors.primary : theme.colors.border)};
  border-radius: ${theme.borderRadius.sm};
  color: ${props => (props.isActive ? theme.colors.primary : theme.colors.text)};
  cursor: pointer;
  font-weight: ${props => (props.isActive ? 'bold' : 'normal')};
  
  &:hover {
    background-color: ${props => (props.isActive ? theme.colors.primary + '30' : theme.colors.border + '50')};
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Divider = styled.div`
  width: 1px;
  height: 24px;
  background-color: ${theme.colors.border};
  margin: 0 0.25em;
`;

const UrlInput = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  margin-top: 0.5em;
  gap: 0.5em;
  
  input {
    flex: 1;
    padding: 0.5em;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    outline: none;
    
    &:focus {
      border-color: ${theme.colors.primary};
    }
  }
  
  .button-row {
    display: flex;
    gap: 0.5em;
  }
  
  button {
    padding: 0.5em 1em;
    background-color: ${theme.colors.primary};
    color: white;
    border: none;
    border-radius: ${theme.borderRadius.sm};
    cursor: pointer;
    
    &:hover {
      background-color: ${theme.colors.primaryDark};
    }
  }
  
  .file-input-container {
    position: relative;
    overflow: hidden;
    display: inline-block;
    
    input[type="file"] {
      position: absolute;
      left: 0;
      top: 0;
      opacity: 0;
      width: 100%;
      height: 100%;
      cursor: pointer;
    }
    
    .file-input-button {
      display: inline-block;
      padding: 0.5em 1em;
      background-color: ${theme.colors.lightBackground};
      border: 1px solid ${theme.colors.border};
      border-radius: ${theme.borderRadius.sm};
      cursor: pointer;
      
      &:hover {
        background-color: ${theme.colors.border + '80'};
      }
    }
  }
  
  .file-name {
    margin-top: 0.5em;
    font-size: 0.9em;
    color: ${theme.colors.lightText};
  }
  
  .image-size-controls {
    display: flex;
    gap: 0.5em;
    margin-top: 0.5em;
  }
  
  .size-button {
    flex: 1;
    padding: 0.5em;
    background-color: ${theme.colors.lightBackground};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm};
    font-size: 0.85rem;
    transition: all 0.2s ease;
    
    &.active {
      background-color: ${theme.colors.primary};
      color: white;
      border-color: ${theme.colors.primary};
    }
    
    &:hover:not(.active) {
      background-color: ${theme.colors.border + '50'};
    }
  }
  
  .image-preview {
    margin-top: 1em;
    border: 1px dashed ${theme.colors.border};
    padding: 0.5em;
    text-align: center;
    border-radius: ${theme.borderRadius.sm};
    max-width: 100%;
    
    img {
      max-width: 100%;
      height: auto;
      border-radius: ${theme.borderRadius.sm};
      margin: 0.5em 0;
    }
    
    .preview-text {
      font-size: 0.9em;
      color: ${theme.colors.lightText};
    }
  }
`;

// Function to compress image
const compressImage = (file, maxWidth = 1200, quality = 0.7) => {
  return new Promise((resolve) => {
    // Create a file reader to read the file as a data URL
    const reader = new FileReader();
    reader.onload = (event) => {
      // Create an image element
      const img = new Image();
      img.onload = () => {
        // Create canvas for image compression
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        
        // Scale down if width is larger than maxWidth
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        
        // Set canvas dimensions to target size
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress image
        const ctx = canvas.getContext('2d');
        // Fill with white background to avoid transparency issues
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        // Draw the image
        ctx.drawImage(img, 0, 0, width, height);
        
        // Get the mime type from the original file or default to jpeg
        let mimeType = 'image/jpeg';
        if (file.type && ['image/jpeg', 'image/png'].includes(file.type)) {
          mimeType = file.type;
        }
        
        // Convert to data URL with reduced quality
        // Use PNG for better quality if the original is PNG, otherwise use JPEG with quality setting
        const dataUrl = canvas.toDataURL(mimeType, mimeType === 'image/png' ? 1 : quality);
        resolve(dataUrl);
      };
      // Set image source to the file reader result
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  });
};

// Create a custom extension that adds classes to newly inserted images
const ImageSizeExtension = Extension.create({
  name: 'imageSize',
  
  addGlobalAttributes() {
    return [
      {
        types: ['image'],
        attributes: {
          class: {
            default: 'img-medium',
            parseHTML: element => element.getAttribute('class') || 'img-medium',
            renderHTML: attributes => {
              if (!attributes.class) return {};
              return { class: attributes.class };
            },
          },
        },
      },
    ];
  },
});

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [showImageInput, setShowImageInput] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedSize, setSelectedSize] = useState('medium'); // small, medium, large
  const [previewUrl, setPreviewUrl] = useState('');
  const [isCompressing, setIsCompressing] = useState(false);
  const fileInputRef = useRef(null);
  
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      TiptapImage.configure({
        inline: false,
        allowBase64: true,
      }),
      Link.configure({
        openOnClick: false,
        validate: url => /^(https?:\/\/)?[\w.-]+\.[a-zA-Z]{2,}(\/\S*)?$/.test(url),
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight,
      ImageSizeExtension, // Add our custom extension
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
  });

  // Reset the editor content when the value prop changes
  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value);
    }
  }, [editor, value]);

  // Generate preview when file is selected
  useEffect(() => {
    const processSelectedFile = async () => {
      if (selectedFile) {
        setIsCompressing(true);
        try {
          // Compress the image
          const compressedDataUrl = await compressImage(selectedFile);
          setPreviewUrl(compressedDataUrl);
        } catch (error) {
          console.error('Error compressing image:', error);
          // Fallback to original file if compression fails
          const reader = new FileReader();
          reader.onload = (e) => {
            setPreviewUrl(e.target.result);
          };
          reader.readAsDataURL(selectedFile);
        } finally {
          setIsCompressing(false);
        }
      } else {
        setPreviewUrl('');
      }
    };
    
    processSelectedFile();
  }, [selectedFile]);

  // Dynamically add global styles for image sizing
  useEffect(() => {
    // Create a style element for global CSS if it doesn't exist
    if (!document.getElementById('article-image-styles')) {
      const styleEl = document.createElement('style');
      styleEl.id = 'article-image-styles';
      styleEl.innerHTML = `
        /* Global image size styles that will apply both in editor and in article view */
        img.img-small {
          max-width: 25% !important;
          width: 25% !important;
          display: block !important;
          margin: 1em 0 !important;
          box-sizing: border-box !important;
        }
        
        img.img-medium {
          max-width: 50% !important;
          width: 50% !important;
          display: block !important;
          margin: 1em 0 !important;
          box-sizing: border-box !important;
        }
        
        img.img-large {
          max-width: 100% !important;
          width: 100% !important;
          display: block !important;
          margin: 1em 0 !important;
          box-sizing: border-box !important;
        }
      `;
      document.head.appendChild(styleEl);
    }
    
    // Clean up the style element when component unmounts
    return () => {
      const styleEl = document.getElementById('article-image-styles');
      if (styleEl && document.querySelectorAll('.ProseMirror').length <= 1) {
        styleEl.remove();
      }
    };
  }, []);

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      // Ensure URL has proper protocol
      let formattedUrl = linkUrl.trim();
      
      // Add http:// protocol if the URL doesn't already have a protocol
      if (!/^https?:\/\//i.test(formattedUrl)) {
        formattedUrl = 'http://' + formattedUrl;
      }
      
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: formattedUrl })
        .run();
      
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };
  
  const addImage = () => {
    if (selectedFile && previewUrl) {
      try {
        // Get size class based on selection
        const sizeClass = `img-${selectedSize}`;
        
        // Insert the image with class attribute directly
        editor
          .chain()
          .focus()
          .setImage({ 
            src: previewUrl,
            alt: selectedFile.name || 'Uploaded image',
            title: selectedFile.name || 'Uploaded image',
            class: sizeClass, // Add class directly through extension
          })
          .run();
        
        // Clear state
        setSelectedFile(null);
        setPreviewUrl('');
        setShowImageInput(false);
      } catch (error) {
        console.error('Error inserting image:', error);
        alert('There was a problem inserting the image. Please try again.');
      }
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      // Check file size before processing
      if (file.size > 10 * 1024 * 1024) { // Larger than 10MB
        alert("Image is too large. Please select an image smaller than 10MB.");
        return;
      }
      setSelectedFile(file);
    }
  };

  return (
    <EditorContainer>
      <style>
        {`
          .ProseMirror .img-small { 
            max-width: 25% !important; 
            width: 25% !important;
            display: block !important;
            margin: 1em 0 !important;
            box-sizing: border-box !important;
          }
          
          .ProseMirror .img-medium { 
            max-width: 50% !important; 
            width: 50% !important;
            display: block !important;
            margin: 1em 0 !important;
            box-sizing: border-box !important;
          }
          
          .ProseMirror .img-large { 
            max-width: 100% !important; 
            width: 100% !important;
            display: block !important;
            margin: 1em 0 !important;
            box-sizing: border-box !important;
          }
          
          /* Add specific selector to apply to img tags directly */
          .ProseMirror img[class*="img-"] {
            height: auto !important;
          }
        `}
      </style>
      <MenuBar>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          B
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          I
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          U
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          S
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          title="Highlight"
        >
          H
        </MenuButton>
        
        <Divider />
        
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          title="Paragraph"
        >
          P
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          H1
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </MenuButton>
        
        <Divider />
        
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          • List
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          1. List
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          Quote
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          Code
        </MenuButton>
        
        <Divider />
        
        <MenuButton
          type="button"
          onClick={() => setShowLinkInput(!showLinkInput)}
          isActive={editor.isActive('link')}
          title="Add Link"
        >
          Link
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => setShowImageInput(!showImageInput)}
          title="Add Image"
        >
          Image
        </MenuButton>
        
        <Divider />
        
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          Left
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          Center
        </MenuButton>
        <MenuButton
          type="button"
          onClick={() => editor.chain().focus().setTextAlign('right').run()}
          isActive={editor.isActive({ textAlign: 'right' })}
          title="Align Right"
        >
          Right
        </MenuButton>
      </MenuBar>
      
      {showLinkInput && (
        <UrlInput>
          <input
            type="url"
            placeholder="Enter URL"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addLink()}
          />
          <div className="button-row">
            <button type="button" onClick={addLink}>Add Link</button>
            <button type="button" onClick={() => setShowLinkInput(false)}>Cancel</button>
          </div>
        </UrlInput>
      )}
      
      {showImageInput && (
        <UrlInput>
          <div className="file-input-container">
            <input 
              type="file" 
              accept="image/*" 
              ref={fileInputRef}
              onChange={handleFileChange} 
            />
            <div className="file-input-button">Choose Image File</div>
          </div>
          
          {selectedFile && (
            <>
              <div className="file-name">
                Selected: {selectedFile.name} 
                {isCompressing && ' (Compressing...)'}
              </div>
              
              <div className="image-size-controls">
                <button 
                  type="button"
                  className={`size-button ${selectedSize === 'small' ? 'active' : ''}`}
                  onClick={() => setSelectedSize('small')}
                >
                  Small
                </button>
                <button 
                  type="button"
                  className={`size-button ${selectedSize === 'medium' ? 'active' : ''}`}
                  onClick={() => setSelectedSize('medium')}
                >
                  Medium
                </button>
                <button 
                  type="button"
                  className={`size-button ${selectedSize === 'large' ? 'active' : ''}`}
                  onClick={() => setSelectedSize('large')}
                >
                  Large
                </button>
              </div>
              
              {previewUrl && (
                <div className="image-preview">
                  <div className="preview-text">Preview ({selectedSize})</div>
                  <img 
                    src={previewUrl} 
                    alt="Preview" 
                    className={`img-${selectedSize}`}
                  />
                </div>
              )}
            </>
          )}
          
          <div className="button-row">
            <button 
              type="button"
              onClick={addImage}
              disabled={!selectedFile || isCompressing}
            >
              {isCompressing ? 'Compressing...' : 'Add Image'}
            </button>
            <button 
              type="button"
              onClick={() => {
                setShowImageInput(false);
                setSelectedFile(null);
                setPreviewUrl('');
              }}
            >
              Cancel
            </button>
          </div>
        </UrlInput>
      )}
      
      <EditorContent editor={editor} />
    </EditorContainer>
  );
};

export default RichTextEditor; 