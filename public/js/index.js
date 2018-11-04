// 没做任何兼容...
window.onload = () => {
    const { request,  parseImgSize, dom,  random} = window.Util;
    const {isPc} = window.Config;
    const Api = {
        getAllImgs: (count) => request({method: 'post', url: '/allimgs', data: {count}}),
    }
    // 单例模式
    const Page = {
        container: document.getElementById('app'),
        activeImg: {},
        imgSize:[],
        activeIndex: 0,
        showLargeImage(){
            const lc = dom('large-img-container'), lmge = dom('large-img');
            dom('nav').click(() => {
                const {src, vWidth, vHeight} = Page.activeImg;
                lc.css({width:`${vWidth}px`});
                lmge.css({height:  `${vHeight}px`})
                lmge.attr({src});
                lc.show();
            })
            dom('close').click(() => {
                lc.hide()
            })
        },
        addBarImg(urls){
            const container = dom('navs'), imgShow = dom('img-container');
            const htmls = urls.map((src, index) => `<img src="./${src}" link="${src}"  index="${index}"/>`);
            container.html(htmls.join(''));

            const {innerWidth, innerHeight} = window;
            let imgSizes;
            const promises = urls.map(src => parseImgSize(src, innerWidth-20));
            Promise.all(promises).then((data) => {
                imgSizes =  data;
                Page.activeImg = data[0];
                Page.imgSize = data;
            })

            container.onclick = ({target}) => {
                const src = target.getAttribute('link'), index = target.getAttribute('index');
                imgShow.attr({'src':`./${src}`});
                Page.activeImg = imgSizes[Number(index)];
            }
            return container;
        },
        mounted(that){
            Api.getAllImgs(3).then(({data: {urls}}) => {
               that.addBarImg(urls)
            })
            that.showLargeImage();

            if(!isPc){
                dom('app').addClass('at-phone')
                dom('right').hide();
                dom('left').css({background: 'rgba(0,0,0,0.7)'})
                dom('phone-head').show();

                const  imgShow = dom('img-container');

                dom('next').click(() => {
                    Page.activeIndex++;
                    if(Page.activeIndex >= Page.imgSize.length){
                        Page.activeIndex = 0;
                    }
                    const {src} = Page.imgSize[Page.activeIndex]
                    imgShow.attr({'src':`./${src}`});
                })

                dom('prev').click(() => {
                    Page.activeIndex--;
                    if(Page.activeIndex < 0){
                        Page.activeIndex = Page.imgSize.length-1;
                    }
                    const {src} = Page.imgSize[Page.activeIndex]
                    imgShow.attr({'src':`./${src}`});
                })
            }
        }
    }

    Page.mounted(Page)
















}