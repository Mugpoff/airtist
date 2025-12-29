export const toCdnUrl = (url: string) => {
  const index = url.indexOf("/images/")

  if (index === -1) return url

  return `/cdn${url.slice(index)}`
}
