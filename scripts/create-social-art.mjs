import { readFileSync, writeFileSync } from 'node:fs';
const image = (name, x, y, width, height) => `<image href="data:image/svg+xml;base64,${readFileSync(`public/media/${name}.svg`).toString('base64')}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice"/>`;
const wrap = content => `<svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1200" viewBox="0 0 1000 1200">${content}</svg>`;
const label = (text, x, y, color = '#e3e6e4', size = 17) => `<text x="${x}" y="${y}" fill="${color}" font-family="Arial,sans-serif" font-size="${size}" letter-spacing="3">${text}</text>`;
const title = (text, x, y, size, color = '#e3e6e4') => `<text x="${x}" y="${y}" fill="${color}" font-family="Georgia,serif" font-size="${size}" letter-spacing="-5">${text}</text>`;
writeFileSync('public/media/social-journal.svg', wrap(`<rect width="1000" height="1200" fill="#50552d"/>${label('THE EVERYDAY EDIT / 001',65,70)}<path d="M65 105H935" stroke="#e3e6e4" opacity=".4"/>${title('A visual',65,230,130)}${title('journal.',65,370,130)}${image('still-life',65,435,870,610)}${label('SMALL OBSERVATIONS. NEW PERSPECTIVES.',65,1110)}${label('DESIGN PREVIEW',65,1160,'#e3e6e4',12)}`));
writeFileSync('public/media/social-notes.svg', wrap(`<rect width="1000" height="1200" fill="#e3e6e4"/>${label('NOTES FROM THE EVERYDAY / 002',65,70,'#50552d')}${image('coast',560,125,380,370)}${title('Notice',60,620,145,'#080e0e')}${title('the little',60,785,145,'#080e0e')}${title('things.',60,950,145,'#50552d')}<path d="M65 1030H935" stroke="#50552d"/>${label('A SAMPLE CONTENT SERIES',65,1100,'#50552d')}${label('DESIGN PREVIEW',65,1150,'#50552d',12)}`));
let grid = '<rect width="1000" height="1200" fill="#080e0e"/>' + label('A SLOWER FEED / CONTENT STUDY',45,75);
const names = ['coast','still-life','window','hills','dunes'];
for(let i=0;i<9;i++) {
  const x=45+(i%3)*307, y=145+Math.floor(i/3)*307;
  grid += i%3===1 ? `<rect x="${x}" y="${y}" width="296" height="296" fill="${i===4?'#50552d':'#e3e6e4'}"/>${title(i===4?'pause.':'a little',x+27,y+133,53,i===4?'#e3e6e4':'#080e0e')}${label(i===4?'TAKE A MOMENT':'EVERYDAY POETRY',x+27,y+182,i===4?'#e3e6e4':'#50552d',10)}` : image(names[i%5],x,y,296,296);
}
grid += label('01 / IMAGE     02 / NOTE     03 / DETAIL',45,1120) + label('DESIGN PREVIEW — NO LIVE ACCOUNT',45,1160,'#a18e7c',12);
writeFileSync('public/media/social-grid.svg',wrap(grid));
writeFileSync('public/media/collab.svg',wrap(`<rect width="1000" height="1200" fill="#e3e6e4"/>${label('SHARED PERSPECTIVES / EDITORIAL STUDY',45,65,'#50552d',14)}${image('window',45,110,545,960)}${image('hills',620,110,335,460)}${image('still-life',620,595,335,475)}${label('DIFFERENT MINDS. SHARED VISION.',45,1130,'#50552d')}${label('DESIGN PREVIEW / NO COLLABORATORS ATTACHED',45,1170,'#50552d',11)}`));
