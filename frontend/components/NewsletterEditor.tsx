'use client';

import { useEditor, EditorContent } from '@tiptap/react';
// Import BubbleMenu from the specific menus path for v3
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
// REMOVED: import ExtensionBubbleMenu from '@tiptap/extension-bubble-menu'; <-- Causing the conflict
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface NewsletterEditorProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

const MenuBar = ({ editor }: { editor: any }) => {
  const [inputMode, setInputMode] = useState<'none' | 'link' | 'image'>('none');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (inputMode === 'none') {
      setInputValue('');
      editor?.commands.focus();
    } else if (inputMode === 'link') {
      const previousUrl = editor?.getAttributes('link').href;
      setInputValue(previousUrl || '');
    }
  }, [inputMode, editor]);

  if (!editor) return null;

  const handleInputSubmit = (e?: React.FormEvent | React.KeyboardEvent | React.MouseEvent) => {
    if (e) e.preventDefault();

    if (!inputValue.trim()) {
      closeInput();
      return;
    }

    if (inputMode === 'image') {
      editor.chain().focus().insertContent([
        {
          type: 'image',
          attrs: {
            src: inputValue,
            class: 'w-full block mb-4 rounded-lg'
          }
        },
        { type: 'paragraph' }
      ]).run();
      toast.success('Image inserted');
    }
    else if (inputMode === 'link') {
      editor.chain().focus().extendMarkRange('link').setLink({ href: inputValue }).run();
      toast.success('Link added');
    }

    closeInput();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      closeInput();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation();
      handleInputSubmit();
    }
  };

  const closeInput = () => {
    setInputMode('none');
    setInputValue('');
  };

  const removeLink = () => {
    editor.chain().focus().unsetLink().run();
    closeInput();
  };

  const btnClass = (isActive: boolean) =>
    `p-1.5 rounded min-w-[32px] flex items-center justify-center transition-colors ${isActive ? 'bg-gray-300 text-black shadow-inner font-bold' : 'text-gray-600 hover:bg-gray-200'}`;

  if (inputMode !== 'none') {
    return (
      <div className="border-b border-gray-200 bg-gray-50 p-2 sticky top-0 z-10 flex gap-2 items-center animate-in fade-in slide-in-from-top-1 duration-200">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide">
          {inputMode === 'image' ? 'Insert Image' : 'Edit Link'}
        </span>

        <div className="flex-1 flex gap-2">
          <input
            autoFocus
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputMode === 'image' ? "Paste image URL here..." : "Paste link URL here..."}
            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-[var(--brand-purple)]"
            onKeyDown={handleKeyDown}
          />
          <button
            type="button"
            onClick={handleInputSubmit}
            className="px-3 py-1 bg-[var(--brand-purple)] text-white text-xs font-bold rounded hover:bg-black transition-colors"
          >
            Apply
          </button>
          <button
            type="button"
            onClick={closeInput}
            className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-100 transition-colors"
          >
            Cancel
          </button>

          {inputMode === 'link' && editor.isActive('link') && (
            <button
              type="button"
              onClick={removeLink}
              className="px-3 py-1 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-100 transition-colors"
            >
              Unlink
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-2 sticky top-0 z-10 flex flex-wrap gap-1 items-center">
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))}>H1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))}>H2</button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} disabled={!editor.can().chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Bold"><span className="font-bold">B</span></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} disabled={!editor.can().chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Italic"><span className="italic">I</span></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))} title="Underline"><span className="underline">U</span></button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="Align Left">←</button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="Align Center">↔</button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Bullet List">• List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Numbered List">1. List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))} title="Quote">❝ Quote</button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button type="button" onClick={() => setInputMode('link')} className={btnClass(editor.isActive('link'))} title="Add Link">🔗</button>
      <button type="button" onClick={() => setInputMode('image')} className={btnClass(false)} title="Add Image">🖼️</button>
    </div>
  );
};

export default function NewsletterEditor({ onSubmit, initialData, isLoading }: NewsletterEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');

  const [galleryInput, setGalleryInput] = useState('');
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      // REMOVED: ExtensionBubbleMenu.configure(...) to prevent double initialization conflict
      Image.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            class: {
              default: 'w-full block mb-4 rounded-lg',
              parseHTML: element => element.getAttribute('class'),
              renderHTML: attributes => {
                return {
                  class: attributes.class,
                }
              },
            },
          }
        },
      }).configure({ inline: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
    ],
    content: initialData?.contentHtml || initialData?.contentMarkdown || '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[50vh] md:min-h-[500px] p-4 md:p-8 prose-img:rounded-lg prose-img:shadow-sm prose-a:text-blue-600',
      },
    },
    immediatelyRender: false,
  });

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialData) {
      setSlug(val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
    }
  };

  const handleAddGalleryImage = () => {
    if (!galleryInput.trim()) return;
    setGallery([...gallery, galleryInput]);
    setGalleryInput('');
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    setGallery(newGallery);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Please enter a headline');
    if (!editor || editor.isEmpty) return toast.error('Please write some content');

    onSubmit({
      title,
      slug,
      excerpt,
      status,
      coverImage,
      gallery,
      contentHtml: editor.getHTML(),
      template: 'default'
    });
  };

  const setImgLeft = () => editor?.chain().focus().updateAttributes('image', { class: 'float-left mr-6 mb-4 max-w-[50%] rounded-lg' }).run();
  const setImgRight = () => editor?.chain().focus().updateAttributes('image', { class: 'float-right ml-6 mb-4 max-w-[50%] rounded-lg' }).run();
  const setImgCenter = () => editor?.chain().focus().updateAttributes('image', { class: 'block mx-auto mb-4 rounded-lg' }).run();
  const setImgFull = () => editor?.chain().focus().updateAttributes('image', { class: 'w-full block mb-4 rounded-lg' }).run();

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
      {/* Top Meta Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-gray-50 rounded-xl border border-gray-200 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Headline</label>
            <input type="text" value={title} onChange={handleTitleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-purple)] focus:outline-none" placeholder="Newsletter Headline" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded font-mono text-sm" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Summary</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-purple)] focus:outline-none" />
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded bg-white">
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Cover Image URL</label>
            <input
              type="text"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              placeholder="https://..."
              className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-purple)] focus:outline-none"
            />
            {coverImage && (
              <img src={coverImage} alt="Cover" className="mt-2 h-32 object-cover rounded border" />
            )}
          </div>

          <div className="pt-2 border-t border-gray-200 mt-2">
            <label className="block text-sm font-bold text-gray-700 mb-1">Gallery Images (Optional)</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={galleryInput}
                onChange={(e) => setGalleryInput(e.target.value)}
                placeholder="Add image URL..."
                className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
              />
              <button type="button" onClick={handleAddGalleryImage} className="bg-gray-200 px-3 py-1 rounded text-xs font-bold hover:bg-gray-300">+</button>
            </div>
            {gallery.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {gallery.map((img, idx) => (
                  <div key={idx} className="relative group w-16 h-16">
                    <img src={img} className="w-full h-full object-cover rounded border" />
                    <button
                      type="button"
                      onClick={() => removeGalleryImage(idx)}
                      className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <label className="text-xl font-bold text-gray-800">Content</label>
        </div>
        <div className="bg-gray-100 p-2 md:p-4 rounded-lg border border-gray-200 min-h-[50vh] md:min-h-[800px] flex justify-center relative">
          <div className="w-full max-w-[850px] bg-white shadow-lg min-h-[50vh] md:min-h-[800px] flex flex-col rounded-sm">
            <div className="overflow-x-auto">
              <MenuBar editor={editor} />
            </div>

            {/* --- BUBBLE MENU FOR IMAGES --- */}
            {editor && (
              <BubbleMenu
                editor={editor}
                shouldShow={({ editor }) => editor.isActive('image')}
                className="flex gap-1 bg-white border border-gray-200 shadow-xl rounded-lg p-1 overflow-x-auto max-w-[90vw]"
              >
                <button
                  type="button"
                  onClick={setImgLeft}
                  className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('image', { class: 'float-left mr-6 mb-4 max-w-[50%] rounded-lg' }) ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                  title="Float Left"
                >
                  ⬅️ Left
                </button>
                <button
                  type="button"
                  onClick={setImgCenter}
                  className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('image', { class: 'block mx-auto mb-4 rounded-lg' }) ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                  title="Center"
                >
                  ⬇️ Center
                </button>
                <button
                  type="button"
                  onClick={setImgRight}
                  className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('image', { class: 'float-right ml-6 mb-4 max-w-[50%] rounded-lg' }) ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                  title="Float Right"
                >
                  Right ➡️
                </button>
                <button
                  type="button"
                  onClick={setImgFull}
                  className={`p-2 rounded hover:bg-gray-100 ${editor.isActive('image', { class: 'w-full block mb-4 rounded-lg' }) ? 'bg-purple-100 text-purple-700' : 'text-gray-600'}`}
                  title="Full Width"
                >
                  ↔️ Full
                </button>
              </BubbleMenu>
            )}

            <EditorContent editor={editor} className="flex-1" />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="sticky bottom-4 z-20 flex justify-end gap-4">
        <div className="flex gap-4 bg-white/90 backdrop-blur p-2 rounded-lg shadow-xl border border-gray-200">
          <button type="button" onClick={() => window.history.back()} className="px-6 py-2 rounded font-semibold text-gray-700 hover:bg-gray-100">Cancel</button>
          <button type="submit" disabled={isLoading} className="px-8 py-2 rounded bg-[var(--brand-purple)] text-white font-bold hover:bg-black transition">{isLoading ? 'Saving...' : initialData ? 'Update' : 'Publish'}</button>
        </div>
      </div>
      <style jsx global>{`
        .ProseMirror { min-height: 500px; outline: none; }
        .ProseMirror blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; font-style: italic; color: #4b5563; }
        /* Fix for floated images in editor */
        .ProseMirror::after { content: ""; display: table; clear: both; }
      `}</style>
    </form>
  );
}