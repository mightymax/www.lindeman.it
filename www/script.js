// @ts-nocheck
function hexToRgb(hex) {
    const bigint = hex.length === 3 ? parseInt(hex.replace(/^#/, '').split('').map(hexChar => hexChar + hexChar).join(''), 16) : parseInt(hex.replace(/^#/, ''), 16);
    return [(bigint >> 16) & 255, (bigint >> 8) & 255, bigint & 255];
}
function setColor (primary, secondary) {
  if (Array.isArray(primary)) [primary, secondary] = primary
  const d = new Date();
  d.setTime(d.getTime() + (30*24*60*60*1000));
  document.cookie = `palette=${primary},${secondary};expires=${d.toUTCString()};path=/`

  document.documentElement.setAttribute(
    "style",
    `--bs-primary-rgb: ${hexToRgb(primary).join(',')};
      --bs-secondary-rgb: ${hexToRgb(secondary).join(',')}; `
  );
}
window.addEventListener('DOMContentLoaded', () => {
  const match = document.cookie.match(/palette=(#[a-f0-9]{6}),(#[a-f0-9]{6})/i)
  if (match) {
    const [_, hex1, hex2] = match
    setColor(hex1, hex2)
  }
})
window.onload = () => {
  [...document.querySelectorAll('[title]')].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl, {
    placement: 'bottom'
  }))


  const colors = []
  fetch('colors.csv')
    .then(res => res.text())
    .then(csv => {
      const colorPairs = document.getElementById('colorPairs')
      const lines = csv.split("\n");
      lines.shift()
      // NAME1,HEX1,HEX1a,NAME2,HEX2,HEX2a,RATIO,CODE
      // default color:
      lines.unshift('Black,#090000,#0e0000,Steel Blue,#487EA8,#73caff,4.8,AA')
      document.querySelector('.spinner-border').classList.add('d-none')
      for (const l in lines) {
        // if (l > 50) break
        const line = lines[l]
        const [name2, hex2, hex2a, name1, hex1, hex1a, ratio, code] = line.split(',')
        if (name1===undefined) continue
        colors.push([hex1, hex2])
        const picker = document.createElement('div')
        picker.classList.add('row', 'mb-1')
        picker.innerHTML = `
          <div class="col-6 pt-2 pb-2 border border-black border-end-0 rounded-start-1" style="background-color:${hex1}; color:${hex2}">${name1}</div>
          <div class="col-6 pt-2 pb-2 border border-black border-start-0 rounded-end-1" style="background-color:${hex2}; color:${hex1}">${name2}</div>
        `
        picker.addEventListener('click', (ev) => setColor(hex1, hex2))
        colorPairs.appendChild(picker)
      }
    })

    document.getElementById('randomColor').addEventListener('click', (ev) => setColor(colors[Math.floor(Math.random() * colors.length)]))
}
