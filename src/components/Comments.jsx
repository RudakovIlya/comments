import {useEffect, useState} from "react";
import {
  createComment as createCommentApi,
  deleteComment as deleteCommentApi,
  getComments as getCommentsApi,
  updateComment as updateCommentApi
} from "../utils/getComments.js";
import {Comment} from "./Comment.jsx";
import {CommentForm} from "./CommentForm.jsx";

export const Comments = ({currentUserId}) => {
  const [backComments, setBackComments] = useState([])
  const [activeComment, setActiveComment] = useState(null)
  /*
  rootComments:
  * Комментарии первого уровня
  * Если у комментария parentId === null, значит, что он не является "реплаем"
  * */

  const rootComments = backComments.filter(comment => comment.parentId === null)

  /*
    getReplies:
    * Получаем ответы на комментарии
    * Тут примерно то же самое, но мы оставляем только те комменты, у которых есть parentId
    * и сортируем по полю даты, что бы комменты новые "реплаи" были снизу.
*/

  const getReplies = commentId => {
    return backComments.filter(comment => comment.parentId === commentId).sort((a, b) => {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    })
  }

  const addComment = (text, parentId) => {
    createCommentApi(text, parentId).then(data => {
      setBackComments(prevState => [data, ...prevState])
      setActiveComment(null)
    })
  }

  const updateComment = (text, commentId) => {
    updateCommentApi(text).then(() => {
      const updateComments = backComments.map(comment => comment.id === commentId ? {...comment, body:text} : comment)
      setBackComments(updateComments)
      setActiveComment(null)
    })
  }

  const deleteComment = (commentId) => {
    if (window.confirm('Уверен, что хочешь удалить комментарий?!')) {
      deleteCommentApi(commentId).then(() => {
        const updateComments = backComments.filter(comment => comment.id !== commentId)
        setBackComments(updateComments)
      })
    }

  }

  useEffect(() => {
    // Получение постов
    getCommentsApi().then(data => {
      setTimeout(() => {
        setBackComments(data)
      }, 1500)
    })
  }, [])

  return (
    <div className={'comments'}>
      <h3 className={'comments-title'}>Comments</h3>
      <div className={'comment-form-title'}>Write Comment</div>
      <CommentForm submitLabel={'Write'} handleSubmit={addComment}/>
      <div className={'comments-container'}>
        {
          rootComments.map(rootComment => (
            <Comment
              key={rootComment.id}
              comment={rootComment}
              deleteComment={deleteComment}
              currentUserId={currentUserId}
              updateComment={updateComment}
              replies={getReplies(rootComment.id)}
              activeComment={activeComment}
              setActiveComment={setActiveComment}
              addComment={addComment}
            />
          ))
        }
      </div>
    </div>
  )
};
