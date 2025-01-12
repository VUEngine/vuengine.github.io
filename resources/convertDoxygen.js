const htmlParser = require('node-html-better-parser')
const fs = require('fs')
const path = require('path')

let htmlFolder = path.join(__dirname, '..', 'documentation', 'api')

// delete unwanted files
let toDelete = [
    'clipboard.js',
    'doxygen_crawl.html',
    'doc.svg',
    'docd.svg',
    'doxygen.css',
    'doxygen.svg',
    'dynsections.js',
    'folderclosed.svg',
    'folderclosedd.svg',
    'folderopen.svg',
    'folderopend.svg',
    'jquery.js',
    'menu.js',
    'menudata.js',
    'minus.svg',
    'minusd.svg',
    'nav_f.png',
    'nav_fd.png',
    'nav_g.png',
    'nav_h.png',
    'nav_hd.png',
    'navtree.css',
    'plus.svg',
    'plusd.svg',
    'resize.js',
    'splitbar.png',
    'splitbard.png',
    'sync_off.png',
    'sync_on.png',
    'tab_a.png',
    'tab_ad.png',
    'tab_b.png',
    'tab_bd.png',
    'tab_h.png',
    'tab_hd.png',
    'tab_s.png',
    'tab_sd.png',
    'tabs.css',
]
toDelete.map(filename => {
    const fullPath = path.join(htmlFolder, filename)
    if (fs.existsSync(fullPath)) {
        if (fs.unlinkSync) {
            fs.unlinkSync(fullPath)
        } else if (fs.rmSync) {
            fs.rmSync(fullPath)
        }
    }
})

let dirCont = fs.readdirSync(htmlFolder)
let filenames = dirCont.filter(function (elm) {
	return elm.match(/.*\.(html)/ig)
})

const escapeCurlyBraces = (text) => {
    return text.replace(/{{/g, '{% raw %}{{{% endraw %}')
}

const updateFilenames = (filename) => {
    return path.parse(filename).name.replace(/_/g, '-')
}

filenames.map((filename) => {
    // get file body content
    const fullPath = path.join(htmlFolder, filename)
	const fileContent = fs.readFileSync(fullPath).toString()
    const html = htmlParser.parse(fileContent)
    const body = html?.querySelector('body')
    if (!body) {
        return
    }

    // remove unwanted parts
    body.querySelector('#titlearea')?.remove()
    body.querySelectorAll('.footer')?.forEach(el => el.remove())
    body.querySelectorAll('.permalink')?.forEach(el => el.remove())
    body.querySelectorAll('td.memSeparator')?.forEach(el => el.parentNode.remove())
    body.querySelectorAll('script')?.forEach(el => el.remove())
    body.querySelector('.summary')?.remove()
    
    // make header a h1
    const headerTitle = body.querySelector('.headertitle')
    let title = filename;
    if (headerTitle) {
        title = headerTitle.firstChild.innerHTML.split('<')[0]
        headerTitle.firstChild.tagName = 'h1'
    }

    // change all links
    body.querySelectorAll('a, area')?.forEach(el => {
        const href = el.attributes.href;
        if (href && !href.startsWith('#')) {
            el.setAttribute('href', '/documentation/api/' + updateFilenames(href) + '/')
        }
    })

    // adjust image paths
    body.querySelectorAll('img')?.forEach(el => {
        el.setAttribute('src', '../' + el.attributes.src)
    })

    // add bootstrap classes
    body.querySelectorAll('table')?.forEach(el => {
        el.setAttribute('class', [...el.classNames, 'table'].join(' '))
    })

    // update specific files
    if (filename === 'globals_type.html') {
        const header = new htmlParser.HTMLElement('h1')
        header.innerHTML = 'TypeDefs'
        body.querySelector('#doc-content').prependChild(header)
    } else if (filename === 'globals_enum.html') {
        const header = new htmlParser.HTMLElement('h1')
        header.innerHTML = 'Enums'
        body.querySelector('#doc-content').prependChild(header)
    }

    // write back to file
    const docHeader = `---
layout: documentation
parents: Documentation > API
title: "${title}"
permalink: documentation/api/${updateFilenames(filename)}/
---\n\n`
    fs.writeFileSync(
        fullPath, 
        docHeader + escapeCurlyBraces(body.innerHTML)
    )
})