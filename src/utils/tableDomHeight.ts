const count = (top: HTMLElement) => {
  let height = 0
  if (top) {
    height = top?.getBoundingClientRect().height - 50
  }
  return height
}
export default count
