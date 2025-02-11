const htmlParser = require('node-html-better-parser')
const fs = require('fs')
const path = require('path')

const htmlFolder = path.join(__dirname, '..', 'documentation', 'api')
const coreOrigHeadFilePath = path.join(__dirname, '..', '.git', 'modules', 'resources', 'VUEngine-Core', 'ORIG_HEAD')

let coreCommitId = 'master'
if (fs.existsSync(coreOrigHeadFilePath)) {
    coreCommitId = fs.readFileSync(coreOrigHeadFilePath).toString().trim()
}

// delete specific unwanted files
const toDelete = [
    'annotated.html',
    'bc_s.png',
    'bc_sd.png',
    'clipboard.js',
    'doxygen_crawl.html',
    'doc.svg',
    'docd.svg',
    'doxygen.css',
    'doxygen.svg',
    'dynsections.js',
    'files.html',
    'folderclosed.svg',
    'folderclosedd.svg',
    'folderopen.svg',
    'folderopend.svg',
    'hierarchy.html',
    'index.html',
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
        fs.rmSync(fullPath)
    }
})

const escapeCurlyBraces = (text) => {
    return text.replace(/{{/g, '{% raw %}{{{% endraw %}')
}

const updateFilenames = (filename) => {
    return path.parse(filename).name.replace(/_/g, '-')
}

// build catalog of source files for later replacements
const sourceCatalog = {};
const sourceFilenames = fs.readdirSync(htmlFolder).filter(function (elm) {
	return elm.startsWith('_') && elm.match(/.*\.(html)/ig)
})
sourceFilenames.map((filename) => {
    // get file body content
    const fullPath = path.join(htmlFolder, filename)
	const fileContent = fs.readFileSync(fullPath).toString()
    const html = htmlParser.parse(fileContent)
    const body = html?.querySelector('body')
    if (!body) {
        return
    }

    const sourcePath = [];
    body.querySelectorAll('#nav-path li')?.forEach(el => sourcePath.push(el.text))
    sourcePath.push(body.querySelector('.headertitle')?.text.replace(' File Reference', ''))
    sourcePath[0] = `https://github.com/VUEngine/VUEngine-Core/tree/${coreCommitId}`
    sourceCatalog[filename] = sourcePath.join('/')
    fs.rmSync(fullPath)
})

// post process files
const filenames = fs.readdirSync(htmlFolder).filter(function (elm) {
	return elm.match(/.*\.(html)/ig)
})
filenames.map((filename) => {
    // get file body content
    const fullPath = path.join(htmlFolder, filename)
	const fileContent = fs.readFileSync(fullPath).toString()
    const html = htmlParser.parse(fileContent)
    const body = html?.querySelector('body')
    if (!body) {
        return
    }

    // remove some files like directory listings
    if (
        filename.startsWith('dir_') || 
        filename.startsWith('functions') ||
        (filename.startsWith('globals') && filename !== 'globals_enum.html' && filename !== 'globals_type.html')
    ) {
        return fs.rmSync(fullPath)
    }

    // remove unwanted parts
    body.querySelector('#titlearea')?.remove()
    body.querySelectorAll('.footer')?.forEach(el => el.remove())
    body.querySelectorAll('.permalink')?.forEach(el => el.remove())
    body.querySelectorAll('td.memSeparator')?.forEach(el => el.parentNode.remove())
    body.querySelectorAll('script')?.forEach(el => el.remove())
    body.querySelector('#nav-path')?.remove()
    body.querySelector('.summary')?.remove()

    // change some tags
    body.querySelectorAll('hr')?.forEach(el => el.tagName = 'br')
    
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
        const hrefPath = href?.split('#')[0];
        const anchor = href?.split('#')[1];
        if (hrefPath && hrefPath.startsWith('_') && sourceCatalog[hrefPath]) {
            el.setAttribute(
                'href', 
                `${sourceCatalog[hrefPath]}${anchor && anchor.startsWith('l') ? `#${anchor.replace(/^l0*/, 'L')}` : ''}`
            )
        } else if (href && !href.startsWith('#')) {
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