import CircleButton from "@/components/shared/CircleButton";
import { spoilerExtension } from "@/utils/editor";
import Mention from "@tiptap/extension-mention";
import Placeholder from "@tiptap/extension-placeholder";
import Underline from "@tiptap/extension-underline";
import { EditorContent, EditorOptions, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import classNames from "classnames";
import React, { useImperativeHandle, useRef, useState } from "react";
import {
  AiOutlineBold,
  AiOutlineEyeInvisible,
  AiOutlineItalic,
  AiOutlineOrderedList,
  AiOutlineSend,
  AiOutlineStrikethrough,
  AiOutlineUnderline,
  AiOutlineUnorderedList,
} from "react-icons/ai";
import { GrBlockQuote } from "react-icons/gr";
import { Editor as EditorType } from "@tiptap/react";
import CharacterCount from "@tiptap/extension-character-count";
import Image from '@tiptap/extension-image'
import { BiImageAdd } from "react-icons/bi";
import Modal, { ModalRef } from "@/components/shared/Modal";

import Button from "@/components/shared/Button";
import Input from "@/components/shared/Input";
import { useTranslation } from "next-i18next";
import { toast } from "react-toastify";
import ToggleButton from "./ToggleButton";

interface InsertImageProps  {
  onSubmit?: (url: string, size: string) => void;
  onClose: () => void;
}

const GetImageUrl: React.FC<InsertImageProps> = ({ onSubmit, onClose }) => {
  const modalRef = useRef<ModalRef>(null);
  const { t } = useTranslation("review");
  const [url, setUrl] = useState("");
  const [selectedButton, setSelectedButton] = useState<number | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>("img-sm");

  const size: string[] = ["img-sm", "img-md", "img-lg", "img-xl"]
  const handleButtonClick = (buttonIndex: number) => {
    setSelectedButton(buttonIndex === selectedButton ? null : buttonIndex);
    setSelectedSize(size[buttonIndex]);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUrl(e.target.value)
  };

  const handleSubmit = () => {
    if (!url) {
      toast.error(t("editor.insert_image"));

      return;
    }
    onClose();
    onSubmit?.(url, selectedSize);
  };

  return (
    <Modal
      className="md:w-1/3 w-11/12 bg-neutral-800"
      defaultValue={true}
      closeOnClickOutside={true}
      onClose={onClose}
      ref={modalRef}
    >
      <h1 className="text-2xl font-semibold mb-1">
        {t("get_image_title")}
      </h1>

      <Input
        onChange={handleInputChange}
        placeholder={"https://image.com/"}
        containerClassName="mb-8"
        className="px-2 py-3 cursor-pointer"
      />

    <div className="flex justify-center items-center">
      <div>Image Size:</div>
      <div className="flex items-center flex-row flex-wrap">
      <ToggleButton
          label="Small"
          selected={selectedButton === 0}
          onClick={() => handleButtonClick(0)}
        />
        <ToggleButton
          label="Medium"
          selected={selectedButton === 1}
          onClick={() => handleButtonClick(1)}
        />
        <ToggleButton
          label="Large"
          selected={selectedButton === 2}
          onClick={() => handleButtonClick(2)}
        />
        <ToggleButton
          label="X-Large"
          selected={selectedButton === 3}
          onClick={() => handleButtonClick(3)}
        />
      </div>
    </div>
      

      <Button className="cursor-pointer" onClick={handleSubmit} primary>
        Submit
      </Button>
    </Modal>
  );
};



export interface EditorProps extends Partial<EditorOptions> {
  defaultContent?: string;
  onSubmit?: (content: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  isLoading?: boolean;
  className?: string;
  containerProps?: React.HTMLAttributes<HTMLDivElement>;
  editorClassName?: string;
  textLimit?: number;
}


const Editor = React.forwardRef<EditorType, EditorProps>(
  (
    { textLimit,
      defaultContent,
      onSubmit,
      placeholder,
      readOnly,
      isLoading,
      className,
      editorClassName,
      ...editorOptions
    },
    ref
  ) => {
    const [showModal, setModalState] = useState(false);

    const handleImageInsert = (url: string, size: string) => {
      editor.chain().focus().setImage({ src: url }).run();
      document.querySelectorAll(".ProseMirror-selectednode").forEach(el => {
        el.classList.add(size);
      });
    }

    const limit = textLimit || 500;
    const editor = useEditor(
      {
        extensions: [
          StarterKit,
          Underline,
          Placeholder.configure({
            placeholder,
            emptyNodeClass:
              "first:before:h-0 first:before:text-gray-500 first:before:float-left first:before:content-[attr(data-placeholder)] first:before:pointer-events-none",
          }),
          Mention.configure({
            HTMLAttributes: {
              class:
                "py-1 bg-primary-800 rounded-md decoration-clone text-white font-semibold",
            },
          }),
          spoilerExtension(),
          CharacterCount.configure({
            limit
          }),
          Image
        ],
        content: defaultContent,
        editorProps: {
          attributes: {
            class: classNames(
              "!max-w-full prose prose-sm prose-invert focus:outline-none focus:border-none ",
              !readOnly && "min-h-[15rem]",
              editorClassName
            ),
          },
        },
        editable: !readOnly,
        ...editorOptions,

      },
      [placeholder, readOnly, defaultContent, editorClassName]
    );

    useImperativeHandle(ref, () => editor, [editor]);

    if (!editor) {
      return null
    }

    return (
      <div
        className={classNames(!readOnly && "border border-gray-600", className)}
      >
        {showModal ? (
          <GetImageUrl onSubmit={handleImageInsert} onClose={() => {setModalState(false)}} />
        ): ''}
        <EditorContent
          className={classNames(!readOnly && "p-4")}
          editor={editor}
        />

        {!readOnly && (
          <div className="p-2 flex flex-col md:flex-row justify-between border-t gap-2 border-gray-600">
            <div className="flex items-center md:gap-2 flex-wrap">
              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={BiImageAdd}
                onClick={() => {setModalState(true)}}
                title="Image Insert"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineBold}
                onClick={() => editor.chain().toggleBold().focus().run()}
                title="Bold"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineUnderline}
                onClick={() => editor.chain().toggleUnderline().focus().run()}
                title="Underline"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineItalic}
                onClick={() => editor.chain().toggleItalic().focus().run()}
                title="Italic"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineUnorderedList}
                onClick={() => editor.chain().toggleBulletList().focus().run()}
                title="Unordered list"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineOrderedList}
                onClick={() => editor.chain().toggleOrderedList().focus().run()}
                title="Ordered list"
              />

              {/* <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineStrikethrough}
                onClick={() => editor.chain().toggleStrike().focus().run()}
                title="Strikethrough"
              /> */}

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={GrBlockQuote}
                onClick={() => editor.chain().toggleBlockquote().focus().run()}
                title="Blockquote"
              />

              <CircleButton
                secondary
                className="text-gray-300"
                iconClassName="w-4 h-4"
                LeftIcon={AiOutlineEyeInvisible}
                onClick={() => editor.chain().setSpoiler().focus().run()}
                title="Spoil?"
              />
            </div>
            
           
           <div className="opacity-80 text-sm pt-2">
            <div className={editor.storage.characterCount.characters() < limit * .25 ? "text-emerald-500" : (editor.storage.characterCount.characters() < (limit * .95) ? "text-yellow-400" : "text-rose-400" )}>
              {editor.storage.characterCount.characters()}/{limit}
            </div>
           </div>

            {onSubmit && (
              <CircleButton
                className="ml-auto max-w-min text-primary-300"
                iconClassName="w-4 h-4"
                secondary
                shortcutKey="enter"
                onClick={() => {
                  if (editor.isEmpty) return;

                  const html = editor.getHTML();

                  onSubmit(html);
                }}
                isLoading={isLoading}
                disabled={editor?.isEmpty}
                LeftIcon={AiOutlineSend}
              />
            )}
          </div>
        )}
      </div>
      
    );
  }
);

Editor.displayName = "Editor";

export default Editor;
