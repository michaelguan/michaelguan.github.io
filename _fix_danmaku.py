c = open('index.html', 'r', encoding='utf-8').read()

old_block = '<div class="topbar-danmaku" aria-label="弹幕">\n <span class="danmaku-track" aria-hidden="true">\n <span class="danmaku-item">身在世间，心游物外。</span>\n <span class="danmaku-item">事来则应，事去则空。</span>\n <span class="danmaku-item">宠辱不惊，去留无意。</span>\n </span>\n </div>'

new_block = '<div class="topbar-danmaku" aria-label="弹幕">\n <span class="danmaku-track" aria-hidden="true">\n <span class="danmaku-item">身在世间，心游物外。</span>\n <span class="danmaku-item">事来则应，事去则空。</span>\n <span class="danmaku-item">宠辱不惊，去留无意。</span>\n </span>\n <span class="danmaku-track" aria-hidden="true">\n <span class="danmaku-item">淡泊明志，宁静致远。</span>\n </span>\n </div>'

assert old_block in c, f"NOT FOUND: {repr(c[c.find('topbar-danmaku'):c.find('topbar-danmaku')+200])}"
c = c.replace(old_block, new_block, 1)
open('index.html', 'w', encoding='utf-8').write(c)
print('done')
