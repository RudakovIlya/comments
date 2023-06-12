import {useState} from "react";

export const CommentForm = ({handleSubmit, submitLabel, handleCancel, initialText = '', hasCancelButton = false}) => {
  const [text, setText] = useState(initialText)

  const isTextDisabled = text.length === 0

  const onSubmit = (event) => {
    event.preventDefault()
    handleSubmit(text)
    setText('')
  }

  return (
    <form onSubmit={onSubmit}>
      <textarea
        className={'comment-form-textarea'}
        value={text}
        onChange={e => setText(e.currentTarget.value)}
      />
      <button disabled={isTextDisabled} className={'comment-form-button'}>{submitLabel}</button>
      {
        hasCancelButton && (
          <button type={'button'} className={'comment-form-button comment-form-cancel-button '} onClick={handleCancel}>Cancel</button>
        )
      }
    </form>
  )
};
