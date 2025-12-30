'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus';
import StarterKit from '@tiptap/starter-kit';
import TiptapImage from '@tiptap/extension-image';
import TextAlign from '@tiptap/extension-text-align';
import { useState, useEffect } from 'react';
import NextImage from 'next/image';
import type { Editor } from '@tiptap/react';
import { toast } from 'sonner';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import CloudinaryImageButton from './CloudinaryImageButton';
import ImageLinkGenerator from './ImageLinkGenerator';
import DragDropImageUploader from './DragDropImageUploader';
import GalleryImageUploader from './GalleryImageUploader';

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
  idx: number;
  totalImages: number;
  onMoveUp: (idx: number) => void;
  onMoveDown: (idx: number) => void;
  onRemove: (idx: number) => void;
}

function SortableGalleryItem({ id, img, idx, totalImages, onMoveUp, onMoveDown, onRemove }: SortableGalleryItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-2 bg-gray-50 rounded border ${isDragging ? 'border-[var(--brand-purple)] shadow-lg' : 'border-gray-200 hover:border-gray-300'
        } transition-colors`}
    >
      {/* Drag handle */}
      <button
        type="button"
        className="cursor-grab active:cursor-grabbing p-1 text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
        </svg>
      </button>

      <div className="relative flex-shrink-0 w-12 h-12 rounded border border-gray-300 overflow-hidden">
        <NextImage src={img} alt={`Gallery image ${idx + 1}`} fill style={{ objectFit: 'cover' }} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-xs text-gray-700 font-semibold">Image {idx + 1}</p>
        <p className="text-xs text-gray-400">Click to view full size</p>
      </div>

      <div className="flex gap-1 flex-shrink-0">
        <button
          type="button"
          onClick={() => onMoveUp(idx)}
          disabled={idx === 0}
          className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move up"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onMoveDown(idx)}
          disabled={idx === totalImages - 1}
          className="p-1 rounded bg-blue-50 text-blue-600 hover:bg-blue-100 disabled:opacity-30 disabled:cursor-not-allowed"
          title="Move down"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => onRemove(idx)}
          className="p-1 rounded bg-red-50 text-red-600 hover:bg-red-100"
          title="Remove"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}

interface NewsletterEditorProps {
  onSubmit: (data: NewsletterData) => void;
  initialData?: NewsletterData | null;
  isLoading?: boolean;
}

const MenuBar = ({ editor }: { editor: Editor | null }) => {

  const [inputMode, setInputMode] = useState<'none' | 'link' | 'image'>('none');
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {

    // keep focus synced with the editor when input mode toggles
    if (inputMode === 'none') {
      editor?.commands.focus();
    }
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
      editor.chain().focus().insertContent([
        {
          type: 'image',
          attrs: {
            src: imageUrl,
            class: 'w-full block mb-4 rounded-lg'
          }
        },
        { type: 'paragraph' }
      ]).run();
      toast.success('Image inserted from Cloudinary');
    }
  };

  if (!editor) return null;

  const handleInputSubmit = (e?: React.SyntheticEvent) => {

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


  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

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

      <button type="button" onClick={openLinkInput} className={btnClass(editor?.isActive?.('link') ?? false)} title="Add Link">🔗</button>
      <button type="button" onClick={openImageInput} className={btnClass(false)} title="Add Image">🖼️</button>
      <CloudinaryImageButton onImageInsert={handleCloudinaryImageInsert} />
    </div>
  );
};

export default function NewsletterEditor({ onSubmit, initialData, isLoading }: NewsletterEditorProps) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [slug, setSlug] = useState(initialData?.slug || '');
  const [excerpt, setExcerpt] = useState(initialData?.excerpt || '');
  const [status, setStatus] = useState(initialData?.status || 'draft');
  const [coverImage, setCoverImage] = useState(initialData?.coverImage || '');

  const [gallery, setGallery] = useState<string[]>(initialData?.gallery || []);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: { openOnClick: false },
      }),
      TiptapImage.extend({
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

  const handleAddGalleryImage = (url: string) => {
    setGallery(prevGallery => [...prevGallery, url]);
  };

  const removeGalleryImage = (index: number) => {
    const newGallery = [...gallery];
    newGallery.splice(index, 1);
    setGallery(newGallery);
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

  // Drag and drop handler
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = gallery.indexOf(active.id as string);
      const newIndex = gallery.indexOf(over.id as string);
      setGallery(arrayMove(gallery, oldIndex, newIndex));
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

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

      contentHtml: editor.getHTML()
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
            <label className="block text-sm font-bold text-gray-700 mb-3">Cover Image</label>
            <DragDropImageUploader
              onImageUpload={(url) => setCoverImage(url)}
              isLoading={isLoading}
            />
            {coverImage && (
              <div className="mt-4">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs text-gray-600 font-semibold">Current cover image:</p>
                  <button
                    type="button"
                    onClick={() => setCoverImage('')}
                    className="text-xs text-red-600 hover:text-red-800 font-semibold flex items-center gap-1 transition-colors"
                    title="Remove cover image"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Remove
                  </button>
                </div>
                <div className="h-40 w-full relative rounded-lg border-2 border-[var(--brand-purple)] overflow-hidden">
                  <NextImage
                    src={coverImage}
                    alt="Cover image preview"
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    style={{ objectFit: 'cover' }}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="pt-2 border-t border-gray-200 mt-2">
            <label className="block text-sm font-bold text-gray-700 mb-3">Gallery Images (Carousel)</label>
            <GalleryImageUploader
              onImageUpload={handleAddGalleryImage}
              isLoading={isLoading}
            />
            {gallery.length > 0 && (
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={gallery}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    <p className="text-xs text-gray-500 font-semibold">Drag or use arrows to reorder images:</p>
                    {gallery.map((img, idx) => (
                      <SortableGalleryItem
                        key={img}
                        id={img}
                        img={img}
                        idx={idx}
                        totalImages={gallery.length}
                        onMoveUp={moveGalleryImageUp}
                        onMoveDown={moveGalleryImageDown}
                        onRemove={removeGalleryImage}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            )}
          </div>
        </div>
      </div>

      {/* Editor Section */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-end">
          <label className="text-xl font-bold text-gray-800">Content</label>
        </div>

        <div className="bg-gray-100 p-2 md:p-4 rounded-lg border border-gray-200 min-h-[50vh] md:min-h-200 flex justify-center relative">
          <div className="w-full max-w-212.5 bg-white shadow-lg min-h-[50vh] md:min-h-200 flex flex-col rounded-sm">

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

          <button type="submit" disabled={isLoading} className="px-8 py-2 rounded bg-(--brand-purple) text-white font-bold hover:bg-black transition">{isLoading ? 'Saving...' : initialData ? 'Update' : 'Publish'}</button>
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