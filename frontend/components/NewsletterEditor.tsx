'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TextAlign from '@tiptap/extension-text-align';
import { useState } from 'react';
import { toast } from 'sonner'; // <--- Import Toast

interface NewsletterEditorProps {
  onSubmit: (data: any) => void;
  initialData?: any;
  isLoading?: boolean;
}

// --- Toolbar Component ---
const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) return null;

  const addImage = () => {
    const url = window.prompt('Enter Image URL');
    if (url) {
      editor.chain().focus().insertContent([
        { type: 'image', attrs: { src: url } },
        { type: 'paragraph' }
      ]).run();
      toast.success('Image inserted'); // <--- UX Improvement
    }
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes('link').href;
    const url = window.prompt('URL', previousUrl);
    if (url === null) return;
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
    toast.success('Link added'); // <--- UX Improvement
  };

  const btnClass = (isActive: boolean) => 
    `p-1.5 rounded hover:bg-gray-200 transition-colors ${isActive ? 'bg-gray-300 text-black shadow-inner' : 'text-gray-600'}`;

  return (
    <div className="border-b border-gray-200 bg-gray-50 p-2 sticky top-0 z-10 flex flex-wrap gap-1 items-center">
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={`px-3 py-1 rounded text-sm font-bold ${editor.isActive('heading', { level: 1 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>H1</button>
      <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={`px-3 py-1 rounded text-sm font-bold ${editor.isActive('heading', { level: 2 }) ? 'bg-gray-300' : 'hover:bg-gray-200'}`}>H2</button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))}><span className="font-bold">B</span></button>
      <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))}><span className="italic">I</span></button>
      <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))}><span className="underline">U</span></button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))}>←</button>
      <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))}>↔</button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))}>• List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))}>1. List</button>
      <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))}>❝ Quote</button>
      <div className="w-px h-6 bg-gray-300 mx-1 self-center"></div>
      <button type="button" onClick={setLink} className={btnClass(editor.isActive('link'))}>🔗</button>
      <button type="button" onClick={addImage} className={btnClass(false)}>🖼️</button>
    </div>
  );
};

export default function NewsletterEditor({ onSubmit, initialData, isLoading }: NewsletterEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [uploading, setUploading] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.configure({ openOnClick: false }),
      Image.configure({ inline: false }),
      TextAlign.configure({ types: ['heading', 'paragraph', 'image'] }),
    ],
    content: initialData?.contentHtml || initialData?.contentMarkdown || '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[500px] p-8 prose-img:rounded-lg prose-img:shadow-sm prose-a:text-blue-600',
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Toast: Start
    const toastId = toast.loading('Uploading cover image...');
    setUploading(true);
    
    const fd = new FormData();
    fd.append('image', file);

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const res = await fetch(`${apiUrl}/api/upload`, { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      
      setCoverImage(`${apiUrl}${data.imageUrl}`);
      toast.success('Cover image uploaded!', { id: toastId }); // Toast: Success
    } catch (err) {
      console.error(err);
      toast.error('Failed to upload image', { id: toastId }); // Toast: Error
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Please enter a headline');
    if (!editor || editor.isEmpty) return toast.error('Please write some content');

    // We don't toast success here because the parent component usually handles the redirect
    // But we can toast a "Saving..." status if we want
    onSubmit({
      title,
      slug,
      excerpt,
      status,
      coverImage,
      contentHtml: editor.getHTML(),
      template: 'default'
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12">
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
             <label className="block text-sm font-bold text-gray-700 mb-1">Cover Image</label>
             <input type="file" accept="image/*" onChange={handleImageUpload} disabled={uploading} className="text-sm" />
             {coverImage && ( <img src={coverImage} alt="Cover" className="mt-2 h-32 object-cover rounded border" /> )}
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-2">
         <div className="flex justify-between items-end">
            <label className="text-xl font-bold text-gray-800">Content</label>
         </div>
         <div className="bg-gray-100 p-4 rounded-lg border border-gray-200 min-h-[800px] flex justify-center">
            <div className="w-full max-w-[850px] bg-white shadow-lg min-h-[800px] flex flex-col rounded-sm">
               <MenuBar editor={editor} />
               <EditorContent editor={editor} className="flex-1" />
            </div>
         </div>
      </div>

      <div className="sticky bottom-4 z-20 flex justify-end gap-4">
         <div className="flex gap-4 bg-white/90 backdrop-blur p-2 rounded-lg shadow-xl border border-gray-200">
            <button type="button" onClick={() => window.history.back()} className="px-6 py-2 rounded font-semibold text-gray-700 hover:bg-gray-100">Cancel</button>
            <button type="submit" disabled={isLoading} className="px-8 py-2 rounded bg-[var(--brand-purple)] text-white font-bold hover:bg-black transition">{isLoading ? 'Saving...' : initialData ? 'Update' : 'Publish'}</button>
         </div>
      </div>
      <style jsx global>{`
        .ProseMirror { min-height: 500px; outline: none; }
        .ProseMirror blockquote { border-left: 4px solid #e5e7eb; padding-left: 1rem; font-style: italic; color: #4b5563; }
      `}</style>
    </form>
  );
}