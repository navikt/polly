

export const copyToClipboard = (text: string) => {
    const el = document.createElement('textarea')
    el.innerText = text
    document.body.appendChild(el)
    el.select()
    document.execCommand('copy')
    el.remove()
}