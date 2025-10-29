export default function (nickName?: string | null, userId?: string | null) {
  const result = nickName || `用户${userId?.slice(-4) || '-'}`
  return result
}
