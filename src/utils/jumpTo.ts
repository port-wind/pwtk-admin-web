function jumpTo(url: string) {
  if (typeof window !== 'undefined') {
    window.location.href = url
  }
}

export default jumpTo
