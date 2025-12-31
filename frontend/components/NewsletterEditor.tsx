'use client';

import { useEditor, EditorContent, type Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus'; // Fixed import path for Tiptap v3
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Subscript from '@tiptap/extension-subscript';
import Superscript from '@tiptap/extension-superscript';
import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import { toast } from 'sonner';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, horizontalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
  Bold, Italic, Underline, Strikethrough, Highlighter,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote,
  Link as LinkIcon, Image as ImageIcon, Minus,
  Heading1, Heading2, Heading3, Undo, Redo,
  Subscript as SubIcon, Superscript as SuperIcon,
  ArrowLeft, ArrowRight, Trash2, Copy, Check
} from 'lucide-react';

import CloudinaryImageButton from './CloudinaryImageButton';
import DragDropImageUploader from './DragDropImageUploader';
import GalleryImageUploader from './GalleryImageUploader';

// --- Types & SortableGalleryItem ---
interface NewsletterData {
  title?: string;
  slug?: string;
  excerpt?: string;
  status?: string;
  coverImage?: string;
  gallery?: string[];
  contentHtml?: string;
  contentMarkdown?: string;
}

interface SortableGalleryItemProps {
  id: string;
  img: string;
  filename?: string;
  idx: number;
  totalImages: number;
  isSelected: boolean;
  onSelect: () => void;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
  onRemove: (idx: number) => void;
}

function SortableGalleryItem({ id, img, filename, idx, totalImages, isSelected, onSelect, onMoveUp, onMoveDown, onRemove }: SortableGalleryItemProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className={`relative group w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${isSelected ? 'border-[var(--brand-purple)] ring-2 ring-[var(--brand-purple)]/20' : 'border-gray-200 hover:border-gray-300'}`}>
      <div className="absolute inset-0 cursor-pointer" onClick={onSelect}>
        <NextImage src={img} alt={`Gallery image ${idx + 1}`} fill style={{ objectFit: 'cover' }} />
      </div>

      {/* Controls Overlay */}
      <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-sm p-1 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onMoveUp(idx); }}
          disabled={idx === 0}
          className={`p-1 rounded text-white hover:bg-white/20 disabled:opacity-30 ${idx === 0 ? 'invisible' : ''}`}
        >
          <ArrowLeft size={14} />
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onRemove(idx); }}
          className="p-1 rounded text-red-400 hover:bg-white/20 hover:text-red-300"
        >
          <Trash2 size={14} />
        </button>

        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onMoveDown(idx); }}
          disabled={idx === totalImages - 1}
          className={`p-1 rounded text-white hover:bg-white/20 disabled:opacity-30 ${idx === totalImages - 1 ? 'invisible' : ''}`}
        >
          <ArrowRight size={14} />
        </button>
      </div>

      {/* Drag Handle (Top Right) */}
      <div className="absolute top-1 right-1 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 p-1 rounded bg-black/40 text-white" {...attributes} {...listeners}>
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" /></svg>
      </div>
    </div>
  );
}
// ---------------------------------------------------------------------------

const MenuBar = ({ editor }: { editor: Editor | null }) => {
  const [inputMode, setInputMode] = useState<'none' | 'link' | 'image'>('none');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (inputMode === 'none') editor?.commands.focus();
  }, [inputMode, editor]);

  const openLinkInput = () => {
    const previousUrl = editor?.getAttributes('link')?.href || '';
    setInputValue(previousUrl);
    setInputMode('link');
  };

  const openImageInput = () => {
    setInputValue('');
    setInputMode('image');
  };

  const handleCloudinaryImageInsert = (imageUrl: string) => {
    if (editor) {
      editor.chain().focus().insertContent([{ type: 'image', attrs: { src: imageUrl, class: 'w-full block mb-4 rounded-lg' } }, { type: 'paragraph' }]).run();
      toast.success('Image inserted from Cloudinary');
    }
  };

  if (!editor) return null;

  const handleInputSubmit = (e?: React.SyntheticEvent) => {
    if (e) e.preventDefault();
    if (!inputValue.trim()) { closeInput(); return; }

    if (inputMode === 'image') {
      editor.chain().focus().insertContent([{ type: 'image', attrs: { src: inputValue, class: 'w-full block mb-4 rounded-lg' } }, { type: 'paragraph' }]).run();
      toast.success('Image inserted');
    } else if (inputMode === 'link') {
      editor.chain().focus().extendMarkRange('link').setLink({ href: inputValue }).run();
      toast.success('Link added');
    }
    closeInput();
  };

  const closeInput = () => { setInputMode('none'); setInputValue(''); };
  const removeLink = () => { editor.chain().focus().unsetLink().run(); closeInput(); };

  // Helper for button styling
  const btnClass = (isActive: boolean, disabled: boolean = false) =>
    `p-1.5 md:p-2 rounded-md transition-all duration-200 flex items-center justify-center min-w-[32px] md:min-w-[36px]
    ${disabled ? 'opacity-30 cursor-not-allowed text-gray-400' : ''}
    ${!disabled && isActive
      ? 'bg-[var(--brand-purple)] text-white shadow-md transform scale-105'
      : !disabled && 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 active:bg-gray-200'
    }`;

  const Divider = () => <div className="w-px h-6 md:h-8 bg-gray-200 mx-1 self-center"></div>;

  // Input Mode UI (Link/Image URL)
  if (inputMode !== 'none') {
    return (
      <div className="border-b border-gray-200 bg-gray-50 p-2 sticky top-0 z-10 flex gap-2 items-center animate-in fade-in slide-in-from-top-1 duration-200">
        <span className="text-xs font-bold text-gray-500 uppercase tracking-wide hidden md:block">
          {inputMode === 'image' ? 'Insert Image' : 'Edit Link'}
        </span>
        <div className="flex-1 flex gap-2">
          <input
            autoFocus
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={inputMode === 'image' ? "Paste image URL..." : "Paste link URL..."}
            className="flex-1 px-3 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:border-[var(--brand-purple)]"
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleInputSubmit(); } else if (e.key === 'Escape') closeInput(); }}
          />
          <button type="button" onClick={handleInputSubmit} className="px-3 py-1 bg-[var(--brand-purple)] text-white text-xs font-bold rounded">Apply</button>
          <button type="button" onClick={closeInput} className="px-3 py-1 bg-white border border-gray-300 text-gray-700 text-xs font-bold rounded hover:bg-gray-100">Cancel</button>
          {inputMode === 'link' && editor.isActive('link') && (
            <button type="button" onClick={removeLink} className="px-3 py-1 bg-red-50 border border-red-200 text-red-600 text-xs font-bold rounded hover:bg-red-100">Unlink</button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="border-b border-gray-200 bg-white p-2 md:p-3 sticky top-0 z-10 flex flex-wrap gap-1 md:gap-2 items-center shadow-sm">

      {/* History */}
      <div className="flex gap-0.5">
        <button type="button" onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} className={btnClass(false, !editor.can().undo())} title="Undo">
          <Undo size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} className={btnClass(false, !editor.can().redo())} title="Redo">
          <Redo size={18} />
        </button>
      </div>

      <Divider />

      {/* Headings */}
      <div className="flex gap-0.5">
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()} className={btnClass(editor.isActive('heading', { level: 1 }))} title="Title (H1)">
          <Heading1 size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()} className={btnClass(editor.isActive('heading', { level: 2 }))} title="Subtitle (H2)">
          <Heading2 size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()} className={btnClass(editor.isActive('heading', { level: 3 }))} title="Section (H3)">
          <Heading3 size={18} />
        </button>
      </div>

      <Divider />

      {/* Basic Formatting */}
      <div className="flex gap-0.5 flex-wrap">
        <button type="button" onClick={() => editor.chain().focus().toggleBold().run()} className={btnClass(editor.isActive('bold'))} title="Bold">
          <Bold size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleItalic().run()} className={btnClass(editor.isActive('italic'))} title="Italic">
          <Italic size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleUnderline().run()} className={btnClass(editor.isActive('underline'))} title="Underline">
          <Underline size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleStrike().run()} className={btnClass(editor.isActive('strike'))} title="Strikethrough">
          <Strikethrough size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleHighlight().run()} className={btnClass(editor.isActive('highlight'))} title="Highlight">
          <Highlighter size={18} />
        </button>
      </div>

      <Divider />

      {/* Script */}
      <div className="flex gap-0.5 hidden md:flex">
        <button type="button" onClick={() => editor.chain().focus().toggleSubscript().run()} className={btnClass(editor.isActive('subscript'))} title="Subscript">
          <SubIcon size={16} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleSuperscript().run()} className={btnClass(editor.isActive('superscript'))} title="Superscript">
          <SuperIcon size={16} />
        </button>
      </div>

      <Divider />

      {/* Alignment */}
      <div className="flex gap-0.5">
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('left').run()} className={btnClass(editor.isActive({ textAlign: 'left' }))} title="Align Left">
          <AlignLeft size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('center').run()} className={btnClass(editor.isActive({ textAlign: 'center' }))} title="Align Center">
          <AlignCenter size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('right').run()} className={btnClass(editor.isActive({ textAlign: 'right' }))} title="Align Right">
          <AlignRight size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().setTextAlign('justify').run()} className={btnClass(editor.isActive({ textAlign: 'justify' }))} title="Justify">
          <AlignJustify size={18} />
        </button>
      </div>

      <Divider />

      {/* Lists */}
      <div className="flex gap-0.5">
        <button type="button" onClick={() => editor.chain().focus().toggleBulletList().run()} className={btnClass(editor.isActive('bulletList'))} title="Bullet List">
          <List size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleOrderedList().run()} className={btnClass(editor.isActive('orderedList'))} title="Numbered List">
          <ListOrdered size={18} />
        </button>
        <button type="button" onClick={() => editor.chain().focus().toggleBlockquote().run()} className={btnClass(editor.isActive('blockquote'))} title="Quote">
          <Quote size={18} />
        </button>
      </div>

      <Divider />

      {/* Inserts */}
      <div className="flex gap-0.5">
        <button type="button" onClick={openLinkInput} className={btnClass(editor?.isActive?.('link') ?? false)} title="Link">
          <LinkIcon size={18} />
        </button>
        <button type="button" onClick={openImageInput} className={btnClass(false)} title="Image URL">
          <ImageIcon size={18} />
        </button>
        <div title="Upload Image"><CloudinaryImageButton onImageInsert={handleCloudinaryImageInsert} /></div>
        <button type="button" onClick={() => editor.chain().focus().setHorizontalRule().run()} className={btnClass(false)} title="Horizontal Line">
          <Minus size={18} />
        </button>
      </div>
    </div>
  );
};

export default function NewsletterEditor({ onSubmit, initialData, isLoading }: { onSubmit: (data: NewsletterData) => void; initialData?: NewsletterData | null; isLoading?: boolean; }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');
  const [coverFileName, setCoverFileName] = useState<string>('');
  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);
  const [imageMetadata, setImageMetadata] = useState<Record<string, { filename: string }>>({});
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [enlargedImage, setEnlargedImage] = useState<string | null>(null);

  // Set initial preview when gallery loads
  useEffect(() => {
    if (gallery.length > 0 && !previewImage) {
      setPreviewImage(gallery[0]);
    }
  }, [gallery, previewImage]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false },
        heading: { levels: [1, 2, 3] },
      }),
      TiptapImage.extend({
        addAttributes() {
          return {
            ...this.parent?.(),
            class: {
              default: 'w-full block mb-4 rounded-lg',
              parseHTML: element => element.getAttribute('class'),
              renderHTML: attributes => ({ class: attributes.class }),
            },
          }
        },
      }).configure({ inline: true }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Highlight,
      Subscript,
      Superscript,
    ],
    content: initialData?.contentHtml || initialData?.contentMarkdown || '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg max-w-none focus:outline-none min-h-[50vh] md:min-h-[600px] p-8 md:p-12 prose-img:rounded-lg prose-img:shadow-sm prose-a:text-blue-600 prose-headings:font-bold prose-headings:text-gray-900 bg-white shadow-sm',
      },
    },
    immediatelyRender: false,
  });

  // ... Handlers ...
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    if (!initialData) {
      setSlug(val.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-'));
    }
  };

  const handleAddGalleryImage = (url: string, filename: string) => {
    setGallery(prev => [...prev, url]);
    setImageMetadata(prev => ({ ...prev, [url]: { filename } }));
    if (!previewImage) setPreviewImage(url);
  };

  const removeGalleryImage = (index: number) => {
    const urlToRemove = gallery[index];
    const newGallery = gallery.filter((_, i) => i !== index);
    setGallery(newGallery);

    // If we removed the preview image, set a new one
    if (previewImage === urlToRemove) {
      setPreviewImage(newGallery[0] || null);
    }
  };

  const moveGalleryImageUp = (index: number) => {
    if (index === 0) return;
    const newGallery = [...gallery];
    [newGallery[index - 1], newGallery[index]] = [newGallery[index], newGallery[index - 1]];
    setGallery(newGallery);
  };

  const moveGalleryImageDown = (index: number) => {
    if (index === gallery.length - 1) return;
    const newGallery = [...gallery];
    [newGallery[index], newGallery[index + 1]] = [newGallery[index + 1], newGallery[index]];
    setGallery(newGallery);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = gallery.indexOf(active.id as string);
      const newIndex = gallery.indexOf(over.id as string);
      setGallery(arrayMove(gallery, oldIndex, newIndex));
    }
  };

  const sensors = useSensors(useSensor(PointerSensor), useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return toast.error('Please enter a headline');
    if (!editor || editor.isEmpty) return toast.error('Please write some content');
    onSubmit({ title, slug, excerpt, status, coverImage, gallery, contentHtml: editor.getHTML() });
  };

  const setImgLeft = () => editor?.chain().focus().updateAttributes('image', { class: 'float-left mr-6 mb-4 max-w-[50%] rounded-lg' }).run();
  const setImgRight = () => editor?.chain().focus().updateAttributes('image', { class: 'float-right ml-6 mb-4 max-w-[50%] rounded-lg' }).run();
  const setImgCenter = () => editor?.chain().focus().updateAttributes('image', { class: 'block mx-auto mb-4 rounded-lg' }).run();
  const setImgFull = () => editor?.chain().focus().updateAttributes('image', { class: 'w-full block mb-4 rounded-lg' }).run();

  return (
    <form onSubmit={handleSubmit} className="space-y-8 pb-12 max-w-7xl mx-auto">
      {/* Top Meta Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Headline</label>
            <input type="text" value={title} onChange={handleTitleChange} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-purple)] focus:outline-none" placeholder="Newsletter Headline" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Slug</label>
            <input type="text" value={slug} onChange={(e) => setSlug(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded font-mono text-sm bg-gray-50" />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-1">Summary</label>
            <textarea value={excerpt} onChange={(e) => setExcerpt(e.target.value)} rows={3} className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[var(--brand-purple)] focus:outline-none" />
          </div>
          <div className="pt-2 border-t border-gray-200 mt-2">
            <label className="block text-sm font-bold text-gray-700 mb-3">Carousel Images</label>

            <GalleryImageUploader onImageUpload={handleAddGalleryImage} isLoading={isLoading} />

            {/* Reorder Images */}
            {gallery.length > 0 && (
              <div className="mt-4">
                <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Reorder Images</label>
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={gallery} strategy={horizontalListSortingStrategy}>
                    <div className="flex flex-wrap gap-2">
                      {gallery.map((img, idx) => (
                        <SortableGalleryItem
                          key={img}
                          id={img}
                          img={img}
                          filename={imageMetadata[img]?.filename}
                          idx={idx}
                          totalImages={gallery.length}
                          isSelected={previewImage === img}
                          onSelect={() => setPreviewImage(img)}
                          onMoveUp={moveGalleryImageUp}
                          onMoveDown={moveGalleryImageDown}
                          onRemove={removeGalleryImage}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>
            )}
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
            <label className="block text-sm font-bold text-gray-700 mb-3">Cover Image</label>
            <DragDropImageUploader
              onImageUpload={(url, filename) => {
                setCoverImage(url);
                if (filename) setCoverFileName(filename);
              }}
              isLoading={isLoading}
            />
            {coverImage && (
              <div className="mt-4 space-y-2">
                <div
                  className="h-40 w-full relative rounded-lg border-2 border-[var(--brand-purple)] overflow-hidden cursor-pointer hover:opacity-95 transition-opacity"
                  onClick={() => window.open(coverImage, '_blank')}
                  title="Click to open full image"
                >
                  <NextImage src={coverImage} alt="Cover" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="flex justify-between items-center px-1">
                  <button type="button" onClick={() => { setCoverImage(''); setCoverFileName(''); }} className="text-xs text-red-600 font-bold hover:underline">Remove Cover Image</button>
                  {coverFileName && (
                    <p className="text-xs font-medium text-gray-500 truncate max-w-[60%]" title={coverFileName}>
                      {coverFileName}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Gallery Preview */}
          {gallery.length > 0 && previewImage && (
            <div className="pt-4 border-t border-gray-200 mt-4">
              <label className="block text-sm font-bold text-gray-700 mb-2">Image Preview</label>

              <div className="p-3 bg-gray-50 rounded-lg border flex gap-3">
                <div
                  className="relative w-24 h-24 flex-shrink-0 bg-white rounded border border-gray-200 overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => setEnlargedImage(previewImage)}
                  title="Click to enlarge"
                >
                  <NextImage src={previewImage} alt="Preview" fill style={{ objectFit: 'cover' }} />
                </div>
                <div className="flex-1 min-w-0 space-y-1.5">
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Original File Name</span>
                    <p className="text-sm font-medium text-gray-900 truncate" title={imageMetadata[previewImage]?.filename || 'Existing Image'}>
                      {imageMetadata[previewImage]?.filename || 'Existing Image'}
                    </p>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-gray-500 uppercase">Cloudinary URL</span>
                    <div className="flex gap-2">
                      <input type="text" readOnly value={previewImage} className="flex-1 text-xs px-2 py-1 bg-white border border-gray-300 rounded text-gray-500" />
                      <button
                        type="button"
                        onClick={() => { navigator.clipboard.writeText(previewImage); toast.success('URL copied!'); }}
                        className="p-1.5 bg-white border border-gray-300 rounded hover:bg-gray-100 text-gray-600"
                        title="Copy URL"
                      >
                        <Copy size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Editor Section */}
      <div className="flex flex-col gap-2">
        <label className="text-xl font-bold text-gray-800 px-1">Content</label>
        {/* Main Editor Container */}
        <div className="bg-gray-100 p-4 md:p-8 rounded-xl border border-gray-200 min-h-[500px] flex justify-center">
          <div className="w-full max-w-4xl bg-white shadow-xl rounded-sm min-h-[800px] flex flex-col">
            <MenuBar editor={editor} />
            {editor && (
              <BubbleMenu
                editor={editor}
                shouldShow={({ editor }) => {
                  if (!editor || editor.isDestroyed || !editor.view) return false;
                  return editor.isActive('image');
                }}
                className="flex gap-1 bg-white border border-gray-200 shadow-xl rounded-lg p-1"
              >
                <button type="button" onClick={setImgLeft} className="p-2 hover:bg-gray-100" title="Float Left">⬅️</button>
                <button type="button" onClick={setImgCenter} className="p-2 hover:bg-gray-100" title="Center">⬇️</button>
                <button type="button" onClick={setImgRight} className="p-2 hover:bg-gray-100" title="Float Right">➡️</button>
                <button type="button" onClick={setImgFull} className="p-2 hover:bg-gray-100" title="Full Width">↔️</button>
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
          <button type="submit" disabled={isLoading} className="px-8 py-2 rounded bg-[var(--brand-purple)] text-white font-bold hover:bg-black transition shadow-lg transform active:scale-95">
            {isLoading ? 'Saving...' : initialData ? 'Update Newsletter' : 'Publish Newsletter'}
          </button>
        </div>
      </div>

      {/* Enlarged Image Modal */}
      {enlargedImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setEnlargedImage(null)}
        >
          <div className="relative max-w-7xl max-h-[90vh] w-full h-full flex items-center justify-center">
            <button
              type="button"
              onClick={() => setEnlargedImage(null)}
              className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white backdrop-blur-sm transition-all z-10"
              title="Close"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <div className="relative w-full h-full">
              <NextImage
                src={enlargedImage}
                alt="Enlarged preview"
                fill
                style={{ objectFit: 'contain' }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>
          </div>
        </div>
      )}

      <style jsx global>{`
        /* Highlight Color */
        mark {
          background-color: #fef08a; /* Yellow-200 */
          padding: 0.1rem 0.2rem;
          border-radius: 0.2rem;
        }
        /* Editor Canvas improvements */
        .ProseMirror {
          min-height: 500px;
          outline: none;
        }
        .ProseMirror p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: #adb5bd;
          pointer-events: none;
          height: 0;
        }
      `}</style>
    </form>
  );
}