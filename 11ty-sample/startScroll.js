var overlay = basicScroll.create({
    elem: document.querySelector('.overlay'), 
    from: 'top-top',
    to: 'bottom-top',
    props: {
        '--title-pos': {
            from: 0,
            to: '60vh'
        }
    }

})