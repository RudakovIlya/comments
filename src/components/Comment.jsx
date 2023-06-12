import {CommentForm} from "./CommentForm.jsx";

export const Comment = ({
                          comment,
                          replies,
                          currentUserId,
                          deleteComment,
                          updateComment,
                          addComment,
                          activeComment,
                          setActiveComment,
                          parentId = null,
                        }) => {
  const fiveMinutes = 30000
  const timePassed = new Date() - new Date(comment.createdAt) > fiveMinutes
  const canReply = Boolean(currentUserId)

  const canEdit = currentUserId === comment.userId && !timePassed
  const canDelete = currentUserId === comment.userId && !timePassed
  const createdAt = new Date(comment.createdAt).toLocaleDateString()

  const isReplying =
    activeComment &&
    activeComment.type === 'replying' &&
    activeComment.id === comment.id

  const isEditing =
    activeComment &&
    activeComment.type === 'editing' &&
    activeComment.id === comment.id

  const replyId = parentId ? parentId : comment.id

  return (
    <div className={'comment'}>
      <div className={'comment-image-container'}>
        <img src="/user-icon.png" alt="user-image"/>
      </div>
      <div className={'comment-right-part'}>
        <div className={'comment-content'}>
          <div className="comment-author">{comment.username}</div>
          <div>{createdAt}</div>
        </div>
        {!isEditing && <div className={'comment-text'}>{comment.body}</div>}
        {isEditing && <CommentForm submitLabel={'Update'} hasCancelButton initialText={comment.body} handleSubmit={(text) => updateComment(text, comment.id)} handleCancel={() => setActiveComment(null)}/> }
        <div className="comment-actions">
          {canReply && <button className="comment-action" onClick={() => {
            setActiveComment({id: comment.id, type: 'replying'})
          }}>Reply</button>}
          {canEdit && <button className="comment-action" onClick={() => {
            setActiveComment({id: comment.id, type: 'editing'})
          }}>Edit</button>}
          {canDelete && <button className="comment-action" onClick={() => deleteComment(comment.id)}>Delete</button>}
        </div>
        {isReplying && (
          <CommentForm submitLabel={'Reply'} handleSubmit={(text) => addComment(text, replyId)}/>
        )}
        {replies.length > 0 && (
          <div className={'replies'}>
            {
              replies.map(reply => (
                <Comment
                  comment={reply}
                  key={reply.id}
                  replies={[]}
                  currentUserId={currentUserId}
                  deleteComment={deleteComment}
                  activeComment={activeComment}
                  addComment={addComment}
                  setActiveComment={setActiveComment}
                  parentId={comment.id}
                  updateComment={updateComment}
                />
              ))
            }
          </div>
        )}
      </div>
    </div>
  )
};
