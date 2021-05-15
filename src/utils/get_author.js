/**
 * quizドキュメントから、作者の情報を返す
 * @param {object} quizDoc - 作者のリファレンスが入っている間違え探し
 * @return {object} - 表示名、ツイッターID、アイコン画像が入ったオブジェクトを返す
*/

export async function getAuthor(quizDoc) {
  let authPath = quizDoc.data().authorRef
  if (!authPath)
    return null

  let authDoc = await authPath.get()
  return  {displayName: authDoc.data().displayName, twitterId: authDoc.data().twitterId, photoURL: authDoc.data().photoURL}
}
