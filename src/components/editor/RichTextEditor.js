import React, { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
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
  margin-top: 0.5em;
  
  input {
    flex: 1;
    padding: 0.5em;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.borderRadius.sm} 0 0 ${theme.borderRadius.sm};
    outline: none;
    
    &:focus {
      border-color: ${theme.colors.primary};
    }
  }
  
  button {
    padding: 0.5em 1em;
    background-color: ${theme.colors.primary};
    color: white;
    border: none;
    border-radius: 0 ${theme.borderRadius.sm} ${theme.borderRadius.sm} 0;
    cursor: pointer;
    
    &:hover {
      background-color: ${theme.colors.primaryDark};
    }
  }
`;

const RichTextEditor = ({ value, onChange, placeholder }) => {
  const [linkUrl, setLinkUrl] = useState('');
  const [showLinkInput, setShowLinkInput] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [showImageInput, setShowImageInput] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder,
      }),
      Image,
      Link.configure({
        openOnClick: false,
      }),
      TextStyle,
      Color,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
      }),
      Underline,
      Highlight,
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

  if (!editor) {
    return null;
  }

  const addLink = () => {
    if (linkUrl) {
      editor
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: linkUrl })
        .run();
      
      setLinkUrl('');
      setShowLinkInput(false);
    }
  };
  
  const addImage = () => {
    if (imageUrl) {
      editor
        .chain()
        .focus()
        .setImage({ src: imageUrl })
        .run();
      
      setImageUrl('');
      setShowImageInput(false);
    }
  };

  return (
    <EditorContainer>
      <MenuBar>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBold().run()}
          isActive={editor.isActive('bold')}
          title="Bold"
        >
          B
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleItalic().run()}
          isActive={editor.isActive('italic')}
          title="Italic"
        >
          I
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          isActive={editor.isActive('underline')}
          title="Underline"
        >
          U
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleStrike().run()}
          isActive={editor.isActive('strike')}
          title="Strikethrough"
        >
          S
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHighlight().run()}
          isActive={editor.isActive('highlight')}
          title="Highlight"
        >
          H
        </MenuButton>
        
        <Divider />
        
        <MenuButton
          onClick={() => editor.chain().focus().setParagraph().run()}
          isActive={editor.isActive('paragraph')}
          title="Paragraph"
        >
          P
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          isActive={editor.isActive('heading', { level: 1 })}
          title="Heading 1"
        >
          H1
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          isActive={editor.isActive('heading', { level: 2 })}
          title="Heading 2"
        >
          H2
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          isActive={editor.isActive('heading', { level: 3 })}
          title="Heading 3"
        >
          H3
        </MenuButton>
        
        <Divider />
        
        <MenuButton
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          isActive={editor.isActive('bulletList')}
          title="Bullet List"
        >
          • List
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          isActive={editor.isActive('orderedList')}
          title="Numbered List"
        >
          1. List
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          isActive={editor.isActive('blockquote')}
          title="Blockquote"
        >
          Quote
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          isActive={editor.isActive('codeBlock')}
          title="Code Block"
        >
          Code
        </MenuButton>
        
        <Divider />
        
        <MenuButton
          onClick={() => setShowLinkInput(!showLinkInput)}
          isActive={editor.isActive('link')}
          title="Add Link"
        >
          Link
        </MenuButton>
        <MenuButton
          onClick={() => setShowImageInput(!showImageInput)}
          title="Add Image"
        >
          Image
        </MenuButton>
        
        <Divider />
        
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('left').run()}
          isActive={editor.isActive({ textAlign: 'left' })}
          title="Align Left"
        >
          Left
        </MenuButton>
        <MenuButton
          onClick={() => editor.chain().focus().setTextAlign('center').run()}
          isActive={editor.isActive({ textAlign: 'center' })}
          title="Align Center"
        >
          Center
        </MenuButton>
        <MenuButton
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
          <button onClick={addLink}>Add Link</button>
        </UrlInput>
      )}
      
      {showImageInput && (
        <UrlInput>
          <input
            type="url"
            placeholder="Enter image URL"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addImage()}
          />
          <button onClick={addImage}>Add Image</button>
        </UrlInput>
      )}
      
      <EditorContent editor={editor} />
    </EditorContainer>
  );
};

export default RichTextEditor; 