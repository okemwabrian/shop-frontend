export async function openInNewTab(getUrl) {
  const tab = window.open('', '_blank')

  try {
    const { url } = await getUrl()
    if (tab) tab.location.href = url
    else window.location.href = url
  } catch (error) {
    if (tab) tab.close()
    throw error
  }
}
