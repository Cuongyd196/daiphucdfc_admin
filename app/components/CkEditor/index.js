import React from 'react';

import CkEditorBase from './ckeditor';

export default function CkEditor({ value, onChange, ...props }) {
  return (
		<CkEditorBase
			{...props}
			data={value} 
			onChange={({ editor }) => {
				const data = editor.getData();
				return data;
			}}
		/>
	);
}
