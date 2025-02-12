import React from 'react';

import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';

import BlotFormatter from 'quill-blot-formatter';
import ImageUploader from 'quill-image-uploader';

import { uploadImages } from '@services/uploadServices';
import {API} from "@api";

Quill.register('modules/blotFormatter', BlotFormatter, true);
Quill.register('modules/imageUploader', ImageUploader, true);

export default function QuillEditor({ value, modules, onChange, ...props }) {
  const memoizeModules = React.useMemo(() => ({
    toolbar: [
      [{ header: '1' }, { header: '2' }, { font: [] }],
      [{ size: [] }],
      ['bold', 'italic', 'underline', 'strike', 'blockquote'],
      [{ list: 'ordered' }, { list: 'bullet' }, { indent: '-1' }, { indent: '+1' }],
      ['link', 'image'],
      ['clean']
    ],
    blotFormatter: {},
    imageUploader: {
      upload: async file => {
        const images = await uploadImages([file]);
        return `${API.API_HOST}/api/files/${images[0]}`;
      }
    },
    ...modules,
  }), [modules]);

  return (
    <ReactQuill
      {...props}
      value={value}
      modules={memoizeModules}
      onChange={(value, delta, source, editor) => {
        if (source == 'user') {
          if (editor.getLength() > 1) {
            onChange(value);
          } else {
            onChange('');
          }
        }
      }}
    />
  );
}
